const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const OAuth2Strategy = require("passport-oauth2");
const otpRouter = require("./routes/otpAuth");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "hireon_secret_key",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// ── OTP routes ──
app.use("/auth/otp", otpRouter);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

/* ── Helper: build JWT and redirect to frontend ── */
function handleOAuthSuccess(res, user, role) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, photo: user.photo, role },
    process.env.JWT_SECRET || "hireon_jwt_secret",
    { expiresIn: "7d" }
  );
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
  const redirectPath = role === "recruiter" ? "/Recruiter/06_MainRec" : "/Candidate/06_MainCand";
  res.redirect(`${frontendURL}/auth/callback?token=${token}&redirect=${redirectPath}`);
}

/* ══════════════════════════════════════
   GOOGLE OAUTH
══════════════════════════════════════ */
passport.use("google-candidate", new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  "http://localhost:5000/auth/google/candidate/callback",
  proxy: true,
}, (accessToken, refreshToken, profile, done) => {
  const user = { id: profile.id, name: profile.displayName, email: profile.emails?.[0]?.value, photo: profile.photos?.[0]?.value };
  return done(null, user);
}));

passport.use("google-recruiter", new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  "http://localhost:5000/auth/google/recruiter/callback",
  proxy: true,
}, (accessToken, refreshToken, profile, done) => {
  const user = { id: profile.id, name: profile.displayName, email: profile.emails?.[0]?.value, photo: profile.photos?.[0]?.value };
  return done(null, user);
}));

app.get("/auth/google/candidate", passport.authenticate("google-candidate", { scope: ["profile", "email"], prompt: "select_account" }));
app.get("/auth/google/candidate/callback",
  passport.authenticate("google-candidate", { failureRedirect: "/auth/failed", failureMessage: true }),
  (req, res) => handleOAuthSuccess(res, req.user, "candidate")
);
app.get("/auth/google/recruiter", passport.authenticate("google-recruiter", { scope: ["profile", "email"], prompt: "select_account" }));
app.get("/auth/google/recruiter/callback",
  passport.authenticate("google-recruiter", { failureRedirect: "/auth/failed", failureMessage: true }),
  (req, res) => handleOAuthSuccess(res, req.user, "recruiter")
);

/* ══════════════════════════════════════
   GITHUB OAUTH
══════════════════════════════════════ */
passport.use("github-candidate", new GitHubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:  "http://localhost:5000/auth/github/candidate/callback",
  scope: ["user:email"],
}, (accessToken, refreshToken, profile, done) => {
  const user = { id: profile.id, name: profile.displayName || profile.username, email: profile.emails?.[0]?.value, photo: profile.photos?.[0]?.value };
  return done(null, user);
}));

passport.use("github-recruiter", new GitHubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:  "http://localhost:5000/auth/github/recruiter/callback",
  scope: ["user:email"],
}, (accessToken, refreshToken, profile, done) => {
  const user = { id: profile.id, name: profile.displayName || profile.username, email: profile.emails?.[0]?.value, photo: profile.photos?.[0]?.value };
  return done(null, user);
}));

app.get("/auth/github/candidate", passport.authenticate("github-candidate"));
app.get("/auth/github/candidate/callback",
  passport.authenticate("github-candidate", { failureRedirect: "/auth/failed" }),
  (req, res) => handleOAuthSuccess(res, req.user, "candidate")
);
app.get("/auth/github/recruiter", passport.authenticate("github-recruiter"));
app.get("/auth/github/recruiter/callback",
  passport.authenticate("github-recruiter", { failureRedirect: "/auth/failed" }),
  (req, res) => handleOAuthSuccess(res, req.user, "recruiter")
);

/* ══════════════════════════════════════
   LINKEDIN OAUTH
══════════════════════════════════════ */
function createLinkedInStrategy(role) {
  const strategy = new OAuth2Strategy(
    {
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL:         "https://www.linkedin.com/oauth/v2/accessToken",
      clientID:         process.env.LINKEDIN_CLIENT_ID,
      clientSecret:     process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL:      `http://localhost:5000/auth/linkedin/${role}/callback`,
      state:            true,
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        const { data } = await axios.get("https://api.linkedin.com/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = {
          id:    data.sub,
          name:  data.name || `${data.given_name || ""} ${data.family_name || ""}`.trim(),
          email: data.email || "",
          photo: data.picture || "",
        };
        return done(null, user);
      } catch (err) {
        console.error("❌ LinkedIn userinfo error:", err.response?.data || err.message);
        return done(err);
      }
    }
  );
  strategy.authorizationParams = () => ({ scope: "openid profile email" });
  return strategy;
}

