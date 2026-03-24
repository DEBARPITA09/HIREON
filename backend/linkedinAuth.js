// HIREON/backend/routes/linkedinAuth.js
// LinkedIn OAuth 2.0 → Firebase Custom Token flow
//
// ENV vars needed in backend/.env:
//   LINKEDIN_CLIENT_ID
//   LINKEDIN_CLIENT_SECRET
//   LINKEDIN_REDIRECT_URI   e.g. http://localhost:5000/auth/linkedin/callback
//   FRONTEND_URL            e.g. http://localhost:5173
//   FIREBASE_SERVICE_ACCOUNT (stringified JSON of your Firebase service account)

import express from "express";
import axios from "axios";
import admin from "firebase-admin";

const router = express.Router();

// ── Init Firebase Admin (safe to call multiple times) ──────────────────────
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ── Step 1: Redirect user to LinkedIn ─────────────────────────────────────
// GET /auth/linkedin
router.get("/linkedin", (req, res) => {
  const { role = "candidate" } = req.query; // pass role so we can thread it through

  const params = new URLSearchParams({
    response_type: "code",
    client_id:     process.env.LINKEDIN_CLIENT_ID,
    redirect_uri:  process.env.LINKEDIN_REDIRECT_URI,
    state:         role, // repurpose state param to carry role
    scope:         "openid profile email", // OpenID Connect scopes (LinkedIn 2023+)
  });

  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
});

// ── Step 2: LinkedIn redirects back here ──────────────────────────────────
// GET /auth/linkedin/callback
router.get("/linkedin/callback", async (req, res) => {
  const { code, state: role = "candidate", error } = req.query;

  if (error) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}`
    );
  }

  try {
    // 2a. Exchange code for access token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type:    "authorization_code",
        code,
        redirect_uri:  process.env.LINKEDIN_REDIRECT_URI,
        client_id:     process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    // 2b. Fetch LinkedIn profile (OpenID Connect userinfo endpoint)
    const profileRes = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const {
      sub,        // LinkedIn unique ID
      email,
      name,
      picture,
    } = profileRes.data;

    if (!sub) throw new Error("LinkedIn did not return a user ID");

    // 2c. Firebase uid for LinkedIn users — prefix to avoid collision
    const firebaseUid = `linkedin:${sub}`;

    // 2d. Upsert user in Firestore
    const userRef = admin.firestore().doc(`users/${firebaseUid}`);
    const snap    = await userRef.get();

    if (!snap.exists()) {
      await userRef.set({
        uid:       firebaseUid,
        name:      name  || "",
        email:     email || "",
        photo:     picture || "",
        role,
        provider:  "linkedin",
        createdAt: new Date().toISOString(),
      });
    }

    // 2e. Mint a Firebase custom token
    const customToken = await admin.auth().createCustomToken(firebaseUid, {
      role,
      provider: "linkedin",
    });

    // 2f. Send token back to frontend via redirect
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.searchParams.set("token", customToken);
    redirectUrl.searchParams.set("role",  role);

    res.redirect(redirectUrl.toString());

  } catch (err) {
    console.error("LinkedIn OAuth error:", err.response?.data || err.message);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
        err.message || "LinkedIn auth failed"
      )}`
    );
  }
});

export default router;