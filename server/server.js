const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const searchRoutes = require("./routes/searchRoutes");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/movies", movieRoutes);
app.use("/booking", bookingRoutes);
app.use("/messages", messageRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/search", searchRoutes);
app.use("/api/events", eventRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
