const pool = require("../config/db");

exports.getBookingData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, tmdb_id, title, duration, is_adult, genres FROM current_movies WHERE tmdb_id = $1",
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
