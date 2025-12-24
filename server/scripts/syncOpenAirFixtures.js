/**
 * server/scripts/syncOpenAirFixtures.js
 *
 * Sync top-division men's fixtures (API-Football v3) into open_air tables.
 * This variant: by default uses a numeric whitelist (POPULAR_LEAGUE_IDS) to
 * fetch only fixtures for those leagues (recommended). If POPULAR_LEAGUE_IDS
 * is empty the script falls back to the original name/pattern matching.
 *
 * Usage:
 *   API_FOOTBALL_KEY=your_key node server/scripts/syncOpenAirFixtures.js
 *
 * Requirements:
 * - server/config/db.js exports pg Pool (module.exports = pool)
 * - server/models/openAirModel.js exports { upsertTeam, upsertEvent }
 */

require("dotenv").config();

const fetch = global.fetch || require("node-fetch");
const pool = require("../config/db");
const { upsertTeam, upsertEvent } = require("../models/footballModel");

// CONFIG
const DAYS = 7; // today + next (DAYS - 1)
const DELETE_PAST_BEFORE_TODAY = true;
const API_KEY = process.env.API_FOOTBALL_KEY;
if (!API_KEY) {
  console.error("ERROR: API_FOOTBALL_KEY not found in environment.");
  process.exit(1);
}

/**
 * === POPULAR_LEAGUE_IDS ===
 * Put the numeric league IDs you want to treat as "popular" here.
 * When non-empty the script will ONLY fetch fixtures for these leagues.
 *
 * Recommended: use this mode (numeric IDs) because names can vary
 * with sponsors / prefixes which causes accidental matches.
 *
 * Example starter list (EDIT to suit your needs). This list MUST be
 * league IDs as reported by API-Football.
 */
const POPULAR_LEAGUE_IDS = [
  /* Example: 39, 140, 135, 78, 61 */
  /* Ensure you replace with the exact IDs you want. */
  39, // English Premier League (example)
  // add other league IDs here...
];

/**
 * If you prefer the older name-based matching fallback, leave POPULAR_LEAGUE_IDS
 * empty and the script will use the regex name matching logic below.
 */
const USE_NUMERIC_WHITELIST =
  Array.isArray(POPULAR_LEAGUE_IDS) && POPULAR_LEAGUE_IDS.length > 0;

// Helpers
function toISODateStringUTC(d) {
  const yy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function getDatesRangeUTC(startDate, days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const dt = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      )
    );
    dt.setUTCDate(dt.getUTCDate() + i);
    dates.push(dt);
  }
  return dates;
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build regex patterns that match core phrase as whole words (case-insensitive).
const coreLeaguePatterns = [
  { key: "premier league", re: /\bpremier\s+league\b/i },
  { key: "english premier league", re: /\benglish\s+premier\s+league\b/i },
  { key: "la liga", re: /\bla\s*liga\b/i }, // matches "La Liga" and "LaLiga"
  { key: "serie a", re: /\bserie\s+a\b/i },
  { key: "bundesliga", re: /\bbundesliga\b/i },
  { key: "ligue 1", re: /\bligue\s+1\b/i },
  { key: "indian super league", re: /\bindian\s+super\s+league\b/i },
  { key: "isl", re: /\bisl\b/i },
];

const internationalPatterns = [
  { key: "uefa champions league", re: /\buefa\s+champions\s+league\b/i },
  { key: "uefa europa league", re: /\buefa\s+europa\s+league\b/i },
  { key: "uefa conference league", re: /\buefa\s+conference\s+league\b/i },
  { key: "uefa euro", re: /\buefa\s+euro\b/i },
  { key: "uefa nations league", re: /\buefa\s+nations\s+league\b/i },
  { key: "fifa world cup", re: /\bfifa\s+world\s+cup\b/i },
  { key: "world cup", re: /\bworld\s+cup\b/i },
  { key: "afc asian cup", re: /\bafc\s+asian\s+cup\b/i },
  { key: "afc champions league", re: /\bafc\s+champions\s+league\b/i },
  { key: "copa america", re: /\bcopa\s+america\b/i },
  { key: "africa cup of nations", re: /\bafrica\s+cup\s+of\s+nations\b/i },
  { key: "international friendly", re: /\binternational\s+friendly\b/i },
];

