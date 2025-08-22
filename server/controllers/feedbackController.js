const pool = require("../config/db");

exports.postFeedback = async (req, res) => {
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
};
