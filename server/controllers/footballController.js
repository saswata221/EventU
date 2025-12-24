// server/controllers/openAirController.js
const { upsertOpenParkByName } = require("../models/openParkModel");
const {
  upsertTeam,
  upsertEvent,
  listEvents,
} = require("../models/footballModel");
const pool = require("../config/db");

/**
 * POST /api/openair/import
 * Body: { fixtures: [ ... ] }
 */
async function importFixtures(req, res) {
  const fixtures = req.body.fixtures;
  if (!Array.isArray(fixtures)) {
    return res.status(400).json({ error: "fixtures must be an array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = [];

    for (const f of fixtures) {
      let openpark_id = null;
      if (f.openpark_name) {
        // upsertOpenParkByName returns { id, name }
        const park = await upsertOpenParkByName(f.openpark_name, client);
        openpark_id = park?.id ?? null;
      }

      const home_team_id = await upsertTeam(
        f.home_external_id || null,
        f.home_name,
        f.home_logo,
        client
      );

      const away_team_id = await upsertTeam(
        f.away_external_id || null,
        f.away_name,
        f.away_logo,
        client
      );

      const eventId = await upsertEvent(
        {
          external_id: f.external_id,
          competition_external_id: f.competition_external_id,
          competition_name: f.competition_name,
          home_team_id,
          away_team_id,
          venue: f.venue,
          kickoff_utc: f.kickoff_utc,
          price: f.price ?? null,
          openpark_id,
        },
        client
      );

      results.push({ external_id: f.external_id, inserted_id: eventId });
    }

    await client.query("COMMIT");
    res.json({ ok: true, results });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("importFixtures error:", err);
    res.status(500).json({ error: "import failed", detail: err.message });
  } finally {
    client.release();
  }
}

/**
 * GET /api/openair?limit=50&offset=0&openpark_id=1
 * Returns events with joined team names/logos and openpark name (if any)
 */
async function getEvents(req, res) {
  try {
    const { limit = 50, offset = 0, openpark_id } = req.query;
    const events = await listEvents({
      limit: Number(limit),
      offset: Number(offset),
      openpark_id: openpark_id ? Number(openpark_id) : null,
    });
    res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    res
      .status(500)
      .json({ error: "failed to fetch events", detail: err.message });
  }
}

module.exports = { importFixtures, getEvents };
