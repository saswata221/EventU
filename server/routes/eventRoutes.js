// server/routes/eventRoutes.js
const express = require("express");
const router = express.Router();

const EventController = require("../controllers/eventController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Public browse
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);

// Manager or Admin can mutate
router.post(
  "/",
  requireAuth,
  requireRole(["manager", "admin"]),
  EventController.createEvent
);
router.put(
  "/:id",
  requireAuth,
  requireRole(["manager", "admin"]),
  EventController.updateEvent
);
router.delete(
  "/:id",
  requireAuth,
  requireRole(["manager", "admin"]),
  EventController.deleteEvent
);

module.exports = router;
