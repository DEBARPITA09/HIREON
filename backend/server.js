const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "HIREON Backend running ✅" }));

/* ── ATS CHECK ENDPOINT ── */
app.post("/api/ats-check", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
    if (req.file.mimetype !== "application/pdf") return res.status(400).json({ error: "Only PDF files are accepted." });

    /* Step 1 — Extract text from PDF */
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({ error: "Could not extract text from this PDF. It may be a scanned image. Please try a text-based PDF or use the Resume Analysis paste option." });
    }

    /* Step 2 — Send clean text to Groq */
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

Be STRICT, CONSISTENT and ACCURATE. You must give the SAME score every time for the same resume. Base scores purely on what is present or absent in the text. A resume missing LinkedIn should get low Contact score. A resume with no numbers/metrics in bullets should get low Bullet score. Do not vary your scoring — be deterministic

Reply ONLY with valid JSON, no markdown, no extra text:
{
  "overallScore": <weighted integer 0-100>,
  "scoreLabel": "<Poor|Below Average|Average|Good|Strong|Excellent>",
  "headline": "<one honest sentence summary of this resume for a recruiter>",
  "metrics": [
    {"name":"Layout & Visual Structure","score":<0-100>,"comment":"<specific observation>"},
    {"name":"ATS Keyword Density","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Section Completeness","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Bullet Point Quality","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Contact & Links","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Format Readiness","score":<0-100>,"comment":"<specific observation>"},
    {"name":"Overall Impression","score":<0-100>,"comment":"<specific observation>"}
  ],
  "topStrengths": ["<specific strength 1>","<specific strength 2>","<specific strength 3>"],
  "criticalFixes": [
    {"issue":"<specific issue found>","fix":"<exact actionable fix>"},
    {"issue":"<specific issue found>","fix":"<exact actionable fix>"},
    {"issue":"<specific issue found>","fix":"<exact actionable fix>"}
  ],
  "quickWins": ["<tip1>","<tip2>","<tip3>","<tip4>"]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 2048,
    });

    const raw = completion.choices?.[0]?.message?.content || "";
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