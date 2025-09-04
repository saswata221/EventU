// server/middleware/requireRole.js
module.exports = function requireRole(...allowed) {
  return function (req, res, next) {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: "Unauthorized" });
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
