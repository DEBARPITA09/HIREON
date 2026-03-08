import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — identical to ResumeBuilder
═══════════════════════════════════════════════════════════ */
const C = {
  bg:        "#060d1a",
  surface:   "#0b1528",
  card:      "#0f1e35",
  cardHover: "#142540",
  border:    "#1a3350",
  teal:      "#0ea5e9",
  tealLight: "#38bdf8",
  teal2:     "#00D4AA",
  tealGlow:  "rgba(14,165,233,0.1)",
  blue:      "#4F8EF7",
  gold:      "#f59e0b",
  goldGlow:  "rgba(245,158,11,0.15)",
  purple:    "#8b5cf6",
  text:      "#e2e8f0",
  muted:     "#64748b",
  muted2:    "#94a3b8",
  white:     "#ffffff",
  danger:    "#ef4444",
  success:   "#10b981",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES — identical to ResumeBuilder
═══════════════════════════════════════════════════════════ */
const GlobalStyle = () => (
  <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;600;700;800&family=Manrope:wght@700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Outfit','Segoe UI',sans-serif;}
      input,textarea{font-family:'Outfit','Segoe UI',sans-serif;}
      input::placeholder,textarea::placeholder{color:#1e3050;}
      input:focus,textarea:focus{
        border-color:#4f8ef7!important;
        box-shadow:0 0 0 3px rgba(79,142,247,0.08)!important;
        outline:none;
      }
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-track{background:#05080f;}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
      @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(79,142,247,0.4);}70%{box-shadow:0 0 0 10px rgba(79,142,247,0);}100%{box-shadow:0 0 0 0 rgba(79,142,247,0);}}
      @keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;}}
      @keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
      @keyframes slide{0%{margin-left:-50%;}100%{margin-left:110%;}}
      .fade-up{animation:fadeUp 0.45s ease both;}
    `}</style>
  </>
);

/* ═══════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════ */

/* Animated grid + radial glow canvas background */
const GridCanvas = () => {
  const ref = useRef({ current: null });
  return (
    <canvas
      ref={el => {
        if (!el || ref.current) return;
        ref.current = el;
        const ctx = el.getContext("2d");
        el.width = el.offsetWidth; el.height = el.offsetHeight;
        let W = el.width, H = el.height, t = 0, raf;
        const draw = () => {
          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "rgba(255,255,255,0.028)"; ctx.lineWidth = 1;
          for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
          for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
          const cx = W / 2, cy = H / 2, r = 300 + Math.sin(t) * 30;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, "rgba(79,142,247,0.055)"); g.addColorStop(1, "transparent");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          t += 0.012; raf = requestAnimationFrame(draw);
        };
        draw();
      }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
};

/* Top navigation bar — matches builder exactly */
const TopBar = ({ right, badge = "AI Analysis" }) => {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)", flexWrap: "wrap" }}>
      <button
        onClick={() => navigate("/Candidate/06_MainCand")}
        style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
        ← Back to Dashboard
      </button>
      <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.4px" }}>
        <span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span>
      </div>
      <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 20, padding: "4px 14px", color: "#00d4aa", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {badge}
      </div>
      {right && <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
};

/* Section card — identical accent bar style as builder */
const Section = ({ title, children, accent = C.teal }) => (
  <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Syne',Georgia,serif" }}>{title}</h3>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DOMAINS
═══════════════════════════════════════════════════════════ */
const DOMAINS = [
  { id: "webdev",    label: "Web Development",        icon: "🌐", color: "#0ea5e9", sub: "React, Node, HTML/CSS, JavaScript" },
  { id: "backend",   label: "Backend Development",     icon: "⚙️", color: "#8b5cf6", sub: "Spring Boot, Django, APIs, Databases" },
  { id: "ai_ml",     label: "AI / Machine Learning",   icon: "🤖", color: "#00D4AA", sub: "Python, TensorFlow, PyTorch, NLP" },
  { id: "datascience",label:"Data Science",            icon: "📊", color: "#f59e0b", sub: "Pandas, SQL, Visualization, Stats" },
  { id: "devops",    label: "DevOps & Cloud",          icon: "☁️", color: "#38bdf8", sub: "Docker, AWS, CI/CD, Linux" },
  { id: "android",   label: "Android Development",     icon: "📱", color: "#4ade80", sub: "Kotlin, Java, Firebase, XML" },
  { id: "cybersec",  label: "Cybersecurity",           icon: "🔐", color: "#f87171", sub: "Networking, Ethical Hacking, OWASP" },
  { id: "dsa",       label: "Competitive Programming", icon: "🏆", color: "#fbbf24", sub: "DSA, LeetCode, Codeforces, CP" },
  { id: "iot",       label: "IoT & Embedded Systems",  icon: "🔌", color: "#a78bfa", sub: "Arduino, Raspberry Pi, C/C++" },
  { id: "blockchain",label: "Blockchain",              icon: "⛓️", color: "#34d399", sub: "Solidity, Web3, Smart Contracts" },
  { id: "uiux",      label: "UI/UX Design",            icon: "🎨", color: "#f472b6", sub: "Figma, Prototyping, User Research" },
  { id: "fullstack", label: "Full Stack Development",  icon: "💻", color: "#60a5fa", sub: "MERN, MEAN, Spring + React" },
];

/* ═══════════════════════════════════════════════════════════
   GROQ API
═══════════════════════════════════════════════════════════ */
const callGroq = async (resumeText, domainLabel) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not found. Check your .env file.");

  const prompt = `You are an expert technical recruiter. Analyze this resume for the domain: "${domainLabel}".

