const express = require("express");
const {
  getAllMovies,
  getMovieById,
  getRecommendations,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/:id/recommendations", getRecommendations);

module.exports = router;
