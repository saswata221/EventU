// server/models/tokenModel.js
const pool = require("../config/db");
const crypto = require("crypto");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}

async function createToken({ userId, type, token, expiresAt, userAgent, ip }) {
  const tokenHash = sha256(token);
  const q = `
    INSERT INTO user_tokens (user_id, type, token_hash, user_agent, ip, expires_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id, user_id, type, expires_at, used_at, revoked_at, created_at
  `;
  const { rows } = await pool.query(q, [
    userId,
    type,
    tokenHash,
    userAgent || null,
    ip || null,
    expiresAt,
  ]);
  return { ...rows[0], token }; // return plaintext token to caller (for cookie/link)
}

async function findValidByToken(type, token) {
  const tokenHash = sha256(token);
  const q = `
    SELECT * FROM user_tokens
    WHERE type = $1 AND token_hash = $2
      AND used_at IS NULL AND revoked_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [type, tokenHash]);
  return rows[0] || null;
}

async function markUsed(id) {
  await pool.query("UPDATE user_tokens SET used_at = NOW() WHERE id = $1", [
    id,
  ]);
}

async function revoke(id) {
  await pool.query("UPDATE user_tokens SET revoked_at = NOW() WHERE id = $1", [
    id,
  ]);
}

async function revokeAllRefreshForUser(userId) {
  await pool.query(
    "UPDATE user_tokens SET revoked_at = NOW() WHERE user_id = $1 AND type = 'refresh' AND revoked_at IS NULL",
    [userId]
  );
}

module.exports = {
  sha256,
  randomToken,
  createToken,
  findValidByToken,
  markUsed,
  revoke,
  revokeAllRefreshForUser,
};
