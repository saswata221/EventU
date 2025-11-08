// server/models/Payment.js
const pool = require("../config/db");

async function createPaymentRecord({
  orderId = null,
  userId = null,
  amount,
  currency = "inr",
  stripeSessionId = null,
  stripePaymentIntentId = null,
  status = "created",
  metadata = {},
} = {}) {
  const q = `
    INSERT INTO payments (order_id, user_id, amount, currency, stripe_session_id, stripe_payment_intent_id, status, metadata)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`;
  const values = [
    orderId,
    userId,
    amount,
    currency,
    stripeSessionId,
    stripePaymentIntentId,
    status,
    metadata,
  ];
  const { rows } = await pool.query(q, values);
  return rows[0];
}

async function findBySessionId(sessionId) {
  const { rows } = await pool.query(
    "SELECT * FROM payments WHERE stripe_session_id = $1 LIMIT 1",
    [sessionId]
  );
  return rows[0] || null;
}

async function updateBySessionId(sessionId, updates = {}) {
  // Build dynamic update (simple)
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(updates)) {
    fields.push(`${key} = $${idx++}`);
    values.push(updates[key]);
  }
  if (fields.length === 0) return null;
  values.push(sessionId); // last param
  const q = `UPDATE payments SET ${fields.join(
    ", "
  )}, updated_at = now() WHERE stripe_session_id = $${idx} RETURNING *`;
  const { rows } = await pool.query(q, values);
  return rows[0];
}

module.exports = { createPaymentRecord, findBySessionId, updateBySessionId };
