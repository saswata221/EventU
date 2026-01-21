/**
 * Sync cricket fixtures using CricAPI
 * - ONLY International Men's matches
 * - Only upcoming matches
 * - Only next 2 days (including today)
 * - Excludes Women / U19 / A teams / Domestic leagues
 * - Deletes old cricket fixtures
 * - Assigns RANDOM open air park id per fixture
 */

require("dotenv").config();
const fetch = global.fetch || require("node-fetch");
const pool = require("../config/db");
const { upsertTeam, upsertEvent } = require("../models/cricketModel");
const { lookupWikipediaImage } = require("../utils/wikiHelpers");

// ---------------- CONFIG ----------------

const CRICAPI_KEY = process.env.CRICAPI_KEY;
const DAYS = 2;

const INTERNATIONAL_TEAMS = [
  "India",
  "Australia",
  "England",
  "Pakistan",
  "South Africa",
  "New Zealand",
  "Sri Lanka",
  "Bangladesh",
  "West Indies",
  "Afghanistan",
  "Ireland",
  "Zimbabwe",
  "Nepal",
  "Netherlands",
  "Scotland",
  "Oman",
  "USA",
];

if (!CRICAPI_KEY) {
  console.error("❌ CRICAPI_KEY missing in .env");
  process.exit(1);
}

// ---------------- HELPERS ----------------

function isWithinNextDays(dateStr, days) {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + days);
  const d = new Date(dateStr);
  return d >= start && d < end;
}

// ❌ Remove Women / U19 / A teams
function isInvalidTeam(name) {
  const t = name.toLowerCase();
  return (
    t.includes("women") ||
    t.includes("u19") ||
    t.includes("under 19") ||
    t.includes(" a") ||
    t.includes("academy") ||
    t.includes("xi")
  );
}

// ✅ Only full international men's teams
function isInternationalMenMatch(home, away) {
  if (isInvalidTeam(home) || isInvalidTeam(away)) return false;
  return (
    INTERNATIONAL_TEAMS.includes(home) && INTERNATIONAL_TEAMS.includes(away)
  );
}

// ---------------- FETCH ----------------

async function fetchMatches() {
  const url = `https://api.cricapi.com/v1/matches?apikey=${CRICAPI_KEY}&offset=0`;
  console.log("📡 Fetching:", url.replace(CRICAPI_KEY, "****"));

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CricAPI HTTP error: ${res.status}`);
  }
  return res.json();
}

// ---------------- MAIN SYNC ----------------

async function syncCricketFixtures() {
  const client = await pool.connect();

  try {
    const body = await fetchMatches();

    if (body.status !== "success" || !Array.isArray(body.data)) {
      throw new Error("Invalid CricAPI response");
    }

    await client.query("BEGIN");

    // 🔥 STEP 1: DELETE OLD CRICKET FIXTURES
    await client.query(`DELETE FROM cricket_fixtures`);
    console.log("🗑️ Old cricket fixtures deleted");

    // 🔥 STEP 2: FETCH OPEN PARK IDS
    const parkRes = await client.query(`SELECT id FROM open_parks`);
    if (parkRes.rows.length === 0) {
      throw new Error("No open parks found");
    }
    const openParkIds = parkRes.rows.map((r) => r.id);

    let inserted = 0;

    for (const m of body.data) {
      const status = (m.status || "").toLowerCase();
      if (status.includes("live") || status.includes("complete")) continue;

      const kickoffRaw = m.dateTimeGMT || m.dateTime || m.date;
      if (!kickoffRaw) continue;

      const kickoff_utc = new Date(kickoffRaw).toISOString();
      if (!isWithinNextDays(kickoff_utc, DAYS)) continue;

      const teams = m.teams || [];
      if (teams.length !== 2) continue;

      const home = teams[0];
      const away = teams[1];

      if (!isInternationalMenMatch(home, away)) continue;

      // Random open park id
      const openpark_id =
        openParkIds[Math.floor(Math.random() * openParkIds.length)];

      // Logos
      const home_logo = await lookupWikipediaImage(home);
      const away_logo = await lookupWikipediaImage(away);

      const home_team_id = await upsertTeam(
        home,
        home,
        home_logo,
        client,
        null
      );

      const away_team_id = await upsertTeam(
        away,
        away,
        away_logo,
        client,
        null
      );

      await upsertEvent(
        {
          external_id: m.id,
          competition_name: m.series || m.name || "",
          home_team_id,
          away_team_id,
          venue: m.venue || null,
          kickoff_utc,
          price: null,
          openpark_id,
        },
        client
      );

      inserted++;
    }

    await client.query("COMMIT");
    console.log(`✅ Cricket fixtures synced: ${inserted}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Sync failed:", err.message);
  } finally {
    client.release();
  }
}

// ---------------- CLI ----------------

if (require.main === module) {
  syncCricketFixtures()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { syncCricketFixtures };