Resume:
"""
${resumeText}
"""

Reply with ONLY valid JSON, no markdown, no extra text:
{
  "overallStrength": <integer 0-100>,
  "strengthLabel": "<Weak|Below Average|Average|Good|Strong|Excellent>",
  "headline": "<one sentence summary of this candidate for this domain>",
  "strongAreas": [
    {"area":"<area name>","detail":"<specific strength>","score":<0-100>},
    {"area":"<area name>","detail":"<specific strength>","score":<0-100>},
    {"area":"<area name>","detail":"<specific strength>","score":<0-100>}
  ],
  "weakAreas": [
    {"area":"<area name>","detail":"<what is weak>","gap":"<specific fix>"},
    {"area":"<area name>","detail":"<what is weak>","gap":"<specific fix>"},
    {"area":"<area name>","detail":"<what is weak>","gap":"<specific fix>"}
  ],
  "domainSkillsCovered": [
    {"skill":"<skill>","present":<true|false>},
    {"skill":"<skill>","present":<true|false>},
    {"skill":"<skill>","present":<true|false>},
    {"skill":"<skill>","present":<true|false>},
    {"skill":"<skill>","present":<true|false>},
    {"skill":"<skill>","present":<true|false>}
  ],
  "topRecommendations": ["<tip1>","<tip2>","<tip3>","<tip4>"],
  "nextSteps": "<2-3 sentence motivating career advice>"
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 2048 }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${err?.error?.message || response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); }
  catch { throw new Error("AI returned invalid response. Please try again."); }
};

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const strengthColor = (s) => {
  if (s >= 80) return "#00D4AA";
  if (s >= 60) return "#4F8EF7";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
};

function CountUp({ target }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0; const step = target / 80;
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t); } else setV(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{v}</>;
}

function Ring({ score, size = 150, stroke = 11 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ, color = strengthColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}><CountUp target={score} /></span>
        <span style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function Bar({ value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 300); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 7, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 99, transition: "width 1.2s ease" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING SCREEN — matches builder Landing exactly
═══════════════════════════════════════════════════════════ */
function LandingScreen({ onNext }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", flexDirection: "column", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <GridCanvas />

      {/* Top bar */}
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
        <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 20, padding: "4px 14px", color: "#00d4aa", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          AI Analysis
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block", animation: "pulse 2s infinite" }} />
          AI Powered · Instant Results · 100% Free
        </div>

        <h1 style={{ fontSize: "clamp(34px,5vw,64px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-2px", margin: "0 0 16px", color: "#f0f4ff", fontFamily: "'Syne',Georgia,serif" }}>
          Analyse Your Resume.<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(240,244,255,0.4)", fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-1px" }}>Know Your Strengths.</span>
        </h1>

        <p style={{ fontSize: 15, color: "#334155", maxWidth: 420, lineHeight: 1.8, margin: "0 0 44px" }}>
          Paste your resume, choose your target domain, and get a detailed AI-powered strength report with actionable feedback — in seconds.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 48 }}>
          {[{ val: "Domain", label: "Specific" }, { val: "Instant", label: "Feedback" }, { val: "Free", label: "No Cost" }].map(({ val, label }, i, arr) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 36px", gap: 4, borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.5px" }}>{val}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#475569", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 12, padding: "15px 48px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; }}>
          ANALYSE MY RESUME →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INPUT SCREEN — builder form style
