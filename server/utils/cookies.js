// server/utils/cookies.js
const parseMs = (ttl) => {
  // "15m", "7d", "48h"
  const m = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(String(ttl).trim());
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  const unit = m[2] || "ms";
  const mult = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
  return n * mult;
};

function setRefreshCookie(res, token) {
  const name = process.env.COOKIE_NAME || "rtkn";
  const ttl = process.env.REFRESH_TOKEN_TTL || "7d";
  const maxAge = parseMs(ttl);

  const isProd = process.env.NODE_ENV === "production";

  res.cookie(name, token, {
    httpOnly: true,
    secure: isProd ? true : false,
    sameSite: isProd ? "none" : "lax",
    maxAge,
    path: "/",
  });
}

function clearRefreshCookie(res) {
  const name = process.env.COOKIE_NAME || "rtkn";
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}

function getRefreshCookie(req) {
  const name = process.env.COOKIE_NAME || "rtkn";
  return req.cookies?.[name];
}

module.exports = {
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshCookie,
  parseMs,
};
