// server/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const requireAuth = require("../middleware/requireAuth");

// Public route – get theatres/halls + showtimes
router.get("/:id", bookingController.getBookingData);

// Protected route – create booking
router.post("/", requireAuth, bookingController.createBooking);

module.exports = router;
