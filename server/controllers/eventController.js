const Event = require("../models/eventModel");

class EventController {
  static async getAllEvents(req, res) {
    try {
      const { category, rating } = req.query;
      const events = await Event.getAllEvents({ category, rating });

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

  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      if (!/^\d+$/.test(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }
      const event = await Event.getEventById(Number(id));
      if (!event)
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      res.status(200).json({ success: true, data: event });
    } catch (error) {
      console.error("getEventById error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch event" });
    }
  }

  static async createEvent(req, res) {
    try {
      const required = [
        "title",
        "price_from",
        "start_date",
        "end_date",
        "category",
      ];
      const missing = required.filter((f) => !req.body?.[f]);
      if (missing.length) {
        return res
          .status(400)
          .json({ success: false, message: `Missing: ${missing.join(", ")}` });
      }
      const newEvent = await Event.createEvent(req.body);
      res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
      console.error("createEvent error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create event" });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      if (!/^\d+$/.test(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }
      const updated = await Event.updateEvent(Number(id), req.body);
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("updateEvent error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update event" });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      if (!/^\d+$/.test(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }
      const deleted = await Event.deleteEvent(Number(id));
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
      console.error("deleteEvent error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete event" });
    }
  }
}

module.exports = EventController;
