// server/middleware/optionalAuth.js
const { verifyAccessToken } = require("../utils/jwt");

function optionalAuth(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {}
  next();
}

module.exports = optionalAuth;