═══════════════════════════════════════════════════════════ */
function InputScreen({ onAnalyze }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [domain, setDomain] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canStart = text.trim().length > 100 && domain && !loading;

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true); setErrMsg("");
    try {
      const result = await callGroq(text.trim(), domain.label);
      onAnalyze(result, domain);
    } catch (e) {
      setErrMsg("❌ " + e.message);
      setLoading(false);
    }
  };

  const stepDone  = i => (i === 0 && text.length > 100) || (i === 1 && !!domain);
  const stepActive= i => (i === 0 && text.length <= 100) || (i === 1 && text.length > 100 && !domain) || (i === 2 && text.length > 100 && !!domain);

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", fontFamily: "'Outfit','Segoe UI',sans-serif", paddingBottom: 60, position: "relative" }}>
      <GridCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Top bar */}
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
          <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 20, padding: "4px 14px", color: "#00d4aa", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Resume Analysis
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

          {/* Step indicator — builder style */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block" }} />
              Resume Analysis
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {["Paste Resume", "Choose Domain", "Start Analysis"].map((s, i) => {
                const done = stepDone(i);
                const active = stepActive(i);
                return (
                  <React.Fragment key={s}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? C.teal2 : active ? C.blue : "rgba(255,255,255,0.06)", border: `2px solid ${done ? C.teal2 : active ? C.blue : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 16 : 13, fontWeight: 700, color: done || active ? "#fff" : C.muted, transition: "all 0.3s" }}>
                        {done ? "✓" : i + 1}
                      </div>
                      <span style={{ fontSize: 11, color: done ? C.teal2 : active ? C.blue : C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ width: 60, height: 2, background: done ? C.teal2 : "rgba(255,255,255,0.06)", margin: "0 8px", marginBottom: 22, transition: "background 0.3s" }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {errMsg && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "14px 20px", color: "#ef4444", fontSize: 14, fontWeight: 500, marginBottom: 20 }}>
              {errMsg}
            </div>
          )}

          {/* STEP 1 — builder Section card style */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.teal},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ background: `${C.blue}20`, border: `1px solid ${C.blue}40`, borderRadius: 8, padding: "3px 10px", color: C.blue, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>STEP 1</span>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.2px", margin: 0 }}>Paste Your Resume Text</h3>
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>
              Open your resume → Select All (<kbd style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>Ctrl+A</kbd>) → Copy (<kbd style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>Ctrl+C</kbd>) → Paste below
            </p>
            <div style={{ position: "relative" }}>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder={"Paste your entire resume text here...\n\nExample:\nJohn Doe\njohn@email.com | LinkedIn | GitHub\n\nEDUCATION\nB.Tech Computer Science — XYZ University\n\nSKILLS\nJava, Python, React, Node.js...\n\nEXPERIENCE\n..."}
                style={{ width: "100%", minHeight: 280, background: "#020508", border: `1px solid ${text.length > 100 ? "rgba(0,212,170,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "18px", color: C.text, fontSize: 14, lineHeight: 1.7, fontFamily: "'Courier New',monospace", resize: "vertical", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} />
              <div style={{ position: "absolute", bottom: 14, right: 16, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: wordCount > 50 ? C.teal2 : C.muted, fontWeight: 600 }}>
                {wordCount} words {wordCount > 50 ? "✓" : "(need more)"}
              </div>
            </div>
            <div style={{ marginTop: 12, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, fontFamily: "'Manrope',sans-serif", flexShrink: 0, marginTop: 1 }}>TIP</span>
              <p style={{ color: "#fcd34d", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                Open your resume PDF in browser → Press <strong>Ctrl+A</strong> → <strong>Ctrl+C</strong> → Come back and press <strong>Ctrl+V</strong> to paste!
              </p>
            </div>
          </div>

          {/* STEP 2 — builder Section card style */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.purple},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ background: `${C.blue}20`, border: `1px solid ${C.blue}40`, borderRadius: 8, padding: "3px 10px", color: C.blue, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>STEP 2</span>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.2px", margin: 0 }}>Choose Your Target Domain</h3>
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Select the field you are targeting or building your career in.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 10 }}>
              {DOMAINS.map(d => (
                <div key={d.id} onClick={() => setDomain(d)}
                  style={{ background: domain?.id === d.id ? `${d.color}15` : "#020508", border: `1px solid ${domain?.id === d.id ? d.color : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 12px", cursor: "pointer", transition: "all 0.2s", transform: domain?.id === d.id ? "scale(1.02)" : "scale(1)", boxShadow: domain?.id === d.id ? `0 4px 20px ${d.color}25` : "none", position: "relative", overflow: "hidden" }}>
                  {domain?.id === d.id && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${d.color},transparent)` }} />}
                  <div style={{ color: domain?.id === d.id ? d.color : C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.label}</div>
                  <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5 }}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA — builder primary button style */}
          <div style={{ textAlign: "center" }}>
            <button onClick={handleStart} disabled={!canStart}
              style={{ background: canStart ? "#f0f4ff" : "rgba(255,255,255,0.06)", color: canStart ? "#05080f" : C.muted, border: "none", borderRadius: 12, padding: "15px 52px", fontSize: 14, fontWeight: 800, cursor: canStart ? "pointer" : "not-allowed", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { if (canStart) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.15)"; } }}
              onMouseLeave={e => { if (canStart) { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; } }}>
              {loading ? "ANALYSING..." : "START ANALYSIS →"}
            </button>
            {text.length <= 100 && <p style={{ color: C.muted, fontSize: 12, marginTop: 10 }}>Paste your resume text to continue</p>}
            {text.length > 100 && !domain && <p style={{ color: C.muted, fontSize: 12, marginTop: 10 }}>Choose a domain to continue</p>}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN — builder style
═══════════════════════════════════════════════════════════ */
function LoadingScreen({ domain }) {
  const steps = ["Reading your resume...", "Understanding your experience...", "Comparing with domain requirements...", "Generating your strength report..."];
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1800); return () => clearInterval(t); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", flexDirection: "column", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <GridCanvas />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)" }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.4px" }}>
          <span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span>
        </div>
        <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 20, padding: "4px 14px", color: "#00d4aa", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          AI Resume Analysis
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        {/* Centered card — builder card style */}
        <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "48px 52px", textAlign: "center", maxWidth: 460, width: "90%", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${domain.color},transparent)` }} />

          <div style={{ fontSize: 48, marginBottom: 20, display: "inline-block", animation: "bob 1.5s ease-in-out infinite" }}>⚙️</div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block", animation: "pulse 2s infinite" }} />
            Analysing Your Resume
          </div>

          <h2 style={{ color: "#f0f4ff", fontSize: 22, fontWeight: 800, fontFamily: "'Syne',Georgia,serif", letterSpacing: "-0.5px", marginBottom: 8 }}>
            Working on it...
          </h2>
          <p style={{ color: domain.color, fontWeight: 600, fontSize: 14, marginBottom: 28 }}>{domain.icon} {domain.label}</p>

          {/* Progress bar — builder style */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 20, position: "relative" }}>
            <div style={{ height: "100%", width: "50%", background: `linear-gradient(90deg,${C.teal},${C.teal2})`, borderRadius: 99, animation: "slide 1.8s ease-in-out infinite" }} />
          </div>

          <p style={{ color: C.muted, fontSize: 13, minHeight: 22 }}>{steps[step]}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULT SCREEN — builder section-card style throughout
═══════════════════════════════════════════════════════════ */
function ResultScreen({ result, domain, onRetry }) {
  const navigate = useNavigate();
  const sc = strengthColor(result.overallStrength);
  const color = domain.color;

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", fontFamily: "'Outfit','Segoe UI',sans-serif", paddingBottom: 60, position: "relative" }}>
      <GridCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/Candidate/06_MainCand")}
            style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
            ← Dashboard
          </button>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.4px" }}>
            <span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span>
          </div>
          <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 20, padding: "4px 14px", color: "#00d4aa", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Resume Analysis
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 20, padding: "4px 14px", color, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{domain.icon} {domain.label}</div>
            <button onClick={onRetry}
              style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              New Analysis
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px", display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Page heading */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block" }} />
              Analysis Complete
            </div>
            <h2 style={{ color: "#f0f4ff", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, letterSpacing: "-1px", fontFamily: "'Syne',Georgia,serif", margin: 0 }}>
              Your Resume Report.
            </h2>
          </div>

          {/* ── Score Hero ── */}
          <div style={{ background: "#03060c", border: `1px solid ${sc}25`, borderRadius: 16, padding: "32px 28px", display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap", position: "relative", overflow: "hidden", marginBottom: 18, boxShadow: `0 8px 40px ${sc}10` }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${sc},transparent)` }} />
            <Ring score={result.overallStrength} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                <h2 style={{ color: "#ffffff", fontSize: 28, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.8px", margin: 0, lineHeight: 1.05 }}>RESUME STRENGTH</h2>
                <span style={{ background: `${sc}20`, color: sc, border: `1px solid ${sc}50`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>{result.strengthLabel}</span>
              </div>
              <p style={{ color: C.muted2, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{result.headline}</p>
              <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 10, padding: "10px 14px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ color, fontSize: 12, fontWeight: 700, fontFamily: "'Manrope',sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Analysed for: {domain.label}</span>
              </div>
            </div>
          </div>

          {/* ── Strong Areas ── */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.teal2},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.4px", margin: 0 }}>STRONG AREAS</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {result.strongAreas.map((s, i) => (
                <div key={i} style={{ background: "#020508", border: "1px solid rgba(0,212,170,0.12)", borderRadius: 12, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 10, left: -1, width: 3, height: 26, background: `linear-gradient(180deg,${C.teal2},transparent)`, borderRadius: "0 2px 2px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                    <span style={{ color: C.teal2, fontWeight: 700, fontSize: 13, fontFamily: "'Manrope',sans-serif" }}>{s.area}</span>
                    <span style={{ color: C.teal2, fontWeight: 800, fontSize: 14 }}>{s.score}%</span>
                  </div>
                  <Bar value={s.score} color={C.teal2} />
                  <p style={{ color: C.muted2, fontSize: 13, margin: "10px 0 0", lineHeight: 1.6 }}>{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Weak Areas ── */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.danger},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.4px", margin: 0 }}>AREAS TO IMPROVE</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {result.weakAreas.map((w, i) => (
                <div key={i} style={{ background: "#020508", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 12, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 10, left: -1, width: 3, height: 26, background: `linear-gradient(180deg,${C.danger},transparent)`, borderRadius: "0 2px 2px 0" }} />
                  <div style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 6, fontFamily: "'Manrope',sans-serif" }}>{w.area}</div>
                  <p style={{ color: C.muted2, fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>{w.detail}</p>
                  <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, fontFamily: "'Manrope',sans-serif", flexShrink: 0, marginTop: 1 }}>FIX</span>
                    <span style={{ color: "#fcd34d", fontSize: 12, lineHeight: 1.6 }}>{w.gap}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Domain Skills Coverage ── */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.4px", margin: 0 }}>DOMAIN SKILLS COVERAGE</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, marginBottom: 16 }}>
              {result.domainSkillsCovered.map((sk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#020508", border: `1px solid ${sk.present ? C.teal2 + "30" : "rgba(255,255,255,0.05)"}`, borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: sk.present ? C.teal2 : "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                  <span style={{ color: sk.present ? C.teal2 : C.muted, fontSize: 13, fontWeight: sk.present ? 600 : 400 }}>{sk.skill}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${(result.domainSkillsCovered.filter(s => s.present).length / result.domainSkillsCovered.length) * 100}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 99, transition: "width 1.2s ease" }} />
              </div>
              <span style={{ color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{result.domainSkillsCovered.filter(s => s.present).length}/{result.domainSkillsCovered.length} skills</span>
            </div>
          </div>

          {/* ── Top Recommendations ── */}
          <div style={{ background: "#03060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.blue},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.4px", margin: 0 }}>TOP RECOMMENDATIONS</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.topRecommendations.map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#020508", border: "1px solid rgba(79,142,247,0.08)", borderRadius: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${C.blue}18`, border: `1px solid ${C.blue}35`, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ color: C.muted2, fontSize: 13, margin: 0, lineHeight: 1.7 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Next Steps ── */}
          <div style={{ background: "#03060c", border: `1px solid ${color}20`, borderRadius: 16, padding: 24, marginBottom: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.4px", margin: 0 }}>YOUR NEXT STEPS</h3>
            </div>
            <p style={{ color: C.muted2, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{result.nextSteps}</p>
          </div>

          {/* ── CTA buttons — builder style ── */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onRetry}
              style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Manrope',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; }}>
              Analyse Another Resume
            </button>
            <button onClick={() => navigate("/Candidate/services/resume-builder")}
              style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 40px", borderRadius: 12, fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              Build a Better Resume
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export const ResumeAnalysis = () => {
  const [screen, setScreen] = useState("landing");
  const [result, setResult] = useState(null);
  const [domain, setDomain] = useState(null);

  const handleAnalyze = (data, selectedDomain) => {
    setResult(data); setDomain(selectedDomain); setScreen("result");
  };

  return (
    <>
      <GlobalStyle />
      {screen === "landing" && <LandingScreen onNext={() => setScreen("input")} />}
      {screen === "input"   && <InputScreen onAnalyze={(data, dom) => { setDomain(dom); setScreen("loading"); setTimeout(async () => { handleAnalyze(data, dom); }, 0); }} />}
      {screen === "loading" && <LoadingScreen domain={domain} />}
      {screen === "result"  && <ResultScreen result={result} domain={domain} onRetry={() => { setResult(null); setScreen("input"); }} />}
    </>
  );
};