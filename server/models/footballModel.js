// server/models/openAirModel.js
const pool = require("../config/db");

async function upsertTeam(external_id, name, logo_url, client = pool) {
  const q = `
    INSERT INTO football_teams (external_id, name, logo_url)
    VALUES ($1,$2,$3)
    ON CONFLICT (external_id) DO UPDATE
      SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url, updated_at = now()
    RETURNING id;
  `;
  const res = await client.query(q, [external_id, name, logo_url]);
  if (res.rowCount) return res.rows[0].id;

  const fall = await client.query(
    `SELECT id FROM football_teams WHERE name=$1 LIMIT 1`,
    [name]
  );
  return fall.rows[0]?.id || null;
}

async function upsertEvent(event, client = pool) {
  const q = `
    INSERT INTO football_fixtures
      (external_id, competition_external_id, competition_name, home_team_id, away_team_id, venue, kickoff_utc, price, openpark_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (external_id) DO UPDATE SET
      competition_external_id = EXCLUDED.competition_external_id,
      competition_name = EXCLUDED.competition_name,
      home_team_id = EXCLUDED.home_team_id,
      away_team_id = EXCLUDED.away_team_id,
      venue = EXCLUDED.venue,
      kickoff_utc = EXCLUDED.kickoff_utc,
      price = EXCLUDED.price,
      openpark_id = EXCLUDED.openpark_id,
      updated_at = now()
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
      h.name AS home_name, h.logo_url AS home_logo, 
      a.name AS away_name, a.logo_url AS away_logo,
      p.name AS openpark_name
    FROM football_fixtures e
    LEFT JOIN football_teams h ON e.home_team_id = h.id
    LEFT JOIN football_teams a ON e.away_team_id = a.id
    LEFT JOIN open_parks p ON e.openpark_id = p.id
  `;
  const params = [];
  if (openpark_id) {
    params.push(openpark_id);
    q += ` WHERE e.openpark_id = $${params.length}`;
  }
  // push limit & offset
  params.push(limit, offset);
  // LIMIT uses the param index (params.length - 1) and OFFSET uses params.length
  q += ` ORDER BY e.kickoff_utc LIMIT $${params.length - 1} OFFSET $${
    params.length
  }`;
  const res = await pool.query(q, params);
  return res.rows;
}

module.exports = { upsertTeam, upsertEvent, listEvents };
