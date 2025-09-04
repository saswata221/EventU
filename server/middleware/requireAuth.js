// server/middleware/requireAuth.js
const { verifyAccessToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
