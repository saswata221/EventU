// server/routes/teamLogoProxy.js
const express = require("express");
const fetch = global.fetch || require("node-fetch");
const router = express.Router();

const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "cricbuzz-cricket.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

if (!RAPIDAPI_KEY) {
  console.warn(
    "Warning: RAPIDAPI_KEY not set. Team logo proxy will fail without it."
  );
}

const CRICBUZZ_CDN = "https://" + RAPIDAPI_HOST + "/img/v1/i1/c";

/**
 * GET /api/teamlogo/cricbuzz/:id
 * Streams the Cricbuzz image to the client while adding RapidAPI headers.
 */
router.get("/cricbuzz/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!/^\d+$/.test(id)) return res.status(400).send("invalid id");

    const remote = `${CRICBUZZ_CDN}${id}/i.jpg`;

    const r = await fetch(remote, {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        Accept: "image/jpeg,image/*,*/*",
      },
      // 15s timeout
      timeout: 15000,
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.warn("teamLogoProxy fetch failed", r.status, txt.slice(0, 200));
      return res.status(r.status).send("image fetch failed");
    }

    const contentType = r.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    // caching: 1 day client, stale while revalidate
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=86400"
    );

    // Stream the image body directly
    r.body.pipe(res);
  } catch (err) {
    console.error(
      "teamLogoProxy error:",
      err && err.message ? err.message : err
    );
    res.status(500).send("proxy error");
  }
});

module.exports = router;
