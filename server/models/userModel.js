// server/models/userModel.js
const pool = require("../config/db");

const selectPublic =
  "id, name, email, role, is_active, email_verified_at, created_at, updated_at";

async function createUser({ name, email, passwordHash, role = "public" }) {
  const q = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1,$2,$3,$4)
    RETURNING ${selectPublic}
  `;
  const { rows } = await pool.query(q, [name, email, passwordHash, role]);
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT ${selectPublic}, password_hash FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${selectPublic} FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function markEmailVerified(userId) {
  await pool.query("UPDATE users SET email_verified_at = NOW() WHERE id = $1", [
    userId,
  ]);
}

async function updatePassword(userId, newHash) {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    newHash,
    userId,
  ]);
}

async function updateRole(userId, role) {
  await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
}

async function setActive(userId, isActive) {
  await pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [
    isActive,
    userId,
  ]);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  markEmailVerified,
  updatePassword,
  updateRole,
  setActive,
};
