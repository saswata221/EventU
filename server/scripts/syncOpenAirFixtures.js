require("dotenv").config();

const fetch = global.fetch || require("node-fetch");
const pool = require("../config/db");
const { upsertTeam, upsertEvent } = require("../models/footballModel");

// ================= CONFIG =================
const DAYS = 7;
const DELETE_PAST_BEFORE_TODAY = true;
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
  console.error("❌ API_FOOTBALL_KEY not found");
  process.exit(1);
}

// Allowed leagues (PL + La Liga + International)
const ALLOWED_LEAGUE_IDS = [
  // 🇬🇧 England
  39, // Premier League
  45, // FA Cup
  48, // EFL Cup (Carabao Cup)

  // 🇪🇸 Spain
  140, // La Liga
  143, // Copa del Rey
  556, // Supercopa de España

  // 🌍 International / UEFA / FIFA
  1, // World Cup
  2, // UEFA Champions League
  3, // UEFA Europa League
  5, // UEFA Euro
  10, // International Friendlies
  848, // UEFA Nations League
];

// ================= HELPERS =================

function toISODateStringUTC(d) {
  return d.toISOString().slice(0, 10);
}

function getDatesRangeUTC(startDate, days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(
      new Date(
        Date.UTC(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth(),
          startDate.getUTCDate() + i
        )
      )
    );
  }
  return dates;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ================= FILTERS =================

function isMensMatch(item) {
  const text = [
    item.league?.name,
    item.teams?.home?.name,
    item.teams?.away?.name,
  ]
    .join(" ")
    .toLowerCase();

  const banned = [
    "women",
    "womens",
    "ladies",
    "female",
    "u17",
    "u18",
    "u19",
    "u20",
    "u21",
    "u23",
    "youth",
    "academy",
    "junior",
  ];

  return !banned.some((k) => text.includes(k));
}

// ================= API FETCH =================

async function fetchFixturesForDate(date) {
  const isoDate = toISODateStringUTC(date);

  // ✅ FIX: use `date` (FREE PLAN COMPATIBLE)
  const url = `https://v3.football.api-sports.io/fixtures?date=${isoDate}`;

  const res = await fetch(url, {
    headers: {
      "x-apisports-key": API_KEY,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  const json = await res.json();
  const raw = json.response || [];

  console.log(`RAW API fixtures ${isoDate}: ${raw.length}`);

  const fixtures = raw
    .filter(
      (item) =>
        ALLOWED_LEAGUE_IDS.includes(item.league?.id) && isMensMatch(item)
    )
    .map(adaptFixture)
    .filter(
      (f) => f.external_id && f.home_name && f.away_name && f.kickoff_utc
    );

  console.log(`API-Football ${isoDate} → ${fixtures.length} fixtures`);
  return fixtures;
}

// ================= ADAPTER =================

function adaptFixture(item) {
  const f = item.fixture || {};
  const l = item.league || {};
  const t = item.teams || {};

  return {
    external_id: String(f.id),

    competition_external_id: l.id ? String(l.id) : null,
    competition_name: l.name || null,

    home_external_id: t.home?.id ? String(t.home.id) : null,
    home_name: t.home?.name || null,
    home_logo: t.home?.logo || null,

    away_external_id: t.away?.id ? String(t.away.id) : null,
    away_name: t.away?.name || null,
    away_logo: t.away?.logo || null,

    venue: f.venue?.name || null,
    kickoff_utc: f.date ? new Date(f.date).toISOString() : null,
  };
}

// ================= SYNC =================

async function syncFixtures() {
  const client = await pool.connect();
  const PARK_IDS = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let parkIdx = 0;

  try {
    await client.query("BEGIN");

    if (DELETE_PAST_BEFORE_TODAY) {
      await client.query(`
        DELETE FROM football_fixtures
        WHERE kickoff_utc::date < CURRENT_DATE
      `);
    }

    const dates = getDatesRangeUTC(new Date(), DAYS);
    const allFixtures = [];

    for (const d of dates) {
      allFixtures.push(...(await fetchFixturesForDate(d)));
    }

    console.log(`Total fixtures fetched: ${allFixtures.length}`);

    for (const f of allFixtures) {
      const homeId = await upsertTeam(
        f.home_external_id,
        f.home_name,
        f.home_logo,
        client
      );

      const awayId = await upsertTeam(
        f.away_external_id,
        f.away_name,
        f.away_logo,
        client
      );

      await upsertEvent(
        {
          external_id: f.external_id,
          competition_external_id: f.competition_external_id,
          competition_name: f.competition_name,
          home_team_id: homeId,
          away_team_id: awayId,
          venue: f.venue,
          kickoff_utc: f.kickoff_utc,
          price: null,
          openpark_id: PARK_IDS[parkIdx++ % PARK_IDS.length],
        },
        client
      );
    }

    await client.query("COMMIT");
    console.log(`✅ Sync complete — ${allFixtures.length} fixtures inserted`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Sync failed:", e.message);
    throw e;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  syncFixtures()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { syncFixtures };
