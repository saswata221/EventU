// controllers/eventController.js
const Event = require("../models/eventModel");

class EventController {
  // Get all events
  static async getAllEvents(req, res) {
    try {
      const events = await Event.getAllEvents();

      res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        data: events,
        count: events.length,
      });
    } catch (error) {
      console.error("Error in getAllEvents:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get event by ID
  static async getEventById(req, res) {
    try {
      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const event = await Event.getEventById(parseInt(id));

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event fetched successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error in getEventById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create new event
  static async createEvent(req, res) {
    try {
      const eventData = req.body;

      // Basic validation
      const requiredFields = [
        "title",
        "price_from",
        "start_date",
        "end_date",
        "category",
      ];
      const missingFields = requiredFields.filter((field) => !eventData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const newEvent = await Event.createEvent(eventData);

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
    } catch (error) {
      console.error("Error in createEvent:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const eventData = req.body;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const updatedEvent = await Event.updateEvent(parseInt(id), eventData);

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      console.error("Error in updateEvent:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const deletedEvent = await Event.deleteEvent(parseInt(id));

      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get events by category
  static async getEventsByCategory(req, res) {
    try {
      const { category } = req.params;

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category parameter is required",
        });
      }

      const events = await Event.getEventsByCategory(category);

      res.status(200).json({
        success: true,
        message: `Events in ${category} category fetched successfully`,
        data: events,
        count: events.length,
      });
    } catch (error) {
      console.error("Error in getEventsByCategory:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = EventController;
