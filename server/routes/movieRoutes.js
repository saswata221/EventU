// server/routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Public read
router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);
router.get("/:id/recommendations", movieController.getRecommendations);

module.exports = router;
