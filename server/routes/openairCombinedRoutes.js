// server/routes/openairCombinedRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { cricbuzzLogoUrlFromId } = require("../utils/logoHelpers");

// valid sports helper
const VALID_SPORTS = ["football", "cricket", "hockey", "kabaddi", "all"];
function isValidSport(s) {
  return VALID_SPORTS.includes(String(s || "").toLowerCase());
}

router.get("/", async (req, res) => {
  try {
    const sport = (req.query.sport || "all").toLowerCase();
    const limit = Math.min(Number(req.query.limit || 200), 2000);

    if (!isValidSport(sport))
      return res.status(400).json({ ok: false, error: "invalid sport" });

    if (sport !== "all") {
      const t = sport; // table prefix matches sport name
      const sql = `
        SELECT e.id, e.external_id, e.competition_external_id, e.competition_name,
               ht.name AS home_name, ht.logo_url AS home_logo, ht.logo_id AS home_logo_id,
               at.name AS away_name, at.logo_url AS away_logo, at.logo_id AS away_logo_id,
               e.venue, e.kickoff_utc, e.price, p.name AS openpark_name
        FROM ${t}_fixtures e
        LEFT JOIN ${t}_teams ht ON e.home_team_id = ht.id
        LEFT JOIN ${t}_teams at ON e.away_team_id = at.id
        LEFT JOIN open_parks p ON e.openpark_id = p.id
        ORDER BY e.kickoff_utc
        LIMIT $1
      `;
      const { rows } = await pool.query(sql, [limit]);
      const mapped = rows.map((r) => {
        const homeLogo =
          r.home_logo && r.home_logo.startsWith("http")
            ? r.home_logo
            : r.home_logo_id
            ? cricbuzzLogoUrlFromId(r.home_logo_id)
            : null;
        const awayLogo =
          r.away_logo && r.away_logo.startsWith("http")
            ? r.away_logo
            : r.away_logo_id
            ? cricbuzzLogoUrlFromId(r.away_logo_id)
            : null;
        return { ...r, home_logo: homeLogo, away_logo: awayLogo, sport };
      });
      return res.json(mapped);
    }

    // Combined query (union)
    const sql = `
      SELECT id, external_id, competition_external_id, competition_name,
             home_name, away_name, home_logo, home_logo_id, away_logo, away_logo_id, venue, kickoff_utc, price, openpark_name, sport
      FROM (
        SELECT e.id, e.external_id, e.competition_external_id, e.competition_name,
               ht.name AS home_name, at.name AS away_name,
               ht.logo_url AS home_logo, ht.logo_id AS home_logo_id,
               at.logo_url AS away_logo, at.logo_id AS away_logo_id,
               e.venue, e.kickoff_utc, e.price,
               p.name AS openpark_name,
               'football' AS sport
        FROM football_fixtures e
        LEFT JOIN football_teams ht ON e.home_team_id = ht.id
        LEFT JOIN football_teams at ON e.away_team_id = at.id
        LEFT JOIN open_parks p ON e.openpark_id = p.id

        UNION ALL

        SELECT e.id, e.external_id, e.competition_external_id, e.competition_name,
               ht.name, at.name,
               ht.logo_url AS home_logo, ht.logo_id AS home_logo_id,
               at.logo_url AS away_logo, at.logo_id AS away_logo_id,
               e.venue, e.kickoff_utc, e.price,
               p.name AS openpark_name,
               'cricket' AS sport
        FROM cricket_fixtures e
        LEFT JOIN cricket_teams ht ON e.home_team_id = ht.id
        LEFT JOIN cricket_teams at ON e.away_team_id = at.id
        LEFT JOIN open_parks p ON e.openpark_id = p.id

        UNION ALL

        SELECT e.id, e.external_id, e.competition_external_id, e.competition_name,
               ht.name, at.name,
               ht.logo_url AS home_logo, ht.logo_id AS home_logo_id,
               at.logo_url AS away_logo, at.logo_id AS away_logo_id,
               e.venue, e.kickoff_utc, e.price,
               p.name AS openpark_name,
               'hockey' AS sport
        FROM hockey_fixtures e
        LEFT JOIN hockey_teams ht ON e.home_team_id = ht.id
        LEFT JOIN hockey_teams at ON e.away_team_id = at.id
        LEFT JOIN open_parks p ON e.openpark_id = p.id

        UNION ALL

        SELECT e.id, e.external_id, e.competition_external_id, e.competition_name,
               ht.name, at.name,
               ht.logo_url AS home_logo, ht.logo_id AS home_logo_id,
               at.logo_url AS away_logo, at.logo_id AS away_logo_id,
               e.venue, e.kickoff_utc, e.price,
               p.name AS openpark_name,
               'kabaddi' AS sport
        FROM kabaddi_fixtures e
        LEFT JOIN kabaddi_teams ht ON e.home_team_id = ht.id
        LEFT JOIN kabaddi_teams at ON e.away_team_id = at.id
        LEFT JOIN open_parks p ON e.openpark_id = p.id
      ) combined
      ORDER BY kickoff_utc
      LIMIT $1
    `;
    const { rows } = await pool.query(sql, [limit]);
    const mapped = rows.map((r) => {
      const homeLogo =
        r.home_logo && r.home_logo.startsWith("http")
          ? r.home_logo
          : r.home_logo_id
          ? cricbuzzLogoUrlFromId(r.home_logo_id)
          : null;
      const awayLogo =
        r.away_logo && r.away_logo.startsWith("http")
          ? r.away_logo
          : r.away_logo_id
          ? cricbuzzLogoUrlFromId(r.away_logo_id)
          : null;
      return { ...r, home_logo: homeLogo, away_logo: awayLogo };
    });
    return res.json(mapped);
  } catch (err) {
    console.error("GET /api/openair error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error fetching events" });
  }
});

module.exports = router;
