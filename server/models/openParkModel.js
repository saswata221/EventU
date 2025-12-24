// server/models/openParkModel.js
const pool = require("../config/db");

async function upsertOpenParkByName(name, client = pool) {
  const q = `
    INSERT INTO open_parks (name)
    VALUES ($1)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name;
  `;
  const res = await client.query(q, [name]);
  return res.rows[0];
}

async function getOpenParkById(id) {
  const q = `SELECT * FROM open_parks WHERE id=$1`;
  const res = await pool.query(q, [id]);
  return res.rows[0];
}

module.exports = { upsertOpenParkByName, getOpenParkById };
