// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Route imports
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const searchRoutes = require("./routes/searchRoutes");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
const app = express();

// ----------------------------
// Middleware
// ----------------------------
const allow = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allow.length ? allow : [/^http:\/\/localhost:\d+$/],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ----------------------------
// Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/booking", bookingRoutes); // GET /booking/:id (public), POST /booking (protected)
app.use("/messages", messageRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/search", searchRoutes);
app.use("/api/events", eventRoutes);
app.use("/admin", adminRoutes);

// Health check
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// ----------------------------
// Error Handler
// ----------------------------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// ----------------------------
// Listen
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const { startRefreshCron } = require("./cron/refreshShowtimes");
startRefreshCron();

const { startRefreshEventCron } = require("./cron/refreshEventShowtimes");
startRefreshEventCron();
