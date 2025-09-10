// server/controllers/bookingController.js
const pool = require("../config/db");

// Map time ranges to hours
function timeRangeToSql(range) {
  switch (range) {
    case "morning":
      return { start: 6, end: 12 };
    case "afternoon":
      return { start: 12, end: 16 };
    case "evening":
      return { start: 16, end: 20 };
    case "night":
      // handled specially in SQL (>=20 OR <6)
      return { start: 20, end: 24 };
    default:
      return null;
  }
}

// GET /booking/:id
// id = movie tmdb_id (string) OR event id (number)
exports.getBookingData = async (req, res) => {
  const { id } = req.params;
  const { date, timeRange } = req.query;

  // default to today (local YYYY-MM-DD)
  const dateStr = date || new Date().toISOString().slice(0, 10);
  const range = timeRangeToSql(timeRange);

  try {
    const asNum = Number(id);

    // ---------- EVENT BRANCH (numeric id) ----------
    if (!Number.isNaN(asNum)) {
      const eQ = `SELECT id, title FROM events WHERE id = $1 LIMIT 1;`;
      const eRes = await pool.query(eQ, [asNum]);

      if (eRes.rows.length) {
        const event = eRes.rows[0];

        // Pick ONE random hall that actually has at least one matching showtime
        let hallPickSql = `
          SELECT h.id, h.name
          FROM event_halls h
          WHERE h.event_id = $1
            AND EXISTS (
              SELECT 1
              FROM event_showtimes es
              WHERE es.hall_id = h.id
                AND DATE(es.show_time) = $2
        `;
        const hallPickParams = [event.id, dateStr];

        if (range) {
          if (timeRange === "night") {
            hallPickSql += ` AND (EXTRACT(HOUR FROM es.show_time) >= 20 OR EXTRACT(HOUR FROM es.show_time) < 6)`;
          } else {
            hallPickSql += ` AND EXTRACT(HOUR FROM es.show_time) >= $3 AND EXTRACT(HOUR FROM es.show_time) < $4`;
            hallPickParams.push(range.start, range.end);
          }
        }
        hallPickSql += `) ORDER BY random() LIMIT 1;`;

        const hallRes = await pool.query(hallPickSql, hallPickParams);

        let hall = null;
        if (hallRes.rows.length) {
          const h = hallRes.rows[0];

          // Now fetch the actual showtimes for THAT hall for the same date/filter
          let stQ = `
            SELECT show_time
            FROM event_showtimes
            WHERE hall_id = $1
              AND DATE(show_time) = $2
          `;
          const stParams = [h.id, dateStr];

          if (range) {
            if (timeRange === "night") {
              stQ += ` AND (EXTRACT(HOUR FROM show_time) >= 20 OR EXTRACT(HOUR FROM show_time) < 6)`;
            } else {
              stQ += ` AND EXTRACT(HOUR FROM show_time) >= $3 AND EXTRACT(HOUR FROM show_time) < $4`;
              stParams.push(range.start, range.end);
            }
          }

          stQ += ` ORDER BY show_time ASC`;
          const stRes = await pool.query(stQ, stParams);

          hall = {
            id: h.id,
            name: h.name,
            showtimes: stRes.rows.map((r) => r.show_time),
          };
        }

        return res.json({
          type: "event",
          id: event.id,
          title: event.title,
          hall, // single random hall (or null if no matching hall/showtimes)
          date: dateStr,
        });
      }
    }

    // ---------- MOVIE BRANCH (tmdb_id string) ----------
    const mQ = `
      SELECT id, tmdb_id, title, duration, is_adult, genres
      FROM current_movies
      WHERE tmdb_id = $1
      LIMIT 1;
    `;
    const mRes = await pool.query(mQ, [id]);

    if (!mRes.rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    const m = mRes.rows[0];

    // Gather theatres with showtimes for the date/filter
    let thQ = `
      SELECT
        t.id,
        t.name,
        COALESCE(
          JSON_AGG(ts.show_time ORDER BY ts.show_time) FILTER (WHERE ts.id IS NOT NULL),
          '[]'::json
        ) AS showtimes
      FROM theatres t
      LEFT JOIN theatre_showtimes ts
        ON ts.theatre_id = t.id
       AND DATE(ts.show_time) = $1
    `;
    const thParams = [dateStr];

    if (range) {
      if (timeRange === "night") {
        thQ += ` AND (EXTRACT(HOUR FROM ts.show_time) >= 20 OR EXTRACT(HOUR FROM ts.show_time) < 6)`;
      } else {
        thQ += ` AND EXTRACT(HOUR FROM ts.show_time) >= $2 AND EXTRACT(HOUR FROM ts.show_time) < $3`;
        thParams.push(range.start, range.end);
      }
    }

    thQ += ` GROUP BY t.id, t.name ORDER BY t.name ASC`;
    const thRes = await pool.query(thQ, thParams);

    return res.json({
      type: "movie",
      id: m.id,
      tmdb_id: m.tmdb_id,
      title: m.title,
      duration: m.duration,
      is_adult: m.is_adult,
      genres: m.genres,
      theatres: thRes.rows,
      date: dateStr,
    });
  } catch (err) {
    console.error("getBookingData error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /booking
exports.createBooking = async (req, res) => {
  try {
    const { itemType, itemId, placeId, showTime } = req.body;
    const userId = req.user.id;

    if (!itemType || !itemId || !placeId || !showTime) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // For now, just echo payload (replace with seat-lock/insert logic later)
    return res.json({
      success: true,
      message: "Booking request received",
      booking: { userId, itemType, itemId, placeId, showTime },
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
