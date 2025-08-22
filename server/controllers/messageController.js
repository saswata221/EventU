const pool = require("../config/db");

exports.postMessage = async (req, res) => {
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
};
