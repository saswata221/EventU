const express = require("express");
const { postMessage } = require("../controllers/messageController");

const router = express.Router();

// Save user message
router.post("/", postMessage);

module.exports = router;
