// server/cron/refreshEventShowtimes.js
const cron = require("node-cron");
const pool = require("../config/db");

// WIPES all event showtimes, then seeds today → +6 days for every hall.
const SQL = `
BEGIN;

DELETE FROM public.event_showtimes;

INSERT INTO public.event_showtimes (hall_id, show_time)
SELECT
  h.id,
  make_timestamptz(
    EXTRACT(YEAR  FROM d)::int,
    EXTRACT(MONTH FROM d)::int,
    EXTRACT(DAY   FROM d)::int,
    EXTRACT(HOUR  FROM t)::int,
    EXTRACT(MINUTE FROM t)::int,
    0,
    'Asia/Kolkata'
  )
FROM public.event_halls h
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '6 days',
  INTERVAL '1 day'
) AS d
CROSS JOIN unnest(ARRAY[
  '10:00'::time,'12:30'::time,'15:00'::time,
  '17:30'::time,'19:00'::time,'21:30'::time
]) AS t;

COMMIT;
`;

function startRefreshEventCron() {
  // Daily at 00:07 IST (staggered)
  cron.schedule(
    "7 0 * * *",
    async () => {
      try {
        await pool.query(SQL);
        console.log("[CRON] Event showtimes wiped & re-seeded ✅");
      } catch (err) {
        console.error("[CRON] Event showtimes refresh failed ❌", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // Seed immediately on boot (optional). Remove if you don’t want this.
  (async () => {
    try {
      await pool.query(SQL);
      console.log("[CRON] Event showtimes seeded on boot ✅");
    } catch (err) {
      console.error("[CRON] Event boot seed failed ❌", err);
    }
  })();
}

module.exports = { startRefreshEventCron };
