const pool = require("../config/db");
// server/controllers/paymentController.js
require("dotenv").config();
const Stripe = require("stripe");
const { log, error, debug } = require("../utils/logger");
const {
  createPaymentRecord,
  findBySessionId,
  updateBySessionId,
} = require("../models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Helper: convert rupees to paise (integer)
function toPaise(amountRupees) {
  // assume amountRupees is number (e.g., 30 or 30.5)
  // multiply by 100 and round to avoid float issues
  return Math.round(Number(amountRupees) * 100);
}

// POST /api/payments/create-checkout-session
async function createCheckoutSession(req, res) {
  try {
    const { preset, customAmount, userId = null, metadata = {} } = req.body;

    // Determine amount in rupees
    let amountRupees = null;
    if (preset) amountRupees = Number(preset);
    else if (customAmount) amountRupees = Number(customAmount);
    else return res.status(400).json({ error: "No amount provided" });

    if (Number.isNaN(amountRupees) || amountRupees <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Validation: min ₹10, max ₹10000 (adjust as you prefer)
    if (amountRupees < 10 || amountRupees > 10000) {
      return res
        .status(400)
        .json({ error: "Amount must be between ₹10 and ₹10,000" });
    }

    const amountPaise = toPaise(amountRupees);

    // Optionally create local payment record (pending)
    const localPayment = await createPaymentRecord({
      orderId: null,
      userId,
      amount: amountPaise,
      currency: "inr",
      status: "pending",
      metadata,
    });

    // Create Stripe Checkout Session
    const YOUR_DOMAIN =
      process.env.APP_URL || process.env.API_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Buy me a tea",
              description: "Support EventU — a small donation",
            },
            unit_amount: amountPaise,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/payment-cancel`,
      metadata: {
        local_payment_id: localPayment.id ? String(localPayment.id) : "",
        ...metadata,
      },
    });

    // Update local record with session id
    await updateBySessionId(localPayment.stripe_session_id || session.id, {
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent || null,
    }).catch(() => {
      // fallback: update by id if above didn't work
      // implement simple update by id
      // (we keep it simple: not to crash)
    });

    // Return session URL to frontend
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    error("createCheckoutSession error", err);
    res.status(500).json({ error: err.message });
  }
}

// POST /api/payments/webhook
async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (!webhookSecret) {
      // parse raw body if no webhook secret (not recommended)
      event = JSON.parse(req.body.toString());
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err) {
    error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  log("Received Stripe event:", event.type);
  // Handle relevant events
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const localPaymentId = session.metadata?.local_payment_id || null;

      // Update local DB to paid
      const updates = {
        status: "paid",
        stripe_payment_intent_id: session.payment_intent || null,
        metadata: session,
      };

      // either update by local id (if present) or by session id
      if (localPaymentId) {
        // simple update query using model (we have updateBySessionId only)
        // try update by session id if present, else update by setting session id then updating
        await updateBySessionId(sessionId, updates);
      } else {
        // try find by session id and update, otherwise create record
        const existing = await findBySessionId(sessionId);
        if (existing) {
          await updateBySessionId(sessionId, updates);
        } else {
          await createPaymentRecord({
            orderId: null,
            userId: null,
            amount: session.amount_total || 0,
            currency: session.currency || "inr",
            stripeSessionId: sessionId,
            stripePaymentIntentId: session.payment_intent || null,
            status: "paid",
            metadata: session,
          });
        }
      }

      log(`Checkout session completed: ${sessionId}`);
    } else if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      log(`PaymentIntent succeeded: ${intent.id}`);
      // optional: update payment record by payment_intent
      // find payment by stripe_payment_intent_id if you store it
    } else {
      log("Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (err) {
    error("Webhook processing error:", err);
    res.status(500).send();
  }
}

module.exports = { createCheckoutSession, handleWebhook };
