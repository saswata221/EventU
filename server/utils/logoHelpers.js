// server/utils/logoHelpers.js
// Minimal helper stubs to satisfy imports. Safe, non-networking, and easy to extend.

function cricbuzzLogoUrlFromId(id) {
  if (!id) return null;
  // Return a stable local endpoint that your server already exposes (teamLogoRoutes SVG).
  // This avoids external network calls inside scripts and prevents CORS issues.
  return `/api/teamlogo/cricbuzz/${encodeURIComponent(String(id))}`;
}

/**
 * normalizeLogoUrl(fullUrl, logoId, opts)
 * - If fullUrl is a real absolute URL return it.
 * - Else if logoId present return the cricbuzz local endpoint (as above).
 * - Else return null.
 *
 * Small convenience used by some code paths; not required but handy.
 */
function normalizeLogoUrl(fullUrl, logoId) {
  if (fullUrl && String(fullUrl).startsWith("http")) return fullUrl;
  if (logoId) return cricbuzzLogoUrlFromId(logoId);
  return null;
}

module.exports = {
  cricbuzzLogoUrlFromId,
  normalizeLogoUrl,
};
