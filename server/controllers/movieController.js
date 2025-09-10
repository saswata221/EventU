const pool = require("../config/db");

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const { rating, genre } = req.query;
    let query = "SELECT * FROM public.current_movies WHERE 1=1";
    const values = [];

    if (rating) {
      values.push(rating);
      query += ` AND rating >= $${values.length}`;
    }

    if (genre) {
      values.push(genre);
      query += ` AND $${values.length} = ANY(genres)`;
    }

    query += " ORDER BY release_date DESC";
    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Server error");
  }
};

exports.getMovie = async (req, res) => {
  try {
  } catch {}
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT * FROM current_movies WHERE tmdb_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get recommendations
exports.getRecommendations = async (req, res) => {
  const tmdbId = parseInt(req.params.id);
  try {
    const movieResult = await pool.query(
      "SELECT genres FROM current_movies WHERE tmdb_id = $1",
      [tmdbId]
    );
    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const genres = movieResult.rows[0].genres;

    const recommendations = await pool.query(
      `SELECT tmdb_id, title, poster_url, rating, likes, duration
       FROM current_movies
       WHERE tmdb_id != $1 AND genres && $2::text[]
       ORDER BY likes DESC
       LIMIT 4`,
      [tmdbId, genres]
    );

    res.json(recommendations.rows);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
