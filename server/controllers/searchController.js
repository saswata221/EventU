// server/controllers/searchController.js
const pool = require("../config/db");

/**
 * Build a safe pattern for ILIKE '%q%' (escape % and _ so they are literal)
 */
const makeLike = (q) =>
  `%${String(q).replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;

/**
 * GET /search?q=...
 * Unified search across:
 *  - Movies  (public.current_movies): title + casts[]
 *  - Events  (public.events):        title + artist_names[]
 *
 * Returns the TOP 3 results by rating (desc), keeping the shape your UI expects:
 *  [{ tmdb_id, title, poster_url, casts, rating, type }]
 *  - type: "movie" | "event" (used by the frontend to route and handle posters)
 *  - poster_url:
 *      * movies: TMDB path (your UI prepends TMDB base)
 *      * events: full URL (frontend uses directly)
 */
exports.unifiedSearch = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.json([]); // same UX as before

    const like = makeLike(q);

    const sql = `
      WITH movie_hits AS (
        SELECT
          m.tmdb_id::bigint               AS tmdb_id,
          m.title                         AS title,
          m.rating::float                 AS rating,
          m.poster_url                    AS poster_url,   -- TMDB path
          m.casts                         AS casts,        -- text[]
          'movie'                         AS type,
          1                               AS priority
        FROM public.current_movies m
        WHERE m.title ILIKE $1
           OR EXISTS (
                SELECT 1 FROM unnest(m.casts) c
                WHERE c ILIKE $1
              )
      ),
      event_hits AS (
        SELECT
          e.id::bigint                    AS tmdb_id,
          e.title                         AS title,
          COALESCE(e.rating::float, 0.0)  AS rating,
          e.poster_url                    AS poster_url,   -- full URL for events
          e.artist_names                  AS casts,        -- text[]
          'event'                         AS type,
          2                               AS priority
        FROM public.events e
        WHERE e.status = 'active'
          AND (
                e.title ILIKE $1
             OR EXISTS (
                  SELECT 1 FROM unnest(e.artist_names) a
                  WHERE a ILIKE $1
                )
          )
      )
      SELECT * FROM (
        SELECT * FROM movie_hits
        UNION ALL
        SELECT * FROM event_hits
      ) u
      ORDER BY rating DESC NULLS LAST, priority ASC, title ASC
      LIMIT 3;
    `;

    const { rows } = await pool.query(sql, [like]);

    // Normalize to exactly what the frontend expects
    const out = rows.map((r) => ({
      tmdb_id: Number(r.tmdb_id),
      title: r.title || "",
      poster_url: r.poster_url || "",
      casts: Array.isArray(r.casts) ? r.casts : [],
      rating: typeof r.rating === "number" ? r.rating : 0,
      type: r.type === "event" ? "event" : "movie",
    }));

    res.json(out);
  } catch (err) {
    console.error("unifiedSearch error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
