require("dotenv").config();
const fetch = global.fetch || require("node-fetch");
const pool = require("../config/db");
const { upsertTeam, upsertEvent } = require("../models/cricketModel");
const { cricbuzzLogoUrlFromId } = require("../utils/logoHelpers");
const { lookupWikipediaImage } = require("../utils/wikiHelpers");

// Config
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "cricbuzz-cricket.p.rapidapi.com";
const RAPID_FIXTURES_PATH =
  process.env.RAPID_FIXTURES_PATH || "/matches/v1/upcoming";
const DAYS = Number(process.env.RAPID_SYNC_DAYS || 7);

if (!RAPIDAPI_KEY) {
  console.error("Please set RAPIDAPI_KEY in .env");
  process.exit(1);
}

//helper funs
function getDatesUTCSet(days) {
  const now = new Date();
  const base = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const set = new Set();
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + i);
    set.add(d.toISOString().slice(0, 10));
  }
  return set;
}

// Normalize incoming matchInfo objects
function normalizeMatchInfo(mi) {
  if (!mi) return null;

  // Robustly find kickoff timestamp (ms or ISO)
  let kickoff_utc = null;
  if (mi.startDate && /^\d+$/.test(String(mi.startDate))) {
    kickoff_utc = new Date(Number(mi.startDate)).toISOString();
  } else if (mi.startDate && typeof mi.startDate === "string") {
    const d = new Date(mi.startDate);
    if (!isNaN(d)) kickoff_utc = d.toISOString();
  } else if (mi.start) {
    const d = new Date(mi.start);
    if (!isNaN(d)) kickoff_utc = d.toISOString();
  } else if (mi.date) {
    const d = new Date(mi.date);
    if (!isNaN(d)) kickoff_utc = d.toISOString();
  }

  if (!kickoff_utc) return null;

  // Extract teams
  const getName = (t) => {
    if (!t) return null;
    if (typeof t === "string") return t;
    return t.teamName || t.name || t.team_name || t.title || null;
  };
  const getId = (t) => {
    if (!t) return null;
    return t.teamId || t.team_id || t.id || null;
  };
  const getImageId = (t) => {
    if (!t) return null;
    return t.imageId || t.image_id || t.imgId || null;
  };

  // common shapes
  const t1 = mi.team1 || mi.teamA || (mi.teams && mi.teams[0]) || null;
  const t2 = mi.team2 || mi.teamB || (mi.teams && mi.teams[1]) || null;

  const home_name = getName(t1);
  const away_name = getName(t2);
  if (!home_name || !away_name) return null;

  const home_external_id = getId(t1);
  const away_external_id = getId(t2);
  const home_image_id = getImageId(t1);
  const away_image_id = getImageId(t2);

  const competition_external_id =
    mi.seriesId || mi.series_id || mi.tournamentId || mi.tournament_id || "";
  const competition_name =
    mi.seriesName || mi.series_name || mi.series || mi.tournament || "";

  const external_id = String(
    mi.matchId ||
      mi.match_id ||
      mi.id ||
      `${home_name}-${away_name}-${kickoff_utc}`
  );

  const venue =
    (mi.venueInfo && (mi.venueInfo.ground || mi.venueInfo.name)) ||
    mi.venue ||
    null;

  return {
    external_id,
    competition_external_id: competition_external_id
      ? String(competition_external_id)
      : "",
    competition_name: competition_name ? String(competition_name) : "",
    home_external_id: home_external_id ? String(home_external_id) : null,
    home_name: String(home_name),
    home_image_id: home_image_id ? String(home_image_id) : null,
    away_external_id: away_external_id ? String(away_external_id) : null,
    away_name: String(away_name),
    away_image_id: away_image_id ? String(away_image_id) : null,
    venue,
    kickoff_utc,
  };
}

