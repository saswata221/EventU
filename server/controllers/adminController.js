// server/controllers/adminController.js
const pool = require("../config/db");

/**
 * Seed theatre_showtimes for ALL theatres:
 * - removes existing rows
 * - inserts 6 fixed times per day (10:00, 13:00, 16:00, 19:00, 22:00, 23:59)
 * - for today + next 2 days (total 3 days)
 */
exports.seedTheatreShowtimes = async (_req, res) => {
  const sql = `
  DO $$
  DECLARE
    d DATE;
    t RECORD;
    times TEXT[] := ARRAY['10:00','13:00','16:00','19:00','22:00','23:59'];
  BEGIN
    -- wipe existing theatre showtimes (only theatre_showtimes, not theatres)
    DELETE FROM theatre_showtimes;

    -- for each theatre, insert today + next 2 days at fixed times
    FOR t IN SELECT id FROM theatres LOOP
      FOR d IN SELECT generate_series(CURRENT_DATE, CURRENT_DATE + 2, interval '1 day')::date LOOP
        FOREACH tStr IN ARRAY times LOOP
          INSERT INTO theatre_showtimes (theatre_id, show_time, created_at)
          VALUES (t.id, (d::timestamp + tStr::time), NOW());
        END LOOP;
      END LOOP;
    END LOOP;
  END $$;
  `;

  try {
    await pool.query(sql);
    res.json({
      ok: true,
      message: "theatre_showtimes seeded for today + next 2 days (6/day).",
    });
  } catch (err) {
    console.error("seedTheatreShowtimes error:", err);
    res.status(500).json({ error: "Failed to seed theatre showtimes" });
  }
};
