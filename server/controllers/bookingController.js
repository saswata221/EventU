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
      return { start: 20, end: 24 };
    default:
      return null;
  }
}

// GET /booking/:id
exports.getBookingData = async (req, res) => {
  const { id } = req.params; // movie tmdb_id OR numeric event id
  const { date, timeRange } = req.query;

  const dateStr = date || new Date().toISOString().slice(0, 10);
  const range = timeRangeToSql(timeRange);

  try {
    const asNum = Number(id);
    if (!Number.isNaN(asNum)) {
      // EVENT
      const eQ = `SELECT id, title FROM events WHERE id = $1 LIMIT 1;`;
      const eRes = await pool.query(eQ, [asNum]);

      if (eRes.rows.length) {
        const event = eRes.rows[0];
        const hallQ = `SELECT id, name FROM event_halls WHERE event_id = $1 LIMIT 1;`;
        const hallRes = await pool.query(hallQ, [event.id]);

        let hall = null;
        if (hallRes.rows.length) {
          const h = hallRes.rows[0];
          let stQ = `SELECT show_time FROM event_showtimes WHERE hall_id = $1 AND DATE(show_time) = $2`;
          const params = [h.id, dateStr];
          if (range) {
            if (timeRange === "night") {
              stQ += ` AND (EXTRACT(HOUR FROM show_time) >= 20 OR EXTRACT(HOUR FROM show_time) < 6)`;
            } else {
              stQ += ` AND EXTRACT(HOUR FROM show_time) >= $3 AND EXTRACT(HOUR FROM show_time) < $4`;
              params.push(range.start, range.end);
            }
          }
          stQ += ` ORDER BY show_time ASC`;
          const stRes = await pool.query(stQ, params);

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
          hall,
          date: dateStr,
        });
      }
    }

    // MOVIE
    const mQ = `SELECT id, tmdb_id, title, duration, is_adult, genres FROM current_movies WHERE tmdb_id = $1 LIMIT 1;`;
    const mRes = await pool.query(mQ, [id]);

    if (!mRes.rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    const m = mRes.rows[0];

    let thQ = `
      SELECT t.id, t.name,
        COALESCE(
          JSON_AGG(ts.show_time ORDER BY ts.show_time) FILTER (WHERE ts.id IS NOT NULL),
          '[]'
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
