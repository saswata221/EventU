const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "MoviesDB",
  password: "postgre123",
  port: 5432,
});

app.get("/movies", async (req, res) => {
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
      // checks if the genre exists in the text[] array
    }

    query += " ORDER BY release_date DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Server error");
  }
});

app.get("/movies/:id", async (req, res) => {
  const id = parseInt(req.params.id); // convert to number
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
});

app.get("/booking/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id,tmdb_id,title,duration,is_adult,genres FROM current_movies WHERE tmdb_id = $1",
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
});
//massage
app.post("/messages", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error inserting message:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//feedback
app.post("/feedback", async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res
      .status(400)
      .json({ success: false, message: "Feedback is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO feedback (feedback) VALUES ($1) RETURNING *",
      [feedback]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//serach
// 🔎 Search in current_movies
// server.js (or wherever your search route is)
app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT tmdb_id, title, casts, poster_url,rating
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
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
