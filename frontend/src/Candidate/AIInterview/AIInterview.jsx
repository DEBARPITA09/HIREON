import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════
   HIREON DESIGN TOKENS
═══════════════════════════════════ */
const T = {
  bg:      "#080808",
  surface: "rgba(255,255,255,0.03)",
  card:    "rgba(255,255,255,0.05)",
  border:  "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",
  white:   "#ffffff",
  muted:   "rgba(255,255,255,0.38)",
  muted2:  "rgba(255,255,255,0.62)",
  green:   "#81e6a0",
  yellow:  "#fbbf24",
  red:     "#f87171",
  accent:  "#c8c8c8",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #080808; }
    textarea, input { font-family: 'DM Sans', sans-serif; }
    textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.18); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;} }
    @keyframes blink   { 0%,100%{opacity:1;}50%{opacity:0.35;} }
    @keyframes spin    { to{transform:rotate(360deg);} }
    @keyframes slide   { 0%{margin-left:-50%;}100%{margin-left:110%;} }
    .fade { animation: fadeUp 0.42s ease both; }
  `}</style>
);

const DomainIcons = {
  "DSA & Algorithms":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  "Web Development":   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  "System Design":     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  "Database & SQL":    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  "Machine Learning":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="19" cy="5" r="3"/></svg>,
  "Cloud & DevOps":    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  "Operating Systems": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
  "Computer Networks": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="16" y="10" width="6" height="4" rx="1"/><rect x="2" y="10" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><path d="M12 6v4"/><path d="M19 14v4H5v-4"/><path d="M12 14v4"/></svg>,
};

const PRESET_DOMAINS = [
  "DSA & Algorithms",
  "Web Development",
  "System Design",
  "Database & SQL",
  "Machine Learning",
  "Cloud & DevOps",
  "Operating Systems",
  "Computer Networks",
];

const PHASE = { SETUP: "setup", LOADING: "loading", INTERVIEW: "interview", FEEDBACK: "feedback" };

/* ── Groq API ── */
async function callGroq(apiKey, messages, jsonMode = false) {
  const body = { model: "llama-3.3-70b-versatile", max_tokens: 1500, messages, temperature: 0.7 };
  if (jsonMode) body.response_format = { type: "json_object" };
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Groq ${res.status}: ${err}`); }
  const data = await res.json();
  return data.choices[0].message.content;
}

/* ── TTS ── */
function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9; utt.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(v => v.name.includes("Google") && v.lang === "en-US") || voices.find(v => v.lang === "en-US");
  if (v) utt.voice = v;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}
function stopSpeaking() { window.speechSynthesis.cancel(); }

/* ── Particle Background ── */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 80;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .00016, vy: (Math.random() - .5) * .00016,
      r: .5 + Math.random() * 1.3, a: .08 + Math.random() * .24, ph: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const pulse = .82 + .18 * Math.sin(t * .016 + p.ph);
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a * pulse})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < .07) {
          ctx.beginPath(); ctx.moveTo(pts[i].x * W, pts[i].y * H); ctx.lineTo(pts[j].x * W, pts[j].y * H);
          ctx.strokeStyle = `rgba(255,255,255,${.04 * (1 - d / .07)})`; ctx.lineWidth = .4; ctx.stroke();
        }
      }
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

/* ── Topbar ── */
function Topbar({ breadcrumb = "AI Mock Interview", right }) {
  const [hov, setHov] = useState(false);
  const goBack = () => { window.history.back(); };
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 56,
      background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      position: "sticky", top: 0, zIndex: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={goBack}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: "transparent", border: `1px solid ${hov ? T.border2 : T.border}`,
            borderRadius: 7, padding: "6px 14px",
            color: hov ? T.white : T.muted,
            fontSize: "0.78rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
          }}>
          ← Dashboard
        </button>
        <span style={{ color: T.border2, fontSize: "0.7rem" }}>/</span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.85rem", color: T.white }}>
          {breadcrumb}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {right}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "0.95rem", color: T.white, letterSpacing: "0.05em" }}>
          <div style={{ width: 24, height: 24, borderRadius: 5, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#080808" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          HIREON
        </div>
      </div>
    </header>
  );
}

/* ── Section Card ── */
const SectionCard = ({ title, accent = T.green, children }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: T.white, margin: 0 }}>{title}</h3>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════
   LANDING SCREEN
