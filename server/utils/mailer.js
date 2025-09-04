// server/utils/mailer.js
// Dev stub: logs verification/reset links to console.
// Replace with nodemailer or a provider when you're ready.

async function sendMail({ to, subject, html }) {
  console.log("\n==== MOCK EMAIL ====");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("HTML:\n", html);
  console.log("====================\n");
  return { ok: true };
}

module.exports = { sendMail };