/**
 * leagueMatches - return true if league should be accepted.
 * Logic:
 * - If numeric whitelist (POPULAR_LEAGUE_IDS) configured -> accept those ids only.
 * - Else accept if league.type === 'international' OR any core pattern matches anywhere in the league name (whole-word match).
 */
function leagueMatches(league) {
  if (!league) return false;

  // numeric whitelist - most reliable
  if (USE_NUMERIC_WHITELIST) {
    const lid = league.id ? Number(league.id) : null;
    if (lid && POPULAR_LEAGUE_IDS.includes(lid)) {
      console.log(`ACCEPT (numeric whitelist id=${lid}): "${league.name}"`);
      return true;
    }
    console.log(
      `SKIP (not in numeric whitelist): "${league.name}" (id=${league.id})`
    );
    return false;
  }

  // fallback: name/pattern matching
  const rawName = (league.name || "").trim();
  const type = (league.type || "").toLowerCase();

  if (type === "international") {
    console.log(`ACCEPT (type=international): "${rawName}"`);
    return true;
  }

  for (const p of coreLeaguePatterns) {
    if (p.re.test(rawName)) {
      console.log(`ACCEPT (core match: ${p.key}): "${rawName}"`);
      return true;
    }
  }

  for (const p of internationalPatterns) {
    if (p.re.test(rawName)) {
      console.log(`ACCEPT (international match: ${p.key}): "${rawName}"`);
      return true;
    }
  }

  console.log(`SKIP (not allowed): "${rawName}"`);
  return false;
}

/**
 * isMensMatch - detect men's fixtures (improved)
 */
function isMensMatch(item) {
  const lower = (s) => (s || "").toLowerCase();

  const leagueName = lower(item.league?.name);
  const homeName = lower(item.teams?.home?.name);
  const awayName = lower(item.teams?.away?.name);

  const bannedKeywords = [
    "women",
    "women's",
    "womens",
    "ladies",
    "female",
    "girls",
    "femina",
    "femenina",
    "feminine",
    "femminile",
    "femenil",
    "femenino",
    "fem",
    "u17",
    "u18",
    "u19",
    "u20",
    "u21",
    "u23",
    "youth",
    "academy",
    "junior",
    "development",
  ];

  const checkText = [leagueName, homeName, awayName].join(" ");
  for (const kw of bannedKeywords) {
    if (checkText.includes(kw)) {
      console.log(
        `SKIP (gender/youth detection): league="${item.league?.name}", teams="${homeName}" vs "${awayName}"`
      );
      return false;
    }
  }
  return true;
}

/**
 * Adapter for API-Football (v3)
 *
 * If numeric whitelist in use: call fixtures endpoint with league param(s)
 * (reduces volume and guarantees only the leagues you asked for).
 *
 * When not using numeric whitelist, fetch all fixtures for the date and filter.
 */
async function fetchFixturesForDate(date) {
  const isoDate = toISODateStringUTC(date);

  // If using numeric whitelist, call the API once per league ID (since the API expects single 'league' param per request)
  if (USE_NUMERIC_WHITELIST) {
    const perLeaguePromises = POPULAR_LEAGUE_IDS.map(async (leagueId) => {
      const url = `https://v3.football.api-sports.io/fixtures?date=${isoDate}&league=${leagueId}`;
      const headers = {
        "x-apisports-key": API_KEY,
        Accept: "application/json",
      };
      const res = await fetch(url, { method: "GET", headers });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `API-Football fetch failed ${res.status} ${res.statusText} ${txt}`
        );
      }
      const body = await res.json();
      return Array.isArray(body.response) ? body.response : [];
    });

    const results = await Promise.all(perLeaguePromises);
    // flatten
    const combined = results.flat();
    // apply men's filter (still important)
    const normalized = combined
      .filter((item) => isMensMatch(item))
      .map((item) => adaptFixture(item))
      .filter((f) => f.kickoff_utc && f.home_name && f.away_name);

    console.log(
      `API-Football (${isoDate}) -> ${normalized.length} filtered fixtures (numeric whitelist mode)`
    );
    return normalized;
  }

  // Fallback: fetch entire date and filter by name patterns
  const url = `https://v3.football.api-sports.io/fixtures?date=${isoDate}`;
  const headers = {
    "x-apisports-key": API_KEY,
    Accept: "application/json",
  };

  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `API-Football fetch failed ${res.status} ${res.statusText} ${txt}`
    );
  }
  const body = await res.json();
  if (!Array.isArray(body.response)) return [];

  const normalized = body.response
    .filter((item) => {
      const league = item.league || {};
      if (!leagueMatches(league)) return false;
      if (!isMensMatch(item)) return false;
      return true;
    })
    .map((item) => adaptFixture(item))
    .filter((f) => f.kickoff_utc && f.home_name && f.away_name);

  console.log(
    `API-Football (${isoDate}) -> ${normalized.length} filtered fixtures (name-match fallback)`
  );
  return normalized;
}

