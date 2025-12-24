// server/models/hockeyModel.js
const pool = require("../config/db");

/**
 * upsertTeam(external_id, name, logo_url, client = pool, logo_id = null)
 * - Stores both logo_url (full URL) and logo_id (optional numeric/string).
 * - Preserves existing non-empty logo values.
 */
async function upsertTeam(
  external_id,
  name,
  logo_url = null,
  client = pool,
  logo_id = null
) {
  const db = client || pool;
  const q = `
    INSERT INTO hockey_teams (external_id, name, logo_url, logo_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, now(), now())
    ON CONFLICT (external_id) DO UPDATE
      SET
        name = EXCLUDED.name,
        logo_url = CASE
          WHEN COALESCE(NULLIF(EXCLUDED.logo_url, ''), '') <> '' THEN EXCLUDED.logo_url
          ELSE hockey_teams.logo_url
        END,
        logo_id = CASE
          WHEN COALESCE(NULLIF(EXCLUDED.logo_id, ''), '') <> '' THEN EXCLUDED.logo_id
          ELSE hockey_teams.logo_id
        END,
        updated_at = now()
    RETURNING id, logo_url, logo_id;
  `;
  const params = [external_id, name, logo_url, logo_id];
  const res = await db.query(q, params);
  if (res.rowCount) return res.rows[0].id;

  // Fallback: try by name
  const fall = await db.query(
    `SELECT id FROM hockey_teams WHERE name = $1 LIMIT 1`,
    [name]
  );
  return fall.rows[0]?.id || null;
}

async function upsertEvent(event, client = pool) {
  const q = `
    INSERT INTO hockey_fixtures
      (external_id, competition_external_id, competition_name,
       home_team_id, away_team_id, venue, kickoff_utc, price,
       openpark_id, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now(), now())
    ON CONFLICT (external_id) DO UPDATE SET
      competition_external_id = EXCLUDED.competition_external_id,
      competition_name        = EXCLUDED.competition_name,
      home_team_id            = EXCLUDED.home_team_id,
      away_team_id            = EXCLUDED.away_team_id,
      venue                   = EXCLUDED.venue,
      kickoff_utc             = EXCLUDED.kickoff_utc,
      price                   = EXCLUDED.price,
      openpark_id             = EXCLUDED.openpark_id,
      updated_at              = now()
    RETURNING id;
  `;
  const vals = [
    event.external_id,
    event.competition_external_id,
    event.competition_name,
    event.home_team_id,
    event.away_team_id,
    event.venue,
    event.kickoff_utc,
    event.price,
    event.openpark_id,
  ];
  const res = await client.query(q, vals);
  return res.rows[0]?.id || null;
}

async function listEvents({ limit = 50, offset = 0, openpark_id = null } = {}) {
  let q = `
    SELECT e.*,
      h.name AS home_name, h.logo_url AS home_logo, h.logo_id AS home_logo_id,
      a.name AS away_name, a.logo_url AS away_logo, a.logo_id AS away_logo_id,
      p.name AS openpark_name
    FROM hockey_fixtures e
    LEFT JOIN hockey_teams h ON e.home_team_id = h.id
    LEFT JOIN hockey_teams a ON e.away_team_id = a.id
    LEFT JOIN open_parks p   ON e.openpark_id  = p.id
  `;
  const params = [];
  if (openpark_id) {
    params.push(openpark_id);
    q += ` WHERE e.openpark_id = $${params.length}`;
  }
  params.push(limit, offset);
  q += ` ORDER BY e.kickoff_utc LIMIT $${params.length - 1} OFFSET $${
    params.length
  }`;
  const res = await pool.query(q, params);
  return res.rows;
}

module.exports = { upsertTeam, upsertEvent, listEvents };
