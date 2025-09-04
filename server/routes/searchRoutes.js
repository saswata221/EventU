// server/routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get(
  "/",
  searchController.unifiedSearch ||
    searchController.search ||
    ((_req, res) => res.json([]))
);

module.exports = router;
