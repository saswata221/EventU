// server/utils/wikiHelpers.js
// Lookup a team's image thumbnail URL from Wikipedia (MediaWiki API).
// Returns an https URL string or null when no suitable image is found.

const fetch = global.fetch || require("node-fetch");

async function lookupWikipediaImage(teamName, thumbSize = 400) {
  if (!teamName || !String(teamName).trim()) return null;
  const cleaned = String(teamName).trim();
  const qTitle = encodeURIComponent(cleaned.replace(/\s+/g, "_"));
  const userAgent = "EventU/1.0 (contact: you@example.com)";

  // 1) Try direct page query -> pageimages (thumbnail)
  try {
    const url1 = `https://en.wikipedia.org/w/api.php?action=query&titles=${qTitle}&prop=pageimages&format=json&pithumbsize=${thumbSize}`;
    const r1 = await fetch(url1, { headers: { "User-Agent": userAgent } });
    if (r1.ok) {
      const js1 = await r1.json();
      if (js1 && js1.query && js1.query.pages) {
        const pages = Object.values(js1.query.pages);
        if (pages.length && pages[0].thumbnail && pages[0].thumbnail.source) {
          return pages[0].thumbnail.source;
        }
      }
    }
  } catch (e) {
    // continue to fallback
    console.warn("wiki direct page image fetch failed:", e && e.message);
  }

  // 2) Fallback: search and try first hit's thumbnail
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleaned
    )}&format=json`;
    const rs = await fetch(searchUrl, { headers: { "User-Agent": userAgent } });
    if (rs.ok) {
      const js = await rs.json();
      const hits = js?.query?.search || [];
      if (hits.length) {
        const first = hits[0].title;
        const qFirst = encodeURIComponent(first.replace(/\s+/g, "_"));
        const url2 = `https://en.wikipedia.org/w/api.php?action=query&titles=${qFirst}&prop=pageimages&format=json&pithumbsize=${thumbSize}`;
        const r2 = await fetch(url2, { headers: { "User-Agent": userAgent } });
        if (r2.ok) {
          const js2 = await r2.json();
          const pages = Object.values(js2.query.pages || {});
          if (pages.length && pages[0].thumbnail && pages[0].thumbnail.source) {
            return pages[0].thumbnail.source;
          }
        }
      }
    }
  } catch (e) {
    console.warn("wiki search image fetch failed:", e && e.message);
  }

  return null;
}

module.exports = { lookupWikipediaImage };
