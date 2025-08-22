const pool = require("../config/db");

exports.searchMovies = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT tmdb_id, title, casts, poster_url, rating
       FROM current_movies
       WHERE title ILIKE $1
       LIMIT 10`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
