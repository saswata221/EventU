// server/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const requireAuth = require("../middleware/requireAuth");

// Public could fetch global feedback if you expose it
router.get(
  "/",
  feedbackController.getAllFeedback || ((_req, res) => res.json([]))
);

// Only logged-in users can submit feedback
router.post(
  "/",
  requireAuth,
  feedbackController.createFeedback ||
    ((_req, res) => res.status(501).json({ error: "Not implemented" }))
);

module.exports = router;
