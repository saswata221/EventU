// models/eventModel.js
const db = require("../config/db"); // Assuming you have a db config file

class Event {
  // Get all events
  static async getAllEvents() {
    try {
      const query = `
                SELECT id, title, description, image_url, price_from, 
                       start_date, end_date, languages, age_limit, 
                       duration_hours, category, venue, artist_names, 
                       artist_images, status, created_at, updated_at
                FROM events 
                WHERE status = 'active'
                ORDER BY start_date ASC
            `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }
  }

  // Get event by ID
  static async getEventById(id) {
    try {
      const query = `
                SELECT id, title, description, image_url, price_from, 
                       start_date, end_date, languages, age_limit, 
                       duration_hours, category, venue, artist_names, 
                       artist_images, status, created_at, updated_at
                FROM events 
                WHERE id = $1 AND status = 'active'
            `;
      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching event: ${error.message}`);
    }
  }

  // Create new event
  static async createEvent(eventData) {
    try {
      const {
        title,
        description,
        image_url,
        price_from,
        start_date,
        end_date,
        languages,
        age_limit,
        duration_hours,
        category,
        venue,
        artist_names,
        artist_images,
      } = eventData;

      const query = `
                INSERT INTO events (
                    title, description, image_url, price_from, start_date, 
                    end_date, languages, age_limit, duration_hours, category, 
                    venue, artist_names, artist_images
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *
            `;

      const values = [
        title,
        description,
        image_url,
        price_from,
        start_date,
        end_date,
        languages,
        age_limit,
        duration_hours,
        category,
        venue,
        artist_names,
        artist_images,
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  // Update event
  static async updateEvent(id, eventData) {
    try {
      const {
        title,
        description,
        image_url,
        price_from,
        start_date,
        end_date,
        languages,
        age_limit,
        duration_hours,
        category,
        venue,
        artist_names,
        artist_images,
      } = eventData;

      const query = `
                UPDATE events 
                SET title = $1, description = $2, image_url = $3, price_from = $4, 
                    start_date = $5, end_date = $6, languages = $7, age_limit = $8, 
                    duration_hours = $9, category = $10, venue = $11, 
                    artist_names = $12, artist_images = $13, updated_at = CURRENT_TIMESTAMP
                WHERE id = $14
                RETURNING *
            `;

      const values = [
        title,
        description,
        image_url,
        price_from,
        start_date,
        end_date,
        languages,
        age_limit,
        duration_hours,
        category,
        venue,
        artist_names,
        artist_images,
        id,
      ];

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  // Delete event (soft delete by changing status)
  static async deleteEvent(id) {
    try {
      const query = `
                UPDATE events 
                SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id
            `;

      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  // Get events by category
  static async getEventsByCategory(category) {
    try {
      const query = `
                SELECT id, title, description, image_url, price_from, 
                       start_date, end_date, languages, age_limit, 
                       duration_hours, category, venue, artist_names, 
                       artist_images, status, created_at, updated_at
                FROM events 
                WHERE category ILIKE $1 AND status = 'active'
                ORDER BY start_date ASC
            `;
      const result = await db.query(query, [`%${category}%`]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching events by category: ${error.message}`);
    }
  }
}

module.exports = Event;
