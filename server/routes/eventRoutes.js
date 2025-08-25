// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const EventController = require("../controllers/eventController");

// GET /api/events - Get all events
router.get("/", EventController.getAllEvents);

// GET /api/events/:id - Get event by ID
router.get("/:id", EventController.getEventById);

// POST /api/events - Create new event
router.post("/", EventController.createEvent);

// PUT /api/events/:id - Update event
router.put("/:id", EventController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete("/:id", EventController.deleteEvent);

// GET /api/events/category/:category - Get events by category
router.get("/category/:category", EventController.getEventsByCategory);

module.exports = router;
