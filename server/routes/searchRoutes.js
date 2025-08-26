const express = require("express");
const { unifiedSearch } = require("../controllers/searchController");

const router = express.Router();
router.get("/", unifiedSearch);
module.exports = router;