function collectMatchInfoObjects(body) {
  const out = [];
  if (!body) return out;

  const pushIf = (m) => {
    if (!m) return;
    const mi = m.matchInfo || m;
    if (mi) out.push(mi);
  };

  if (Array.isArray(body.typeMatches)) {
    for (const tm of body.typeMatches) {
      if (Array.isArray(tm.seriesMatches)) {
        for (const sm of tm.seriesMatches) {
          if (sm.seriesAdWrapper) {
            const wrapper = sm.seriesAdWrapper;
            if (Array.isArray(wrapper.seriesMatches)) {
              for (const s2 of wrapper.seriesMatches) {
                if (Array.isArray(s2.matches))
                  for (const mm of s2.matches) pushIf(mm);
              }
            }
            if (Array.isArray(wrapper.matches))
              for (const mm of wrapper.matches) pushIf(mm);
          }
          if (Array.isArray(sm.matches))
            for (const mm of sm.matches) pushIf(mm);
        }
      }
      if (Array.isArray(tm.matches)) for (const mm of tm.matches) pushIf(mm);
    }
  }
  if (Array.isArray(body.seriesMatches)) {
    for (const sm of body.seriesMatches) {
      if (Array.isArray(sm.matches)) for (const mm of sm.matches) pushIf(mm);
    }
  }
  if (Array.isArray(body.matches)) for (const mm of body.matches) pushIf(mm);

  const seen = new Set();
  return out.filter((mi) => {
    const id = String(mi.matchId || mi.id || mi.match_id || "").trim();
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function isMainTeam(name) {
  if (!name || !String(name).trim()) return false;
  const n = String(name).trim();

  const nonMainRe =
    /\bA[.\)]?$|\bXI$|\bU\d{1,2}\b|under[-\s]?\d{1,2}\b|reserves?\b|academy\b|development\b|\bsecond\b|\bb team\b|\ba side\b/i;
  return !nonMainRe.test(n);
}

async function ensureLogoForTeam(client, externalId, teamName, currentLogoUrl) {
  // If currentLogoUrl provided (e.g., from Wikipedia already), keep it
  if (currentLogoUrl) return currentLogoUrl;

  // 1) try DB by external_id
  if (externalId) {
    try {
      const r = await client.query(
        "SELECT logo_url FROM cricket_teams WHERE external_id = $1 LIMIT 1",
        [externalId]
      );
      if (r.rows[0] && r.rows[0].logo_url) return r.rows[0].logo_url;
    } catch (e) {
      // ignore
    }
  }

  // 2) try DB by name
  try {
    const r2 = await client.query(
      "SELECT logo_url FROM cricket_teams WHERE lower(name) = lower($1) LIMIT 1",
      [teamName]
    );
    if (r2.rows[0] && r2.rows[0].logo_url) return r2.rows[0].logo_url;
  } catch (e) {
    // ignore
  }

  // 3) No DB record found; return null (caller can try wiki or provider)
  return null;
}

/* ---------------------- Fetching ---------------------- */

async function fetchUpcoming() {
  const url = `https://${RAPIDAPI_HOST}${RAPID_FIXTURES_PATH}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST,
      Accept: "application/json",
    },
    timeout: 20000,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`RapidAPI ${res.status}: ${t}`);
  }
  return res.json();
}

/* ---------------------- Main sync ---------------------- */

async function syncCricbuzzUpcoming() {
  const client = await pool.connect();
  try {
    const body = await fetchUpcoming();
    const matchInfos = collectMatchInfoObjects(body);
    console.log("Collected matchInfo objects:", matchInfos.length);

    const allowedDates = getDatesUTCSet(DAYS);
    let upserted = 0;

    await client.query("BEGIN");

    // simple rotating openpark assignment (adjust to your logic)
    const PARKS = [1, 2, 3, 4, 5, 6];
    let pi = 0;
    const nextPark = () => PARKS[pi++ % PARKS.length];

    for (const mi of matchInfos) {
      const norm = normalizeMatchInfo(mi);
      if (!norm) continue;

      // date filter (today + DAYS-1)
      const dISO = norm.kickoff_utc.slice(0, 10);
      if (!allowedDates.has(dISO)) continue;

      // exclude womens matches explicitly
      if (mi.matchType && /women/i.test(String(mi.matchType))) continue;
      if (/women/i.test(String(norm.competition_name || ""))) continue;
      if (
        /women/i.test(String(norm.home_name || "")) ||
        /women/i.test(String(norm.away_name || ""))
      )
        continue;

      // include only major formats/competitions: conservative filter
      const textForFilter = `${norm.competition_name || ""} ${
        mi.matchDesc || ""
      } ${mi.matchFormat || ""} ${mi.matchType || ""} ${
        mi.seriesName || ""
      }`.toLowerCase();

      if (textForFilter.includes("ranji trophy")) continue;
      if (
        textForFilter.includes("csa") ||
        textForFilter.includes("t20 challenge") ||
        textForFilter.includes("challenge")
      ) {
        continue;
      }

      const include =
        textForFilter.includes("ipl") ||
        textForFilter.includes("international") ||
        textForFilter.includes("icc") ||
        textForFilter.includes("odi") ||
        textForFilter.includes("test") ||
        textForFilter.includes("t20");
      if (!include) continue;

      // SKIP non-main teams (e.g., "India A", "Pakistan A", U19, XI, etc.)
      if (!isMainTeam(norm.home_name) || !isMainTeam(norm.away_name)) {
        console.log(
          "Skipping non-main-team fixture:",
          norm.external_id,
          norm.home_name,
          "vs",
          norm.away_name
        );
        continue;
      }
      // 1) Try Wikipedia first (best quality)
      let home_logo_url = null;
      let away_logo_url = null;

      try {
        home_logo_url = await lookupWikipediaImage(norm.home_name);
      } catch (e) {
        console.warn("wiki lookup failed for", norm.home_name, e && e.message);
        home_logo_url = null;
      }
      try {
        away_logo_url = await lookupWikipediaImage(norm.away_name);
      } catch (e) {
        console.warn("wiki lookup failed for", norm.away_name, e && e.message);
        away_logo_url = null;
      }

      // 2) If no wiki image, try provider image id (Cricbuzz)
      if (!home_logo_url && norm.home_image_id) {
        home_logo_url = cricbuzzLogoUrlFromId(norm.home_image_id);
      }
      if (!away_logo_url && norm.away_image_id) {
        away_logo_url = cricbuzzLogoUrlFromId(norm.away_image_id);
      }

      // 3) If still null, check DB existing value (avoid overwriting)
      const dbHome = await ensureLogoForTeam(
        client,
        norm.home_external_id,
        norm.home_name,
        home_logo_url
      );
      const dbAway = await ensureLogoForTeam(
        client,
        norm.away_external_id,
        norm.away_name,
        away_logo_url
      );
      home_logo_url = dbHome || home_logo_url || null;
      away_logo_url = dbAway || away_logo_url || null;

      // Upsert teams: pass logo_url (may be null)
      const home_team_id = await upsertTeam(
        norm.home_external_id || null,
        norm.home_name,
        home_logo_url,
        client,
        norm.home_image_id || null
      );
      const away_team_id = await upsertTeam(
        norm.away_external_id || null,
        norm.away_name,
        away_logo_url,
        client,
        norm.away_image_id || null
      );

      // Upsert fixture/event
      await upsertEvent(
        {
          external_id: norm.external_id,
          competition_external_id: norm.competition_external_id,
          competition_name: norm.competition_name,
          home_team_id,
          away_team_id,
          venue: norm.venue,
          kickoff_utc: norm.kickoff_utc,
          price: null,
          openpark_id: nextPark(),
        },
        client
      );

      upserted++;
    }

    await client.query("COMMIT");
    console.log(`Sync done. Upserted fixtures: ${upserted}`);
    return { ok: true, upserted };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Sync error:", err && err.message ? err.message : err);
    throw err;
  } finally {
    client.release();
  }
}

/* ---------------------- Run if CLI ---------------------- */

if (require.main === module) {
  (async () => {
    try {
      await syncCricbuzzUpcoming();
      process.exit(0);
    } catch (e) {
      console.error("Fatal:", e);
      process.exit(1);
    }
  })();
}

module.exports = { syncCricbuzzUpcoming };
