// server/utils/jwt.js
const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_secret";
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || "15m";

function signAccessToken(user) {
  // keep payload small
  const payload = { sub: String(user.id), role: user.role };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
