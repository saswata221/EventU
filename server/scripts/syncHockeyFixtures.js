// server/scripts/syncHockeyFixtures.js
//
// Sync upcoming hockey games from API-HOCKEY (RapidAPI) into:
//   - hockey_teams
//   - hockey_fixtures
//
// Usage:
//   HOCKEY_API_KEY=xxx node server/scripts/syncHockeyFixtures.js

require("dotenv").config();
const fetch = global.fetch || require("node-fetch");
const pool = require("../config/db");
const { upsertTeam, upsertEvent } = require("../models/hockeyModel");

// Config
const HOCKEY_API_KEY =
  process.env.HOCKEY_API_KEY || process.env.RAPIDAPI_HOCKEY_KEY;
const HOCKEY_API_HOST =
  process.env.HOCKEY_API_HOST || "api-hockey.p.rapidapi.com";

// Number of days (today + N-1)
const DAYS = Number(process.env.HOCKEY_SYNC_DAYS || 7);

// Timezone for API-Sports style APIs ("Asia/Kolkata" is fine)
const API_TIMEZONE = process.env.HOCKEY_API_TZ || "Asia/Kolkata";

if (!HOCKEY_API_KEY) {
  console.error("Please set HOCKEY_API_KEY (RapidAPI key) in .env");
  process.exit(1);
}

// Helper: create array of YYYY-MM-DD strings for today → N-1 days
function getNextDates(days) {
  const out = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i)
    );
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    out.push(`${yyyy}-${mm}-${dd}`);
  }
  return out;
}

// Normalize API-HOCKEY "game" object → our internal structure
function normalizeGame(g) {
  if (!g) return null;

  // Kickoff time
  let kickoff_utc = null;

  // Common API-Sports style: timestamp in seconds
  if (g.timestamp && Number.isFinite(Number(g.timestamp))) {
    kickoff_utc = new Date(Number(g.timestamp) * 1000).toISOString();
  } else if (g.date && typeof g.date === "string") {
    const d = new Date(g.date);
    if (!isNaN(d)) kickoff_utc = d.toISOString();
  } else if (g.date && typeof g.date === "object") {
    if (g.date.start) {
      const d = new Date(g.date.start);
      if (!isNaN(d)) kickoff_utc = d.toISOString();
    }
  }

  if (!kickoff_utc) return null;

  // Teams
  const home =
    (g.teams && g.teams.home) || g.home || g.homeTeam || g.team_home || null;
  const away =
    (g.teams && g.teams.away) || g.away || g.awayTeam || g.team_away || null;

  const home_name = home && (home.name || home.team || home.fullname);
  const away_name = away && (away.name || away.team || away.fullname);

  if (!home_name || !away_name) return null;

  const home_external_id =
    (home && (home.id || home.team_id || home.external_id)) || null;
  const away_external_id =
    (away && (away.id || away.team_id || away.external_id)) || null;

  const home_logo =
    (home && (home.logo || home.image || home.logo_url)) || null;
  const away_logo =
    (away && (away.logo || away.image || away.logo_url)) || null;

  // League / competition
  const league = g.league || g.competition || {};
  const competition_external_id = league.id ? String(league.id) : "";
  const competition_name = league.name || league.fullname || "";

  // Venue / arena
  const venue =
    (g.arena && g.arena.name) ||
    (g.venue && (g.venue.name || g.venue)) ||
    g.stadium ||
    null;

  // External id for this fixture
  const external_id = String(
    g.id || g.game_id || `${home_name}-${away_name}-${kickoff_utc}` // fallback
  );

  return {
    external_id,
    competition_external_id,
    competition_name,
    home_external_id: home_external_id ? String(home_external_id) : null,
    home_name: String(home_name),
    home_logo_url: home_logo || null,
    away_external_id: away_external_id ? String(away_external_id) : null,
    away_name: String(away_name),
    away_logo_url: away_logo || null,
    venue,
    kickoff_utc,
  };
}

// Fetch games for a given date
async function fetchGamesForDate(dateStr) {
  const url = `https://${HOCKEY_API_HOST}/games?date=${encodeURIComponent(
    dateStr
  )}&timezone=${encodeURIComponent(API_TIMEZONE)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": HOCKEY_API_KEY,
      "X-RapidAPI-Host": HOCKEY_API_HOST,
      Accept: "application/json",
    },
    timeout: 20000,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API-HOCKEY ${res.status}: ${txt}`);
  }

  const json = await res.json();

  // API-Sports usually returns { response: [ ... ] }
  if (Array.isArray(json.response)) return json.response;
  if (Array.isArray(json.games)) return json.games;
  return [];
}

// Main sync
async function syncHockeyUpcoming() {
  const client = await pool.connect();
  try {
    const dates = getNextDates(DAYS);
    console.log("Syncing hockey games for dates:", dates);

    const allGames = [];
    for (const d of dates) {
      try {
        const games = await fetchGamesForDate(d);
        console.log(`  ${d}: fetched ${games.length} games`);
        allGames.push(...games);
      } catch (e) {
        console.warn(`  ${d}: fetch failed:`, e.message || e);
      }
    }

    // De-duplicate by game id / composite key
    const seen = new Set();
    const uniqueGames = [];
    for (const g of allGames) {
      const id =
        g.id ||
        g.game_id ||
        (g.teams &&
          g.teams.home &&
          g.teams.away &&
          `${g.teams.home.id}-${g.teams.away.id}-${g.timestamp}`);
      const key = String(id || Math.random());
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueGames.push(g);
    }

    console.log("Total unique games:", uniqueGames.length);

    let upserted = 0;
    await client.query("BEGIN");

    // simple rotating openpark assignment
    const PARKS = [1, 2, 3, 4, 5, 6];
    let pi = 0;
    const nextPark = () => PARKS[pi++ % PARKS.length];

    for (const g of uniqueGames) {
      const norm = normalizeGame(g);
      if (!norm) continue;

      // Upsert teams (logo_id is null for API-HOCKEY, logos are URLs)
      const home_team_id = await upsertTeam(
        norm.home_external_id || null,
        norm.home_name,
        norm.home_logo_url,
        client,
        null
      );
      const away_team_id = await upsertTeam(
        norm.away_external_id || null,
        norm.away_name,
        norm.away_logo_url,
        client,
        null
      );

      await upsertEvent(
        {
          external_id: norm.external_id,
          competition_external_id: norm.competition_external_id,
          competition_name: norm.competition_name,
          home_team_id,
          away_team_id,
          venue: norm.venue,
          kickoff_utc: norm.kickoff_utc,
          price: null, // you can set a default later if you want
          openpark_id: nextPark(),
        },
        client
      );

      upserted++;
    }

    await client.query("COMMIT");
    console.log(`Hockey sync done. Upserted fixtures: ${upserted}`);
    return { ok: true, upserted };
  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("Hockey sync error:", err && err.message ? err.message : err);
    throw err;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await syncHockeyUpcoming();
      process.exit(0);
    } catch (e) {
      console.error("Fatal:", e);
      process.exit(1);
    }
  })();
}

module.exports = { syncHockeyUpcoming };
