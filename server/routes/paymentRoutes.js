const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
} = require("../controllers/paymentController");

router.post("/create-checkout-session", createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