═══════════════════════════════════ */
function LandingScreen({ onStart }) {
  const canvasRef = useRef();
  useParticles(canvasRef);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <Topbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>

        <div className="fade" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T.green}08`, color: T.green, border: `1px solid ${T.green}22`, padding: "5px 16px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}`, display: "inline-block", animation: "pulse 2s infinite" }} />
          Voice Powered · Real AI Eval · Groq + Llama 3
        </div>

        <h1 className="fade" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 900, lineHeight: 1.05, color: T.white, margin: "0 0 10px", animationDelay: "0.08s" }}>
          Practice Your Interview.
        </h1>
        <h1 className="fade" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 900, lineHeight: 1.05, fontStyle: "italic", color: T.accent, margin: "0 0 28px", animationDelay: "0.16s" }}>
          Ace the Real One.
        </h1>

        <p className="fade" style={{ fontSize: "0.88rem", color: T.muted, maxWidth: 420, lineHeight: 1.85, margin: "0 0 52px", animationDelay: "0.24s" }}>
          Choose a domain, speak your answers aloud, and get real-time AI feedback on every response — powered by Groq and Llama 3.
        </p>

        <div className="fade" style={{ display: "flex", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 52, animationDelay: "0.3s" }}>
          {[{ val: "5", label: "AI Questions" }, { val: "90s", label: "Per Question" }, { val: "Voice", label: "Answers" }, { val: "Live", label: "AI Eval" }].map(({ val, label }, i, arr) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 28px", gap: 4, borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 900, color: T.white }}>{val}</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        <button className="fade" onClick={onStart}
          style={{ background: T.white, color: "#080808", border: "none", borderRadius: 10, padding: "14px 52px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s", animationDelay: "0.36s" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
          Start Interview →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SETUP SCREEN
═══════════════════════════════════ */
function SetupScreen({ onGenerate }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [customDomain,   setCustomDomain]   = useState("");
  const [domainError,    setDomainError]    = useState("");
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";

  const effectiveDomain = customDomain.trim() || selectedDomain;

  const candidateProfile = (() => {
    try { return JSON.parse(localStorage.getItem("hireon_candidate")) || {}; } catch { return {}; }
  })();

  const handleStart = () => {
    if (!effectiveDomain.trim()) { setDomainError("Please select or enter a domain."); return; }
    if (!apiKey) { setDomainError("Interview service is not configured. Please contact admin."); return; }
    setDomainError("");
    onGenerate(effectiveDomain.trim(), apiKey, candidateProfile);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", paddingBottom: 60, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Topbar breadcrumb="AI Mock Interview" />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 44 }} className="fade">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T.green}08`, color: T.green, border: `1px solid ${T.green}22`, padding: "4px 14px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}`, display: "inline-block", animation: "pulse 2s infinite" }} />
              AI Mock Interview
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: T.white, margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Choose Your Domain.
            </h1>
            <p style={{ fontSize: "0.85rem", color: T.muted, maxWidth: 380, margin: "0 auto", lineHeight: 1.75, fontWeight: 300 }}>
              Select the area you want to be interviewed on, or type a custom topic below.
            </p>
          </div>

          {/* Domain Grid */}
          <SectionCard title="Select Domain" accent={T.border2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 0 }}>
              {PRESET_DOMAINS.map(label => {
                const active = selectedDomain === label;
                return (
                  <div key={label}
                    onClick={() => { setSelectedDomain(label); setCustomDomain(""); setDomainError(""); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "13px 16px",
                      background: active ? "rgba(255,255,255,0.07)" : T.surface,
                      border: `1px solid ${active ? "rgba(255,255,255,0.3)" : T.border}`,
                      borderRadius: 10,
                      color: active ? T.white : T.muted2,
                      fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.border2; e.currentTarget.style.color = T.white; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted2; e.currentTarget.style.background = T.surface; } }}>
                    <span style={{ opacity: active ? 1 : 0.5, flexShrink: 0, display: "flex", alignItems: "center" }}>
                      {DomainIcons[label]}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Custom Input */}
          <SectionCard title="Or type your own domain" accent={T.border2}>
            <input
              value={customDomain}
              onChange={e => { setCustomDomain(e.target.value); setSelectedDomain(""); setDomainError(""); }}
              placeholder="e.g. React Native, Blockchain, Flutter, Python..."
              style={{
                width: "100%", padding: "11px 16px",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${customDomain ? T.border2 : T.border}`,
                borderRadius: 9, color: T.white, fontSize: "0.85rem",
                outline: "none", transition: "border-color 0.2s",
              }}
            />
          </SectionCard>

          {/* Profile preview */}
          {candidateProfile.skills?.length > 0 && (
            <div className="fade" style={{ background: `${T.green}05`, border: `1px solid ${T.green}14`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
              <p style={{ fontSize: "0.72rem", color: T.green, fontWeight: 600, marginBottom: 10 }}>📋 Your skills profile will personalise questions</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {candidateProfile.skills.slice(0, 6).map(s => (
                  <span key={s} style={{ fontSize: "0.68rem", padding: "3px 10px", background: `${T.green}08`, color: T.green, border: `1px solid ${T.green}20`, borderRadius: 99 }}>{s}</span>
                ))}
                {candidateProfile.skills.length > 6 && <span style={{ fontSize: "0.68rem", padding: "3px 10px", background: `${T.green}08`, color: T.green, border: `1px solid ${T.green}20`, borderRadius: 99 }}>+{candidateProfile.skills.length - 6}</span>}
              </div>
            </div>
          )}

          {/* Error */}
          {domainError && (
            <div style={{ background: "rgba(251,191,36,0.06)", border: `1px solid rgba(251,191,36,0.2)`, borderRadius: 9, padding: "11px 16px", color: T.yellow, fontSize: "0.8rem", marginBottom: 16 }}>
              {domainError}
            </div>
          )}

          {/* Info strip */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              {
                label: "5 AI Questions",
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              },
              {
                label: "90 sec each",
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              },
              {
                label: "Voice answers",
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              },
              {
                label: "Real AI eval",
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/></svg>
              },
            ].map(({ label, icon }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 7,
                fontSize: "0.75rem", color: T.muted2,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border2}`,
                borderRadius: 9, padding: "8px 16px",
                fontWeight: 500,
              }}>
                <span style={{ color: T.accent, display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <button onClick={handleStart}
              style={{ background: T.white, color: "#080808", border: "none", borderRadius: 10, padding: "14px 52px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              Start Interview →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════ */
function LoadingScreen({ domain, loadingMsg }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar breadcrumb="Preparing Interview" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "52px 48px", textAlign: "center", maxWidth: 420, width: "90%", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${T.green},transparent)` }} />
          <div style={{ width: 48, height: 48, border: `2px solid ${T.border}`, borderTopColor: T.white, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: "1.3rem", fontWeight: 900, marginBottom: 8 }}>
            Getting Ready...
          </h2>
          <p style={{ color: T.green, fontWeight: 600, fontSize: "0.82rem", marginBottom: 20 }}>{domain}</p>
          <div style={{ background: T.border, borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 18, position: "relative" }}>
            <div style={{ height: "100%", width: "50%", background: T.white, borderRadius: 99, animation: "slide 1.8s ease-in-out infinite" }} />
          </div>
          <p style={{ color: T.muted, fontSize: "0.78rem" }}>{loadingMsg || "Generating your interview questions..."}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   INTERVIEW SCREEN
═══════════════════════════════════ */
function InterviewScreen({ questions, currentQ, effectiveDomain, isSpeaking, isListening, isThinking, transcript, interimText, timeLeft, onSubmit, onSkip, onStartListening }) {
  const q = questions[currentQ];
  const timerPct = (timeLeft / 90) * 100;
  const timerColor = timeLeft > 30 ? T.green : timeLeft > 10 ? T.yellow : T.red;
  const canvasRef = useRef();
  useParticles(canvasRef);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", paddingBottom: 60, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <Topbar
        breadcrumb={`Question ${currentQ + 1} of ${questions.length}`}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.7rem", color: T.muted, background: "rgba(200,200,200,0.08)", border: `1px solid rgba(200,200,200,0.18)`, borderRadius: 6, padding: "4px 10px", fontWeight: 600, letterSpacing: "0.04em" }}>{effectiveDomain}</span>
            {q && <span style={{ fontSize: "0.65rem", fontWeight: 600, borderRadius: 6, padding: "4px 10px", border: "1px solid transparent", background: q.difficulty === "Easy" ? "rgba(129,230,160,0.1)" : q.difficulty === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)", color: q.difficulty === "Easy" ? T.green : q.difficulty === "Medium" ? T.yellow : T.red }}>{q.difficulty}</span>}
          </div>
        }
      />

      {/* Progress bar */}
      <div style={{ height: 2, background: T.border }}>
        <div style={{ height: "100%", background: T.white, width: `${(currentQ / questions.length) * 100}%`, transition: "width 0.5s ease" }} />
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>

        {/* Question */}
        <SectionCard title={`Question ${currentQ + 1}`} accent={T.green}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>
              {isSpeaking ? "🔊" : isListening ? "🎙️" : isThinking ? "🧠" : "💬"}
            </div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", color: T.white, lineHeight: 1.65, margin: 0, fontWeight: 700 }}>
              {q?.q}
            </p>
          </div>
        </SectionCard>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 3, background: T.border, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${timerPct}%`, height: "100%", background: timerColor, borderRadius: 99, transition: "width 1s linear, background 0.3s" }} />
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: timerColor, width: 32, textAlign: "right" }}>{timeLeft}s</span>
        </div>

        {/* Status */}
        <div style={{ minHeight: 28, marginBottom: 8 }}>
          {isSpeaking  && <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.accent, animation: "blink 1.8s infinite" }}>🔊 AI Interviewer speaking...</div>}
          {isListening && <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.green, animation: "blink 1.8s infinite" }}>🎙️ Listening — speak your answer</div>}
          {isThinking  && <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.muted2, animation: "blink 1.8s infinite" }}>🧠 Groq AI evaluating your answer...</div>}
        </div>

        {/* Transcript */}
        {(transcript || interimText) && (
          <div style={{ background: `${T.green}04`, border: `1px solid ${T.green}15`, borderRadius: 12, padding: 16, marginBottom: 16, minHeight: 60 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>Your Answer</p>
            <p style={{ fontSize: "0.85rem", color: T.muted2, lineHeight: 1.65, margin: 0 }}>
              {transcript}<span style={{ color: T.muted, fontStyle: "italic" }}>{interimText}</span>
            </p>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {isListening && (
            <button onClick={onSubmit}
              style={{ flex: 1, padding: 13, background: T.white, border: "none", borderRadius: 10, color: "#080808", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}>
              ✓ Submit Answer
            </button>
          )}
          {!isSpeaking && !isListening && !isThinking && (
            <button onClick={onStartListening}
              style={{ flex: 1, padding: 13, background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, color: T.muted2, fontSize: "0.82rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.muted2; e.currentTarget.style.borderColor = T.border2; }}>
              🎙️ Start Speaking
            </button>
          )}
          {!isThinking && (
            <button onClick={onSkip}
              style={{ padding: "13px 20px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.muted, fontSize: "0.82rem", fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.muted2; e.currentTarget.style.borderColor = T.border2; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}>
              Skip →
            </button>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   FEEDBACK SCREEN
═══════════════════════════════════ */
function FeedbackScreen({ results, feedbackData, effectiveDomain, onRetry }) {
  const avgScore   = results.length ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length) : 0;
  const scoreColor = avgScore >= 75 ? T.green : avgScore >= 50 ? T.yellow : T.red;
  const circ       = 2 * Math.PI * 54;
  const fillOffset = circ - (avgScore / 100) * circ;
  const canvasRef  = useRef();
  useParticles(canvasRef);

  const readinessColor =
    feedbackData?.readinessLevel === "Interview Ready" ? T.green :
    feedbackData?.readinessLevel === "Almost Ready"   ? T.accent :
    feedbackData?.readinessLevel === "Needs Practice" ? T.yellow : T.red;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", paddingBottom: 80, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <Topbar
        breadcrumb="Interview Report"
        right={
          <button onClick={onRetry}
            style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 7, padding: "6px 14px", color: T.muted, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.border2; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}>
            Try Again
          </button>
        }
      />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }} className="fade">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T.green}08`, color: T.green, border: `1px solid ${T.green}22`, padding: "4px 14px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}`, display: "inline-block" }} />
            Interview Complete
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.7rem,4vw,2.6rem)", fontWeight: 900, color: T.white, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Your Interview Report.
          </h1>
        </div>

        {/* Score hero */}
        <SectionCard title="Overall Score" accent={scoreColor}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="54" fill="none" stroke={T.border} strokeWidth="10" />
                <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={circ} strokeDashoffset={fillOffset} strokeLinecap="round"
                  transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1.5s ease" }} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, display: "block", color: scoreColor }}>{avgScore}</span>
                <span style={{ fontSize: "0.65rem", color: T.muted }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {feedbackData?.readinessLevel && (
                <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, padding: "5px 16px", borderRadius: 99, border: `1px solid ${readinessColor}40`, background: `${readinessColor}12`, color: readinessColor, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {feedbackData.readinessLevel}
                </span>
              )}
              <p style={{ fontSize: "0.82rem", color: T.muted2, lineHeight: 1.75, margin: "0 0 8px" }}>{feedbackData?.overallSummary}</p>
              {feedbackData?.encouragement && (
                <p style={{ fontSize: "0.78rem", color: T.muted, fontStyle: "italic", margin: 0 }}>💬 "{feedbackData.encouragement}"</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Strengths & Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {feedbackData?.topStrengths?.length > 0 && (
            <div style={{ background: T.surface, border: `1px solid rgba(129,230,160,0.18)`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${T.green},transparent)` }} />
              <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: T.green, margin: "0 0 12px" }}>✓ Strengths</p>
              {feedbackData.topStrengths.map((s, i) => <p key={i} style={{ fontSize: "0.75rem", color: T.muted2, margin: "0 0 7px", lineHeight: 1.55 }}>• {s}</p>)}
            </div>
          )}
          {feedbackData?.areasToImprove?.length > 0 && (
            <div style={{ background: T.surface, border: `1px solid rgba(248,113,113,0.18)`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${T.red},transparent)` }} />
              <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: T.red, margin: "0 0 12px" }}>↑ Areas to Improve</p>
              {feedbackData.areasToImprove.map((s, i) => <p key={i} style={{ fontSize: "0.75rem", color: T.muted2, margin: "0 0 7px", lineHeight: 1.55 }}>• {s}</p>)}
            </div>
          )}
        </div>

        {/* Per-question breakdown */}
        <SectionCard title="Question Breakdown" accent={T.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map((r, i) => {
              const qColor = (r.score || 0) >= 70 ? T.green : (r.score || 0) >= 45 ? T.yellow : T.red;
              return (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,${qColor},transparent)` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: "0.8rem", color: T.muted2, lineHeight: 1.5, flex: 1 }}>Q{i + 1}. {r.question?.q}</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.9rem", fontWeight: 900, color: qColor, flexShrink: 0 }}>{r.score || 0}/100</span>
                  </div>
                  <div style={{ height: 2, background: T.border, borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
                    <div style={{ width: `${r.score || 0}%`, height: "100%", background: qColor, borderRadius: 99, transition: "width 1.2s ease" }} />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: T.muted, margin: "0 0 5px", lineHeight: 1.55 }}><strong style={{ color: T.muted2 }}>Your answer:</strong> {(r.answer || "").slice(0, 180)}{(r.answer || "").length > 180 ? "..." : ""}</p>
                  {r.idealAnswer && <p style={{ fontSize: "0.75rem", color: T.accent, margin: "0 0 5px", lineHeight: 1.55, fontStyle: "italic" }}><strong>Ideal:</strong> {r.idealAnswer}</p>}
                  <p style={{ fontSize: "0.75rem", color: T.muted2, margin: 0, lineHeight: 1.55 }}>💬 {r.feedback}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Study Topics */}
        {feedbackData?.studyTopics?.length > 0 && (
          <SectionCard title="Recommended Study Topics" accent={T.green}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {feedbackData.studyTopics.map((t, i) => (
                <span key={i} style={{ fontSize: "0.72rem", padding: "5px 14px", background: `${T.green}07`, color: T.green, border: `1px solid ${T.green}20`, borderRadius: 99 }}>{t}</span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
          <button onClick={onRetry}
            style={{ background: T.white, color: "#080808", border: "none", borderRadius: 10, padding: "14px 44px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
            Try Another Interview →
          </button>
        </div>

      </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT CONTROLLER
═══════════════════════════════════ */
export default function AIInterview() {
  const [phase,          setPhase]          = useState(PHASE.SETUP);
  const [effectiveDomain,setEffDomain]      = useState("");
  const [apiKey,         setApiKey]         = useState("");
  const [questions,      setQuestions]      = useState([]);
  const [currentQ,       setCurrentQ]       = useState(0);
  const [answers,        setAnswers]        = useState([]);
  const [results,        setResults]        = useState([]);
  const [transcript,     setTranscript]     = useState("");
  const [interimText,    setInterimText]    = useState("");
  const [isListening,    setIsListening]    = useState(false);
  const [isSpeaking,     setIsSpeaking]     = useState(false);
  const [isThinking,     setIsThinking]     = useState(false);
  const [loadingMsg,     setLoadingMsg]     = useState("");
  const [timeLeft,       setTimeLeft]       = useState(90);
  const [timerActive,    setTimerActive]    = useState(false);
  const [feedbackData,   setFeedbackData]   = useState(null);
  const [showLanding,    setShowLanding]    = useState(true);

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);
  const answersRef     = useRef([]);
  const questionsRef   = useRef([]);

  /* Timer */
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      handleSubmitAnswer("(No answer given — time expired)");
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  /* Generate questions */
  const generateQuestions = async (domain, key, profile) => {
    setEffDomain(domain);
    setApiKey(key);
    setPhase(PHASE.LOADING);
    setLoadingMsg("Groq AI is preparing your interview questions...");

    const profileContext = profile.skills?.length
      ? `Candidate skills: ${profile.skills.join(", ")}. Domain: ${profile.domain || "Not specified"}.`
      : "No profile available.";

    try {
      const raw = await callGroq(key, [
        {
          role: "system",
          content: `You are a senior technical interviewer conducting a SPOKEN voice interview. Generate exactly 5 interview questions for the domain: "${domain}".
${profileContext}
STRICT RULES:
- ALL questions must be conceptual, verbal, and answerable by speaking — NO coding questions
- Ask about concepts, explanations, comparisons, trade-offs, real-world use cases
- Questions should progressively increase in difficulty: Easy, Easy, Medium, Medium, Hard
- If the domain seems invalid, respond with: {"invalid": true, "reason": "brief explanation"}
- Return ONLY valid JSON: {"questions": [{"q": "question text", "difficulty": "Easy|Medium|Hard", "hint": "brief hint for evaluation"}]}`
        },
        { role: "user", content: `Generate 5 spoken verbal interview questions for: ${domain}` }
      ], true);

      const parsed = JSON.parse(raw);

      if (parsed.invalid) {
        setPhase(PHASE.SETUP);
        return;
      }

      const qs = parsed.questions || [];
      if (qs.length === 0) throw new Error("No questions returned");

      setQuestions(qs);
      questionsRef.current = qs;
      setAnswers([]);
      answersRef.current = [];
      setResults([]);
      setCurrentQ(0);
      setPhase(PHASE.INTERVIEW);
      setTimeout(() => askQuestion(qs, 0, domain), 500);
    } catch (err) {
      console.error(err);
      setPhase(PHASE.SETUP);
    }
  };

  /* Ask question via TTS */
  const askQuestion = useCallback((qs, idx, domain) => {
    if (idx >= qs.length) return;
    setIsSpeaking(true);
    setTranscript("");
    setInterimText("");
    setTimeLeft(90);
    setTimerActive(false);

    const intro = idx === 0
      ? `Hello! Welcome to your AI interview on ${domain}. I will ask you ${qs.length} questions. Speak your answer clearly. Let's begin. Question 1. `
      : `Question ${idx + 1}. `;

    speak(intro + qs[idx].q, () => {
      setIsSpeaking(false);
      setTimerActive(true);
      startListening();
    });
  }, []);

  /* Speech recognition */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for voice recognition."); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => setIsListening(false);
    rec.onerror  = () => setIsListening(false);
    rec.onresult = (e) => {
      let final = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      if (final) setTranscript(prev => prev + final);
      setInterimText(interim);
    };
    rec.start();
    recognitionRef.current = rec;
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  /* Submit answer */
  const handleSubmitAnswer = async (forcedAnswer) => {
    stopListening();
    stopSpeaking();
    setTimerActive(false);
    clearTimeout(timerRef.current);
    setIsListening(false);

    const currentTranscript = transcript;
    const currentInterim    = interimText;
    const ans = typeof forcedAnswer === "string"
      ? forcedAnswer
      : (currentTranscript + currentInterim).trim() || "(No answer provided)";

    setIsThinking(true);
    setTranscript("");
    setInterimText("");

    let evaluation = { score: 0, feedback: "Could not evaluate.", strengths: [], improvements: [] };
    try {
      const qObj = questionsRef.current[currentQ];
      const raw = await callGroq(apiKey, [
        { role: "system", content: `You are a strict but fair technical interviewer evaluating a spoken answer.\nReturn ONLY valid JSON:\n{"score": <0-100>, "feedback": "<2-3 sentence evaluation>", "strengths": ["<point>"], "improvements": ["<point>"], "idealAnswer": "<brief ideal answer in 2-3 sentences>"}` },
        { role: "user", content: `Domain: ${effectiveDomain}\nQuestion: ${qObj.q}\nHint: ${qObj.hint || ""}\nCandidate's answer: "${ans}"\nEvaluate this answer.` }
      ], true);
      evaluation = { ...evaluation, ...JSON.parse(raw) };
    } catch (err) {
      evaluation = { score: ans.length > 30 ? 40 : 10, feedback: "Could not evaluate via AI.", strengths: [], improvements: [], idealAnswer: "" };
    }

    const newResults = [...answersRef.current.map((a, i) => ({ ...results[i], answer: a })),
      { ...evaluation, answer: ans, question: questionsRef.current[currentQ] }];

    const newAnswers = [...answersRef.current, ans];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    setIsThinking(false);

    const next = currentQ + 1;

    if (next >= questionsRef.current.length) {
      setIsThinking(true);
      setLoadingMsg("Generating your interview report...");
      setPhase(PHASE.LOADING);
      try {
        const allQA = questionsRef.current.map((q, i) => `Q${i + 1}: ${q.q}\nA: ${newAnswers[i] || "(no answer)"}`).join("\n\n");
        const raw = await callGroq(apiKey, [
          { role: "system", content: `You are a senior technical interviewer. Provide comprehensive feedback.\nReturn ONLY valid JSON:\n{"overallSummary":"<3-4 sentence assessment>","topStrengths":["<s1>","<s2>","<s3>"],"areasToImprove":["<a1>","<a2>","<a3>"],"readinessLevel":"<Not Ready|Needs Practice|Almost Ready|Interview Ready>","studyTopics":["<t1>","<t2>","<t3>"],"encouragement":"<1 motivating sentence>"}` },
          { role: "user", content: `Domain: ${effectiveDomain}\n\nInterview Q&A:\n${allQA}\n\nGenerate comprehensive feedback.` }
        ], true);
        setFeedbackData(JSON.parse(raw));
      } catch {
        setFeedbackData({ overallSummary: "Interview complete.", topStrengths: [], areasToImprove: [], readinessLevel: "Needs Practice", studyTopics: [], encouragement: "Keep practicing!" });
      }

      setResults(newResults);
      setIsThinking(false);
      speak("Thank you for completing the interview. Your feedback report is ready.", () => {
        setPhase(PHASE.FEEDBACK);
      });
    } else {
      setResults(prev => [...prev, { ...evaluation, answer: ans, question: questionsRef.current[currentQ] }]);
      setCurrentQ(next);
      speak("Got it. Next question.", () => {
        askQuestion(questionsRef.current, next, effectiveDomain);
      });
    }
  };

  return (
    <>
      <GlobalStyle />
      {showLanding && (
        <LandingScreen onStart={() => setShowLanding(false)} />
      )}
      {!showLanding && phase === PHASE.SETUP && (
        <SetupScreen onGenerate={generateQuestions} />
      )}
      {phase === PHASE.LOADING && (
        <LoadingScreen domain={effectiveDomain} loadingMsg={loadingMsg} />
      )}
      {phase === PHASE.INTERVIEW && (
        <InterviewScreen
          questions={questions}
          currentQ={currentQ}
          effectiveDomain={effectiveDomain}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isThinking={isThinking}
          transcript={transcript}
          interimText={interimText}
          timeLeft={timeLeft}
          onSubmit={handleSubmitAnswer}
          onSkip={() => handleSubmitAnswer("(Skipped)")}
          onStartListening={startListening}
        />
      )}
      {phase === PHASE.FEEDBACK && (
        <FeedbackScreen
          results={results}
          feedbackData={feedbackData}
          effectiveDomain={effectiveDomain}
          onRetry={() => {
            setPhase(PHASE.SETUP);
            setShowLanding(false);
            setResults([]);
            setAnswers([]);
            answersRef.current = [];
            setCurrentQ(0);
            setFeedbackData(null);
          }}
        />
      )}
    </>
  );
}