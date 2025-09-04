// server/routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Usually public "contact us"
router.post(
  "/",
  messageController.createMessage ||
    ((_req, res) => res.status(501).json({ error: "Not implemented" }))
);

module.exports = router;
