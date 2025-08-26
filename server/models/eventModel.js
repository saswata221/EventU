const db = require("../config/db");

class Event {
  // Get all events
  static async getAllEvents(filters = {}) {
    try {
      let query = `
      SELECT id, title, description, poster_url, image_url,
             price_from::float, start_date, end_date,
             languages, age_limit, duration_hours::float,
             category, venue, artist_names, artist_images,
             rating, status, created_at, updated_at
      FROM events
      WHERE status = 'active'
    `;

      const values = [];
      let count = 1;

      if (filters.category) {
        query += ` AND category ILIKE $${count++}`;
        values.push(filters.category);
      }

      if (filters.rating) {
        query += ` AND rating >= $${count++}`;
        values.push(filters.rating);
      }

      query += " ORDER BY start_date ASC";

      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }
  }

  // Get event by ID
  static async getEventById(id) {
    const query = `
    SELECT
      id,
      title,
      description,
      image_url,
      image_url AS poster_url,   -- 👈 alias added
      price_from::float AS price_from,
      start_date,
      end_date,
      languages,
      age_limit,
      duration_hours::float AS duration_hours,
      category,
      venue,
      artist_names,
      artist_images,
      status,
      created_at,
      updated_at
    FROM events
    WHERE id = $1 AND status = 'active'
  `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  // Create new event
  static async createEvent(data) {
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
    } = data;

    const query = `
      INSERT INTO events (
        title, description, image_url, price_from, start_date, end_date,
        languages, age_limit, duration_hours, category, venue, artist_names, artist_images
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *
    `;

    const values = [
      title,
      description || null,
      image_url || null,
      price_from,
      start_date,
      end_date,
      languages || [],
      age_limit || null,
      duration_hours || null,
      category,
      venue || null,
      artist_names || [],
      artist_images || [],
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Update event
  static async updateEvent(id, data) {
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
    } = data;

    const query = `
      UPDATE events SET
        title = $1,
        description = $2,
        image_url = $3,
        price_from = $4,
        start_date = $5,
        end_date = $6,
        languages = $7,
        age_limit = $8,
        duration_hours = $9,
        category = $10,
        venue = $11,
        artist_names = $12,
        artist_images = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      title,
      description || null,
      image_url || null,
      price_from,
      start_date,
      end_date,
      languages || [],
      age_limit || null,
      duration_hours || null,
      category,
      venue || null,
      artist_names || [],
      artist_images || [],
      id,
    ];

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  // Delete event (soft delete)
  static async deleteEvent(id) {
    const result = await db.query(
      `UPDATE events SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = Event;
