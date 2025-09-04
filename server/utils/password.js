// server/utils/password.js
const bcrypt = require("bcrypt");

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

async function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, comparePassword };
