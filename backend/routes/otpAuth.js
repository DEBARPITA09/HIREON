// HIREON/backend/routes/otpAuth.js
// Sends a 6-digit OTP via email and verifies it

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express  = require("express");
const nodemailer = require("nodemailer");
const router   = express.Router();

// In-memory OTP store: { email -> { otp, expiresAt } }
// For production use Redis, but this works perfectly for dev 
const otpStore = new Map();

// ── Nodemailer transporter ──────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // Gmail App Password (not your real password)
  },
});

// ── Generate 6-digit OTP ────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── POST /auth/otp/send ─────────────────────────────────────
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp       = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email.toLowerCase(), { otp, expiresAt });

  try {
    await transporter.sendMail({
      from:    `"HIREON" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: "Your HIREON Login OTP",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background: #0a0a0a; padding: 40px; border-radius: 12px; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #ffffff; margin-bottom: 8px; font-size: 22px;">HIREON Login</h2>
          <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 32px;">Use the OTP below to sign in to your account.</p>
          <div style="background: #181818; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; text-align: center;">
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Your OTP</p>
            <h1 style="color: #ffffff; font-size: 42px; letter-spacing: 10px; margin: 0; font-weight: 800;">${otp}</h1>
            <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 12px 0 0;">Expires in 10 minutes</p>
          </div>
          <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 24px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send OTP. Check EMAIL_USER and EMAIL_PASS in .env" });
  }
});

// ── POST /auth/otp/verify ───────────────────────────────────
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return res.status(400).json({ error: "No OTP found for this email. Please request a new one." });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ error: "Incorrect OTP. Please try again." });
  }

  // OTP matched — clear it
  otpStore.delete(email.toLowerCase());
  res.json({ success: true, message: "OTP verified successfully" });
});

module.exports = router;