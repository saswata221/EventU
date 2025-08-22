const express = require("express");
const { postFeedback } = require("../controllers/feedbackController");

const router = express.Router();

// Save user feedback
router.post("/", postFeedback);

module.exports = router;
