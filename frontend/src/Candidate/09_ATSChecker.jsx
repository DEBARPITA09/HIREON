import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════
   GRID CANVAS BACKGROUND
═══════════════════════════════════════ */
function GridCanvas() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    el.width = el.offsetWidth; el.height = el.offsetHeight;
    let W = el.width, H = el.height, t = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.028)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const cx = W / 2, cy = H / 2, r = 320 + Math.sin(t) * 30;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(79,142,247,0.055)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      t += 0.012; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ═══════════════════════════════════════
   TOPBAR
═══════════════════════════════════════ */
function TopBar({ badge }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)" }}>
      <button onClick={() => navigate("/Candidate/06_MainCand")}
        style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
        ← Back to Dashboard
      </button>
      <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.4px" }}>
        <span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span>
      </div>
      <div style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.18)", borderRadius: 20, padding: "4px 14px", color: "#4f8ef7", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {badge}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GROQ API — PDF as base64
═══════════════════════════════════════ */
const callGroq = async (base64PDF) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not found in .env");

  const prompt = `You are a professional ATS (Applicant Tracking System) expert and resume reviewer. Analyze this resume PDF (provided as base64) by reading its content carefully.

Score the resume on these 7 metrics (each out of 100):
1. Layout & Visual Structure — Is it clean, readable, well-spaced?
2. ATS Keyword Density — Does it have relevant technical/domain keywords?
3. Section Completeness — Are all key sections present? (Contact, Summary, Education, Experience, Skills, Projects)
4. Bullet Point Quality — Are achievements quantified? Action verbs used?
5. Contact & Links — Email, phone, LinkedIn, GitHub present?
6. File & Format Readiness — Is content parseable, no tables/columns that break ATS?
7. Overall Impression — Holistic recruiter view

Also give:
- overallScore: weighted average out of 100
- scoreLabel: "Poor" | "Below Average" | "Average" | "Good" | "Strong" | "Excellent"
- headline: one sentence summary of this resume
- topStrengths: array of 3 strings (what is good)
- criticalFixes: array of 3 objects {issue, fix}
- quickWins: array of 4 short actionable tips

Reply ONLY with valid JSON, no markdown:
{
  "overallScore": <0-100>,
  "scoreLabel": "<label>",
  "headline": "<string>",
  "metrics": [
    {"name":"Layout & Visual Structure","score":<0-100>,"comment":"<string>"},
    {"name":"ATS Keyword Density","score":<0-100>,"comment":"<string>"},
    {"name":"Section Completeness","score":<0-100>,"comment":"<string>"},
    {"name":"Bullet Point Quality","score":<0-100>,"comment":"<string>"},
    {"name":"Contact & Links","score":<0-100>,"comment":"<string>"},
    {"name":"Format Readiness","score":<0-100>,"comment":"<string>"},
    {"name":"Overall Impression","score":<0-100>,"comment":"<string>"}
  ],
  "topStrengths": ["<s1>","<s2>","<s3>"],
  "criticalFixes": [
    {"issue":"<issue>","fix":"<fix>"},
    {"issue":"<issue>","fix":"<fix>"},
    {"issue":"<issue>","fix":"<fix>"}
  ],
  "quickWins": ["<tip1>","<tip2>","<tip3>","<tip4>"]
}

Resume base64 PDF: ${base64PDF.substring(0, 8000)}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Groq error: ${err?.error?.message || response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); }
  catch { throw new Error("AI returned invalid response. Please try again."); }
};

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const scoreColor = (s) => {
  if (s >= 80) return "#00d4aa";
  if (s >= 60) return "#4f8ef7";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
};

function AnimatedBar({ value, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 300 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 99, transition: "width 1.2s ease" }} />
    </div>
  );
}

function CountUp({ target }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0; const step = target / 80;
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t); } else setV(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{v}</>;
}

function Ring({ score, size = 160, stroke = 12 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, fontFamily: "'Syne',Georgia,serif" }}><CountUp target={score} /></span>
        <span style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 1 — LANDING
═══════════════════════════════════════ */
function LandingScreen({ onNext }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", flexDirection: "column", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <GridCanvas />
      <TopBar badge="ATS Checker" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block", animation: "pulse 2s infinite" }} />
          Instant · Free · AI Powered
        </div>

        <h1 style={{ fontSize: "clamp(34px,5vw,64px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-2px", margin: "0 0 16px", color: "#f0f4ff", fontFamily: "'Syne',Georgia,serif" }}>
          Your Resume Deserves<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(240,244,255,0.4)", fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-1px" }}>To Be Seen.</span>
        </h1>

        <p style={{ fontSize: 15, color: "#475569", maxWidth: 460, lineHeight: 1.8, margin: "0 0 14px" }}>
          Most resumes never reach a human — they're filtered out by ATS bots before anyone reads them.
        </p>
        <p style={{ fontSize: 15, color: "#334155", maxWidth: 440, lineHeight: 1.8, margin: "0 0 44px" }}>
          Upload your resume and get an instant ATS score across <span style={{ color: "#4f8ef7", fontWeight: 700 }}>7 critical metrics</span> — with specific fixes to get you past the filters.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 48 }}>
          {[{ val: "7", label: "Metrics" }, { val: "ATS", label: "Optimised" }, { val: "PDF", label: "Upload" }].map(({ val, label }, i, arr) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 36px", gap: 4, borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.5px", fontFamily: "'Syne',Georgia,serif" }}>{val}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#475569", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 12, padding: "15px 48px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; }}>
          CHECK MY ATS SCORE →
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 2 — UPLOAD
═══════════════════════════════════════ */
function UploadScreen({ onAnalyze }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") { setErrMsg("❌ Please upload a PDF file only."); return; }
    if (f.size > 5 * 1024 * 1024) { setErrMsg("❌ File too large. Max 5MB."); return; }
    setFile(f); setErrMsg("");
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setErrMsg("");
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Failed to read file"));
        r.readAsDataURL(file);
      });
      const result = await callGroq(base64);
      onAnalyze(result, file.name);
    } catch (e) {
      setErrMsg("❌ " + e.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative" }}>
      <GridCanvas />
      <TopBar badge="ATS Checker" />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block" }} />
            Step 1 of 1
          </div>
          <h2 style={{ color: "#f0f4ff", fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, letterSpacing: "-1.5px", fontFamily: "'Syne',Georgia,serif", margin: "0 0 10px" }}>Upload Your Resume</h2>
          <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.75 }}>PDF format only · Max 5MB · Your file is never stored</p>
        </div>

        {errMsg && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 20px", color: "#f87171", fontSize: 14, marginBottom: 20 }}>
            {errMsg}
          </div>
        )}

        {/* Drop Zone */}
        <div
          onClick={() => !file && inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            background: dragging ? "rgba(79,142,247,0.05)" : file ? "rgba(0,212,170,0.04)" : "#03060c",
            border: `2px dashed ${dragging ? "rgba(79,142,247,0.5)" : file ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 16, padding: "56px 24px", textAlign: "center",
            cursor: file ? "default" : "pointer", transition: "all 0.2s",
            marginBottom: 20,
          }}>
          <input ref={inputRef} type="file" accept=".pdf" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />

          {file ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 14 }}>📄</div>
              <div style={{ color: "#00d4aa", fontWeight: 800, fontSize: 16, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.04em", marginBottom: 6 }}>{file.name}</div>
              <div style={{ color: "#475569", fontSize: 13, marginBottom: 20 }}>{(file.size / 1024).toFixed(1)} KB · PDF</div>
              <button onClick={() => setFile(null)}
                style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                × Remove
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📂</div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.04em", marginBottom: 8 }}>DROP YOUR RESUME HERE</div>
              <div style={{ color: "#334155", fontSize: 13, marginBottom: 20 }}>or click to browse files</div>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 20px", color: "#64748b", fontSize: 12, fontWeight: 600 }}>
                PDF Only · Max 5MB
              </div>
            </>
          )}
        </div>

        {/* Info row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
          {[
            { icon: "🔒", title: "Private", desc: "Never stored or shared" },
            { icon: "⚡", title: "Instant", desc: "Results in seconds" },
            { icon: "🎯", title: "Precise", desc: "7 detailed metrics" },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "#05080f", padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{title}</div>
              <div style={{ color: "#334155", fontSize: 11 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={handleAnalyze} disabled={!file || loading}
            style={{ background: file && !loading ? "#f0f4ff" : "rgba(255,255,255,0.05)", color: file && !loading ? "#05080f" : "#334155", border: "none", borderRadius: 12, padding: "15px 56px", fontSize: 14, fontWeight: 800, cursor: file && !loading ? "pointer" : "not-allowed", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={e => { if (file && !loading) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.15)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = file && !loading ? "#f0f4ff" : "rgba(255,255,255,0.05)"; e.currentTarget.style.boxShadow = "none"; }}>
            {loading ? "⏳ ANALYSING..." : "SCAN MY RESUME →"}
          </button>
          {!file && <p style={{ color: "#334155", fontSize: 12, marginTop: 10 }}>Upload a PDF to continue</p>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 3 — LOADING
═══════════════════════════════════════ */
function LoadingScreen() {
  const steps = ["Parsing your resume structure...", "Checking ATS keyword density...", "Evaluating section completeness...", "Analysing bullet point quality...", "Calculating your ATS score..."];
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1600); return () => clearInterval(t); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <GridCanvas />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 440, padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 20, display: "inline-block", animation: "bob 1.5s ease-in-out infinite" }}>📊</div>
        <h2 style={{ color: "#f0f4ff", fontSize: 22, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "-0.5px", marginBottom: 8 }}>Scanning Your Resume</h2>
        <p style={{ color: "#334155", fontSize: 14, marginBottom: 28 }}>Running ATS simulation across 7 metrics...</p>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", width: "50%", background: "linear-gradient(90deg,#4f8ef7,#00d4aa)", borderRadius: 99, animation: "slide 1.8s ease-in-out infinite" }} />
        </div>
        <p style={{ color: "#475569", fontSize: 13, minHeight: 22 }}>{steps[step]}</p>
      </div>
      <style>{`
        @keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @keyframes slide{0%{margin-left:-50%;}100%{margin-left:110%;}}
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN 4 — RESULTS
═══════════════════════════════════════ */
function ResultsScreen({ result, fileName, onRetry }) {
  const navigate = useNavigate();
  const sc = scoreColor(result.overallScore);

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", fontFamily: "'Outfit','Segoe UI',sans-serif", paddingBottom: 80 }}>
      <GridCanvas />

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/Candidate/06_MainCand")}
          style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
          ← Dashboard
        </button>
        <div style={{ fontWeight: 800, fontSize: 18 }}><span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span></div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.18)", borderRadius: 20, padding: "4px 14px", color: "#4f8ef7", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>ATS Results</div>
          <button onClick={onRetry}
            style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            🔄 New Scan
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 }}>

        {/* Score Hero */}
        <div style={{ background: "#03060c", border: `1px solid ${sc}25`, borderRadius: 20, padding: "36px 32px", display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${sc},transparent)` }} />
          <Ring score={result.overallScore} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
              <h2 style={{ color: "#f0f4ff", fontSize: 22, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "-0.5px", margin: 0 }}>ATS Score</h2>
              <span style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}40`, borderRadius: 8, padding: "4px 14px", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.06em" }}>{result.scoreLabel}</span>
            </div>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>{result.headline}</p>
            <div style={{ color: "#334155", fontSize: 12 }}>📄 {fileName}</div>
          </div>
        </div>

        {/* 7 Metrics */}
        <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#4f8ef7,transparent)" }} />
          <h3 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>7 ATS Metrics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {result.metrics.map((m, i) => {
              const c = scoreColor(m.score);
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
                    <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: c, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{m.score}<span style={{ color: "#334155", fontSize: 11, fontWeight: 400 }}>/100</span></span>
                  </div>
                  <AnimatedBar value={m.score} color={c} delay={i * 80} />
                  <p style={{ color: "#334155", fontSize: 12, marginTop: 5, lineHeight: 1.6 }}>{m.comment}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        <div style={{ background: "#03060c", border: "1px solid rgba(0,212,170,0.12)", borderRadius: 16, padding: "24px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#00d4aa,transparent)" }} />
          <h3 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>✅ Top Strengths</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.topStrengths.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.1)", borderRadius: 10 }}>
                <span style={{ color: "#00d4aa", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>0{i + 1}</span>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.7 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Fixes */}
        <div style={{ background: "#03060c", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 16, padding: "24px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#ef4444,transparent)" }} />
          <h3 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>⚠️ Critical Fixes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.criticalFixes.map((f, i) => (
              <div key={i} style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚡ {f.issue}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 13 }}>💡</span>
                  <span style={{ color: "#fcd34d", fontSize: 12, lineHeight: 1.6 }}><strong>Fix:</strong> {f.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        <div style={{ background: "#03060c", border: "1px solid rgba(79,142,247,0.12)", borderRadius: 16, padding: "24px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#4f8ef7,transparent)" }} />
          <h3 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>🎯 Quick Wins</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {result.quickWins.map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "rgba(79,142,247,0.04)", border: "1px solid rgba(79,142,247,0.08)", borderRadius: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f8ef7", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.7 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", paddingTop: 8 }}>
          <button onClick={onRetry}
            style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; }}>
            🔍 Scan Another Resume
          </button>
          <button onClick={() => navigate("/Candidate/services/resume-builder")}
            style={{ background: "transparent", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 12, padding: "14px 36px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,142,247,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            📝 Build Better Resume
          </button>
          <button onClick={() => navigate("/Candidate/services/resume-analysis")}
            style={{ background: "transparent", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.3)", borderRadius: 12, padding: "14px 36px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,170,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            🧠 AI Resume Analysis
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════ */
export const ATSChecker = () => {
  const [screen, setScreen] = useState("landing");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleAnalyze = (data, name) => {
    setResult(data); setFileName(name); setScreen("result");
  };

  if (screen === "landing") return <LandingScreen onNext={() => setScreen("upload")} />;
  if (screen === "upload")  return <UploadScreen onAnalyze={(d, n) => { handleAnalyze(d, n); }} />;
  if (screen === "loading") return <LoadingScreen />;
  if (screen === "result")  return <ResultsScreen result={result} fileName={fileName} onRetry={() => { setResult(null); setScreen("upload"); }} />;
  return null;
};