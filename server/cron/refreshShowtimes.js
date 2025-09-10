// server/cron/refreshShowtimes.js
const cron = require("node-cron");
const pool = require("../config/db");

// Deletes past movie showtimes and seeds today → +6 days for all theatres.
const SQL = `
BEGIN;

DELETE FROM public.theatre_showtimes
WHERE show_time::date < CURRENT_DATE;

INSERT INTO public.theatre_showtimes (theatre_id, show_time)
SELECT
  t.id,
  make_timestamptz(
    EXTRACT(YEAR  FROM d)::int,
    EXTRACT(MONTH FROM d)::int,
    EXTRACT(DAY   FROM d)::int,
    EXTRACT(HOUR  FROM tm)::int,
    EXTRACT(MINUTE FROM tm)::int,
    0,
    'Asia/Kolkata'
  )
FROM public.theatres t
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '6 days',
  INTERVAL '1 day'
) AS d
CROSS JOIN unnest(ARRAY[
  '09:00'::time,'10:30'::time,'12:00'::time,'13:30'::time,'15:00'::time,
  '16:30'::time,'18:00'::time,'19:30'::time,'21:00'::time,'22:30'::time
]) AS tm
ON CONFLICT DO NOTHING;

COMMIT;
`;

function startRefreshCron() {
  // Daily at 00:05 IST
  cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        await pool.query(SQL);
        console.log("[CRON] Movie showtimes refreshed ✅");
      } catch (err) {
        console.error("[CRON] Movie showtimes refresh failed ❌", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // Seed immediately on boot (optional). Remove if you don’t want this.
  (async () => {
    try {
      await pool.query(SQL);
      console.log("[CRON] Movie showtimes seeded on boot ✅");
    } catch (err) {
      console.error("[CRON] Movie boot seed failed ❌", err);
    }
  })();
}

module.exports = { startRefreshCron };
