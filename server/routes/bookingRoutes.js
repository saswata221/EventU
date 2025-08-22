const express = require("express");
const { getBookingData } = require("../controllers/bookingController");

const router = express.Router();

// Get booking details by movie ID
router.get("/:id", getBookingData);

module.exports = router;