passport.use("linkedin-candidate", createLinkedInStrategy("candidate"));
passport.use("linkedin-recruiter", createLinkedInStrategy("recruiter"));

app.get("/auth/linkedin/candidate", passport.authenticate("linkedin-candidate", { scope: ["openid", "profile", "email"] }));
app.get("/auth/linkedin/candidate/callback",
  (req, res, next) => { console.log("✅ LinkedIn candidate callback hit", req.query); next(); },
  passport.authenticate("linkedin-candidate", { failureRedirect: "/auth/failed" }),
  (req, res) => handleOAuthSuccess(res, req.user, "candidate")
);
app.get("/auth/linkedin/recruiter", passport.authenticate("linkedin-recruiter", { scope: ["openid", "profile", "email"] }));
app.get("/auth/linkedin/recruiter/callback",
  (req, res, next) => { console.log("✅ LinkedIn recruiter callback hit", req.query); next(); },
  passport.authenticate("linkedin-recruiter", { failureRedirect: "/auth/failed" }),
  (req, res) => handleOAuthSuccess(res, req.user, "recruiter")
);

/* ── Auth failed ── */
app.get("/auth/failed", (req, res) => {
  console.error("❌ /auth/failed hit");
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendURL}/auth/callback?error=auth_failed`);
});

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "HIREON Backend running ✅" }));

/* ══════════════════════════════════════
   ATS CHECK ENDPOINT
══════════════════════════════════════ */
app.post("/api/ats-check", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
    if (req.file.mimetype !== "application/pdf") return res.status(400).json({ error: "Only PDF files are accepted." });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({ error: "Could not extract text from this PDF. It may be a scanned image." });
    }

    const prompt = `You are a senior ATS (Applicant Tracking System) expert and professional resume reviewer with 10+ years of experience. Analyze this resume text carefully and thoroughly.

Resume Text:
"""
${resumeText.substring(0, 6000)}
"""

Score this resume on exactly these 7 metrics (each 0-100), be honest and precise:
1. Layout & Visual Structure — Readability, spacing, use of sections, clean formatting
2. ATS Keyword Density — Relevant technical/domain keywords, industry terms present
3. Section Completeness — All key sections present: Contact Info, Summary/Objective, Education, Experience, Skills, Projects
4. Bullet Point Quality — Quantified achievements, action verbs, specific impact statements
5. Contact & Links — Email, phone, LinkedIn, GitHub all present and properly formatted
6. Format Readiness — No tables/columns that break ATS, standard fonts, parseable structure
7. Overall Impression — Holistic recruiter view, would this get shortlisted?

Be STRICT, CONSISTENT and ACCURATE. Reply ONLY with valid JSON, no markdown, no extra text:
{
  "overallScore": <weighted integer 0-100>,
  "scoreLabel": "<Poor|Below Average|Average|Good|Strong|Excellent>",
  "headline": "<one honest sentence summary>",
  "metrics": [
    {"name":"Layout & Visual Structure","score":<0-100>,"comment":"<specific observation>"},
    {"name":"ATS Keyword Density","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Section Completeness","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Bullet Point Quality","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Contact & Links","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Format Readiness","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Overall Impression","score":<0-100>,"comment":"<specific observation>"}
  ],
  "topStrengths": ["<strength 1>","<strength 2>","<strength 3>"],
  "criticalFixes": [
    {"issue":"<issue>","fix":"<fix>"},
    {"issue":"<issue>","fix":"<fix>"},
    {"issue":"<issue>","fix":"<fix>"}
  ],
  "quickWins": ["<tip1>","<tip2>","<tip3>","<tip4>"]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 2048,
    });

    const raw   = completion.choices?.[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();

    let result;
    try { result = JSON.parse(clean); }
    catch { return res.status(500).json({ error: "AI returned invalid response. Please try again." }); }

    res.json({ success: true, result, wordCount: resumeText.split(/\s+/).length });
  } catch (err) {
    console.error("ATS Check error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ HIREON Backend running on port ${PORT}`));