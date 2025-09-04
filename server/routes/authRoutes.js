// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

router.get("/me", requireAuth, ctrl.me);
router.get("/verify-email", ctrl.verifyEmail);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
