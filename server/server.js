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
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");

// ✅ SINGLE combined route for ALL sports (football, cricket, hockey, kabaddi)
const openairCombinedRoutes = require("./routes/openairCombinedRoutes");

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
app.use("/booking", bookingRoutes);
app.use("/messages", messageRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/search", searchRoutes);
app.use("/api/events", eventRoutes);
app.use("/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// 🟢 ONE unified sports endpoint
// /api/openair?sport=football|cricket|hockey|kabaddi|all
app.use("/api/openair", openairCombinedRoutes);

// Health check
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Global error handler
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

// Crons
const { startRefreshCron } = require("./cron/refreshShowtimes");
startRefreshCron();

const { startRefreshEventCron } = require("./cron/refreshEventShowtimes");
startRefreshEventCron();
