// server/controllers/authController.js
const { hashPassword, comparePassword } = require("../utils/password");
const { signAccessToken } = require("../utils/jwt");
const {
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshCookie,
  parseMs,
} = require("../utils/cookies");
const {
  randomToken,
  createToken,
  findValidByToken,
  revoke,
  revokeAllRefreshForUser,
  markUsed,
} = require("../models/tokenModel");
const Users = require("../models/userModel");
const { sendMail } = require("../utils/mailer");

const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || "7d";
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const APP_URL = process.env.APP_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:5000";

function serializeUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    is_active: u.is_active,
    email_verified_at: u.email_verified_at,
    created_at: u.created_at,
    updated_at: u.updated_at,
  };
}

async function issueSession(res, user, req) {
  // 1) access token
  const accessToken = signAccessToken(user);

  // 2) refresh token (opaque)
  const rt = randomToken();
  const expiresAt = new Date(Date.now() + parseMs(REFRESH_TTL));
  await createToken({
    userId: user.id,
    type: "refresh",
    token: rt,
    expiresAt,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });
  setRefreshCookie(res, rt);

  return accessToken;
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email, password are required" });
    }

    const exists = await Users.findByEmail(email);
    if (exists)
      return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await hashPassword(password);
    const user = await Users.createUser({
      name,
      email,
      passwordHash,
      role: "public",
    });

    // email verification token (48h)
    const ev = randomToken();
    const verifyExpires = new Date(Date.now() + 48 * 3600 * 1000);
    await createToken({
      userId: user.id,
      type: "email_verify",
      token: ev,
      expiresAt: verifyExpires,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    const verifyUrl = `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(
      ev
    )}`;
    await sendMail({
      to: user.email,
      subject: "Verify your EventU email",
      html: `<p>Hello ${user.name},</p><p>Verify your email by clicking this link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    const accessToken = await issueSession(res, user, req);
    return res.status(201).json({
      user: serializeUser(user),
      accessToken,
      access_token_ttl: ACCESS_TOKEN_TTL,
    });
  } catch (e) {
    console.error("signup error:", e);
    return res.status(500).json({ error: "Failed to sign up" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const u = await Users.findByEmail(email);
    if (!u) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await comparePassword(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    if (!u.is_active)
      return res.status(403).json({ error: "Account disabled" });

    const accessToken = await issueSession(res, u, req);
    return res.json({
      user: serializeUser(u),
      accessToken,
      access_token_ttl: ACCESS_TOKEN_TTL,
    });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ error: "Failed to login" });
  }
}

async function refresh(req, res) {
  try {
    const cookie = getRefreshCookie(req);
    if (!cookie) return res.status(401).json({ error: "No refresh token" });

    const tokenRow = await findValidByToken("refresh", cookie);
    if (!tokenRow) {
      // clear cookie just in case
      clearRefreshCookie(res);
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // rotate: revoke current, create a new one
    await revoke(tokenRow.id);

    // fetch user
    const user = await Users.findById(tokenRow.user_id);
    if (!user || !user.is_active) {
      clearRefreshCookie(res);
      return res.status(401).json({ error: "User not active" });
    }

    const accessToken = await issueSession(res, user, req);
    return res.json({ accessToken, access_token_ttl: ACCESS_TOKEN_TTL });
  } catch (e) {
    console.error("refresh error:", e);
    return res.status(500).json({ error: "Failed to refresh" });
  }
}

async function logout(req, res) {
  try {
    const cookie = getRefreshCookie(req);
    if (cookie) {
      const row = await findValidByToken("refresh", cookie);
      if (row) await revoke(row.id);
    }
    clearRefreshCookie(res);
    return res.status(204).send();
  } catch (e) {
    console.error("logout error:", e);
    return res.status(500).json({ error: "Failed to logout" });
  }
}

async function me(req, res) {
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user: serializeUser(user) });
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "token required" });
    const row = await findValidByToken("email_verify", token);
    if (!row)
      return res.status(400).json({ error: "Invalid or expired token" });

    await Users.markEmailVerified(row.user_id);
    await markUsed(row.id);
    return res.json({ ok: true });
  } catch (e) {
    console.error("verifyEmail error:", e);
    return res.status(500).json({ error: "Failed to verify email" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });

    const u = await Users.findByEmail(email);
    // respond the same way even if not found (avoid user enumeration)
    if (u) {
      const token = randomToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 min
      await createToken({
        userId: u.id,
        type: "password_reset",
        token,
        expiresAt,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
      const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(
        token
      )}`;
      await sendMail({
        to: email,
        subject: "Reset your EventU password",
        html: `<p>Reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("forgotPassword error:", e);
    return res.status(500).json({ error: "Failed to start reset" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword)
      return res.status(400).json({ error: "token and newPassword required" });

    const row = await findValidByToken("password_reset", token);
    if (!row)
      return res.status(400).json({ error: "Invalid or expired token" });

    const hash = await hashPassword(newPassword);
    await Users.updatePassword(row.user_id, hash);
    await markUsed(row.id);

    // revoke all refresh tokens to force re-login on other devices
    await revokeAllRefreshForUser(row.user_id);

    return res.json({ ok: true });
  } catch (e) {
    console.error("resetPassword error:", e);
    return res.status(500).json({ error: "Failed to reset password" });
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
