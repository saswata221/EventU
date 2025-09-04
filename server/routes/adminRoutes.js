// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const admin = require("../controllers/adminController");

// Only managers and admins may seed
router.post(
  "/seed-showtimes",
  requireAuth,
  requireRole("manager", "admin"),
  admin.seedTheatreShowtimes
);

module.exports = router;
