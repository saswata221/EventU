const express = require("express");
const { searchMovies } = require("../controllers/searchController");

const router = express.Router();

// Search movies by query
router.get("/", searchMovies);

module.exports = router;