/**
 * adaptFixture - pull out fields in the shape your DB expects
 */
function adaptFixture(item) {
  const fixture = item.fixture || {};
  const league = item.league || {};
  const teams = item.teams || {};

  const kickoffIso = fixture.date
    ? new Date(fixture.date).toISOString()
    : fixture.timestamp
    ? new Date(fixture.timestamp * 1000).toISOString()
    : null;

  const venueName =
    (fixture.venue && (fixture.venue.name || fixture.venue)) ||
    (fixture.stadium && fixture.stadium.name) ||
    null;

  return {
    external_id: String(
      fixture.id ||
        `${league.id || "L"}-${
          fixture.timestamp ||
          fixture.date ||
          Math.random().toString(36).slice(2, 8)
        }`
    ),
    competition_external_id: league.id ? String(league.id) : null,
    competition_name: league.name || null,
    home_external_id:
      teams.home && teams.home.id ? String(teams.home.id) : null,
    home_name: teams.home && teams.home.name ? teams.home.name : null,
    home_logo: teams.home && teams.home.logo ? teams.home.logo : null,
    away_external_id:
      teams.away && teams.away.id ? String(teams.away.id) : null,
    away_name: teams.away && teams.away.name ? teams.away.name : null,
    away_logo: teams.away && teams.away.logo ? teams.away.logo : null,
    venue: venueName,
    kickoff_utc: kickoffIso,
  };
}

// Core sync
async function syncFixtures() {
  const client = await pool.connect();

  // shuffled openpark ids
  const PARK_IDS = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let parkIndex = 0;
  function nextParkId() {
    const id = PARK_IDS[parkIndex % PARK_IDS.length];
    parkIndex++;
    return id;
  }

  try {
    await client.query("BEGIN");

    if (DELETE_PAST_BEFORE_TODAY) {
      await client.query(
        `DELETE FROM football_fixtures WHERE (kickoff_utc AT TIME ZONE 'UTC')::date < (current_date AT TIME ZONE 'UTC')::date`
      );
      console.log("Deleted events with kickoff date < today (UTC).");
    }

    const dates = getDatesRangeUTC(new Date(), DAYS);
    const allFixtures = [];
    for (const d of dates) {
      const list = await fetchFixturesForDate(d);
      allFixtures.push(...list);
    }

    let upserted = 0;
    for (const f of allFixtures) {
      const home_team_id = await upsertTeam(
        f.home_external_id,
        f.home_name,
        f.home_logo,
        client
      );
      const away_team_id = await upsertTeam(
        f.away_external_id,
        f.away_name,
        f.away_logo,
        client
      );

      const openpark_id = nextParkId();

      await upsertEvent(
        {
          external_id: f.external_id,
          competition_external_id: f.competition_external_id,
          competition_name: f.competition_name,
          home_team_id,
          away_team_id,
          venue: f.venue,
          kickoff_utc: f.kickoff_utc,
          price: null,
          openpark_id,
        },
        client
      );

      upserted++;
    }

    await client.query("COMMIT");
    console.log(
      `Sync complete — ${upserted} fixtures upserted for ${DAYS} day range.`
    );
    return { ok: true, count: upserted };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Sync failed:", err.message || err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  (async () => {
    try {
      await syncFixtures();
      process.exit(0);
    } catch (err) {
      console.error("Fatal error running sync:", err);
      process.exit(1);
    }
  })();
}

module.exports = { syncFixtures };
