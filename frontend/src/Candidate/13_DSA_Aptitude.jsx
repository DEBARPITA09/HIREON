import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DSA_DB, COMPANY_TIERS } from "./DSA_DATABASE";
import { APTITUDE_DB, APT_TYPES } from "./APTITUDE_DATABASE";

/* ═══════════════════════════════════════
   GRID CANVAS
═══════════════════════════════════════ */
function GridCanvas() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize();
    let t = 0, raf;
    const draw = () => {
      const W = el.width, H = el.height;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.022)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      const g = ctx.createRadialGradient(W*0.25, H*0.35, 0, W*0.25, H*0.35, 420+Math.sin(t)*30);
      g.addColorStop(0,"rgba(79,142,247,0.045)"); g.addColorStop(1,"transparent");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      const g2 = ctx.createRadialGradient(W*0.75, H*0.65, 0, W*0.75, H*0.65, 320+Math.cos(t)*25);
      g2.addColorStop(0,"rgba(0,212,170,0.025)"); g2.addColorStop(1,"transparent");
      ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);
      t += 0.007; raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }} />;
}

/* ═══════════════════════════════════════
   COMPANY LOGO
═══════════════════════════════════════ */
const KNOWN_DOMAINS = {
  google:"google.com", amazon:"amazon.com", microsoft:"microsoft.com",
  meta:"meta.com", apple:"apple.com", uber:"uber.com",
  "goldman sachs":"goldmansachs.com", goldman:"goldmansachs.com",
  "jp morgan":"jpmorgan.com", jpmorgan:"jpmorgan.com",
  flipkart:"flipkart.com", swiggy:"swiggy.com", zomato:"zomato.com",
  paytm:"paytm.com", adobe:"adobe.com", samsung:"samsung.com",
  oracle:"oracle.com", tcs:"tcs.com", infosys:"infosys.com",
  wipro:"wipro.com", accenture:"accenture.com", capgemini:"capgemini.com",
  hcl:"hcltech.com", cognizant:"cognizant.com", ibm:"ibm.com",
  netflix:"netflix.com", spotify:"spotify.com", linkedin:"linkedin.com",
  razorpay:"razorpay.com", freshworks:"freshworks.com", zoho:"zoho.com",
};

function CompanyLogo({ name, color, size=44 }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const key = name?.toLowerCase().trim();
  const domain = KNOWN_DOMAINS[key] || `${key?.replace(/\s+/g,"")}.com`;
  const srcs = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];
  const show = srcIdx < srcs.length;
  return (
    <div style={{ width:size, height:size, borderRadius:12, background:`${color}10`, border:`1px solid ${color}25`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      {show
        ? <img src={srcs[srcIdx]} alt={name} onError={() => setSrcIdx(i=>i+1)} style={{ width:size-12, height:size-12, objectFit:"contain" }} />
        : <span style={{ color, fontSize:Math.round(size*0.4), fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{name?.[0]?.toUpperCase()}</span>
      }
    </div>
  );
}

/* ═══════════════════════════════════════
   DIFFICULTY BADGE
═══════════════════════════════════════ */
function DiffBadge({ diff }) {
  const map = { Easy:["#00d4aa","rgba(0,212,170,0.08)","rgba(0,212,170,0.2)"], Medium:["#f59e0b","rgba(245,158,11,0.08)","rgba(245,158,11,0.2)"], Hard:["#ef4444","rgba(239,68,68,0.08)","rgba(239,68,68,0.2)"] };
  const [color, bg, border] = map[diff] || ["#64748b","rgba(100,116,139,0.08)","rgba(100,116,139,0.2)"];
  return <span style={{ background:bg, color, border:`1px solid ${border}`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, letterSpacing:"0.06em" }}>{diff}</span>;
}

/* ═══════════════════════════════════════
   TYPE BADGE
═══════════════════════════════════════ */
function TypeBadge({ type }) {
  const map = {
    "Quant":     ["#4f8ef7","rgba(79,142,247,0.08)"],
    "Logical":   ["#a78bfa","rgba(167,139,250,0.08)"],
    "Verbal":    ["#34d399","rgba(52,211,153,0.08)"],
    "Coding MCQ":["#f97316","rgba(249,115,22,0.08)"],
  };
  const [color, bg] = map[type] || ["#64748b","rgba(100,116,139,0.08)"];
  return <span style={{ background:bg, color, border:`1px solid ${color}25`, borderRadius:6, padding:"2px 9px", fontSize:10, fontWeight:700, letterSpacing:"0.05em" }}>{type}</span>;
}

/* ═══════════════════════════════════════
   TIER COLORS
═══════════════════════════════════════ */
const TIER_COLORS = {
  "FAANG":          { color:"#f59e0b", bg:"rgba(245,158,11,0.07)", border:"rgba(245,158,11,0.2)" },
  "Tier 1":         { color:"#4f8ef7", bg:"rgba(79,142,247,0.07)", border:"rgba(79,142,247,0.2)" },
  "Finance":        { color:"#00d4aa", bg:"rgba(0,212,170,0.07)",  border:"rgba(0,212,170,0.2)"  },
  "Indian Product": { color:"#ff9900", bg:"rgba(255,153,0,0.07)",  border:"rgba(255,153,0,0.2)"  },
  "MNC":            { color:"#a78bfa", bg:"rgba(167,139,250,0.07)","border":"rgba(167,139,250,0.2)" },
};

/* ═══════════════════════════════════════
   COMPANY CARD (Landing)
═══════════════════════════════════════ */
function CompanyCard({ companyKey, dsaData, aptData, onSelect }) {
  const [hov, setHov] = useState(false);
  const color = dsaData?.color || aptData?.color || "#4f8ef7";
  const name  = dsaData?.company || aptData?.name || companyKey;
  const hasDSA = !!dsaData;
  const hasApt = !!aptData;
  const dsaCount = dsaData?.problems?.length || 0;
  const aptCount = aptData?.questions?.length || 0;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>onSelect(companyKey)}
      style={{ background: hov?"#040912":"#03060c", border:`1px solid ${hov?`${color}30`:"rgba(255,255,255,0.06)"}`, borderRadius:18, padding:"20px 22px", cursor:"pointer", transition:"all 0.28s cubic-bezier(0.16,1,0.3,1)", transform:hov?"translateY(-4px)":"translateY(0)", boxShadow:hov?`0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}18`:"none", position:"relative", overflow:"hidden", animation:`cardIn 0.5s both cubic-bezier(0.16,1,0.3,1)` }}>

      {/* top accent */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${color}60,transparent)` }} />

      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        <CompanyLogo name={name.toLowerCase()} color={color} size={44} />
        <div>
          <div style={{ color:"#f0f4ff", fontSize:14, fontWeight:800, fontFamily:"'Syne',Georgia,serif" }}>{name}</div>
          {/* Tier badge */}
          {Object.entries(COMPANY_TIERS || {}).map(([tier, keys]) =>
            keys?.includes(companyKey) ? (
              <span key={tier} style={{ background:TIER_COLORS[tier]?.bg, color:TIER_COLORS[tier]?.color, border:`1px solid ${TIER_COLORS[tier]?.border}`, borderRadius:6, padding:"1px 8px", fontSize:10, fontWeight:700, letterSpacing:"0.06em" }}>
                {tier}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:10 }}>
        {hasDSA && (
          <div style={{ flex:1, background:"rgba(79,142,247,0.06)", border:"1px solid rgba(79,142,247,0.12)", borderRadius:10, padding:"8px 12px", textAlign:"center" }}>
            <div style={{ color:"#4f8ef7", fontSize:16, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{dsaCount}</div>
            <div style={{ color:"#334155", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>DSA</div>
          </div>
        )}
        {hasApt && (
          <div style={{ flex:1, background:"rgba(0,212,170,0.06)", border:"1px solid rgba(0,212,170,0.12)", borderRadius:10, padding:"8px 12px", textAlign:"center" }}>
            <div style={{ color:"#00d4aa", fontSize:16, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{aptCount}</div>
            <div style={{ color:"#334155", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>Aptitude</div>
          </div>
        )}
      </div>

      {!hasDSA && !hasApt && (
        <div style={{ color:"#1e293b", fontSize:11, textAlign:"center", padding:"8px 0" }}>Coming soon</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   DSA PANEL
═══════════════════════════════════════ */
function DSAPanel({ data, color }) {
  const [topicFilter, setTopicFilter] = useState("All");
  const [diffFilter,  setDiffFilter]  = useState("All");
  const [solved, setSolved] = useState({});

  if (!data) return <div style={{ color:"#334155", padding:40, textAlign:"center" }}>No DSA data for this company yet.</div>;

  const topics = ["All", ...new Set(data.problems.map(p => p.topic))];
  const diffs  = ["All","Easy","Medium","Hard"];

  const filtered = data.problems.filter(p => {
    if (topicFilter !== "All" && p.topic !== topicFilter) return false;
    if (diffFilter  !== "All" && p.difficulty !== diffFilter) return false;
    return true;
  });

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const total = data.problems.length;
  const pct = Math.round((solvedCount/total)*100);

  return (
    <div>
      {/* Progress */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:18 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <span style={{ color:"#94a3b8", fontSize:12, fontWeight:600 }}>Progress</span>
            <span style={{ color:"#f0f4ff", fontSize:12, fontWeight:800 }}>{solvedCount}/{total} solved</span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:5 }}>
            <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:99, transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)", boxShadow:`0 0 8px ${color}60` }} />
          </div>
        </div>
        <div style={{ color, fontSize:20, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{pct}%</div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {topics.map(t => (
            <button key={t} onClick={()=>setTopicFilter(t)}
              style={{ background:topicFilter===t?`${color}15`:"rgba(255,255,255,0.02)", color:topicFilter===t?color:"#475569", border:`1px solid ${topicFilter===t?`${color}35`:"rgba(255,255,255,0.06)"}`, borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {diffs.map(d => (
            <button key={d} onClick={()=>setDiffFilter(d)}
              style={{ background:diffFilter===d?"rgba(255,255,255,0.05)":"transparent", color:diffFilter===d?"#f0f4ff":"#334155", border:`1px solid ${diffFilter===d?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)"}`, borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10, padding:"9px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>⚠️</span>
        <span style={{ color:"#94a3b8", fontSize:11 }}>Based on community reports & Glassdoor reviews. Questions may vary by role and interviewer.</span>
      </div>

      {/* Problems list */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {filtered.map(p => (
          <div key={p.id}
            style={{ background: solved[p.id]?"rgba(0,212,170,0.04)":"rgba(255,255,255,0.015)", border:`1px solid ${solved[p.id]?"rgba(0,212,170,0.15)":"rgba(255,255,255,0.05)"}`, borderRadius:11, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}>
            {/* Checkbox */}
            <div onClick={()=>setSolved(s=>({...s,[p.id]:!s[p.id]}))}
              style={{ width:18, height:18, borderRadius:5, border:`2px solid ${solved[p.id]?"#00d4aa":"rgba(255,255,255,0.15)"}`, background:solved[p.id]?"#00d4aa":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
              {solved[p.id] && <span style={{ color:"#05080f", fontSize:11, fontWeight:900 }}>✓</span>}
            </div>

            {/* Title */}
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ color: solved[p.id]?"#334155":"#e2e8f0", fontSize:13, fontWeight:600, textDecoration:solved[p.id]?"line-through":"none", transition:"all 0.2s", fontFamily:"'Outfit',sans-serif" }}>
                {p.title}
              </span>
            </div>

            {/* Topic pill */}
            <span style={{ color:"#475569", fontSize:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:5, padding:"2px 8px", flexShrink:0, display:window.innerWidth<700?"none":"block" }}>
              {p.topic}
            </span>

            {/* Frequency bar */}
            <div style={{ width:60, flexShrink:0, display:window.innerWidth<700?"none":"block" }}>
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:3 }}>
                <div style={{ width:`${p.frequency||0}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}80)`, borderRadius:99 }} />
              </div>
              <div style={{ color:"#1e293b", fontSize:9, textAlign:"center", marginTop:2 }}>{p.frequency}%</div>
            </div>

            <DiffBadge diff={p.difficulty} />

            <a href={p.leetcode} target="_blank" rel="noopener noreferrer"
              style={{ color:"#4f8ef7", fontSize:11, fontWeight:700, textDecoration:"none", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.06em", flexShrink:0 }}
              onMouseEnter={e=>e.currentTarget.style.color="#7eb5ff"}
              onMouseLeave={e=>e.currentTarget.style.color="#4f8ef7"}>
              Solve →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   APTITUDE PANEL — Quiz mode
═══════════════════════════════════════ */
function AptitudePanel({ data, color }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [mode, setMode] = useState("browse"); // "browse" | "quiz"
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState({});

  if (!data) return <div style={{ color:"#334155", padding:40, textAlign:"center" }}>No aptitude data for this company yet.</div>;

  const filtered = data.questions.filter(q => typeFilter === "All" || q.type === typeFilter);

  const resetQuiz = () => { setQuizIndex(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); setAnswers({}); };

  // BROWSE MODE
  if (mode === "browse") {
    return (
      <div>
        {/* Header row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {APT_TYPES.map(t => (
              <button key={t} onClick={()=>setTypeFilter(t)}
                style={{ background:typeFilter===t?`${color}15`:"rgba(255,255,255,0.02)", color:typeFilter===t?color:"#475569", border:`1px solid ${typeFilter===t?`${color}35`:"rgba(255,255,255,0.06)"}`, borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" }}>
                {t} {t !== "All" && <span style={{ opacity:0.6 }}>({data.questions.filter(q=>q.type===t).length})</span>}
              </button>
            ))}
          </div>
          <button onClick={()=>{ resetQuiz(); setMode("quiz"); }}
            style={{ background:`${color}15`, color, border:`1px solid ${color}35`, borderRadius:10, padding:"8px 20px", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${color}25`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${color}15`;}}>
            Start Quiz →
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10, padding:"9px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14 }}>⚠️</span>
          <span style={{ color:"#94a3b8", fontSize:11 }}>Based on previous year placement papers & community reports. Actual exam may vary.</span>
        </div>

        {/* Questions list */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((q, i) => (
            <div key={q.id}
              style={{ background:"rgba(255,255,255,0.015)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"14px 18px", animation:`cardIn 0.4s ${i*0.03}s both` }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                <span style={{ color:"#1e293b", fontSize:11, fontWeight:700, minWidth:24 }}>Q{i+1}.</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <TypeBadge type={q.type} />
                  </div>
                  <p style={{ color:"#e2e8f0", fontSize:13, margin:0, lineHeight:1.7, fontFamily:"'Outfit',sans-serif" }}>{q.q}</p>
                </div>
              </div>
              {/* Options */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginLeft:34 }}>
                {q.options.map((opt, oi) => (
                  <div key={oi}
                    style={{ background: oi===q.answer?"rgba(0,212,170,0.07)":"rgba(255,255,255,0.02)", border:`1px solid ${oi===q.answer?"rgba(0,212,170,0.2)":"rgba(255,255,255,0.05)"}`, borderRadius:8, padding:"7px 12px", color:oi===q.answer?"#00d4aa":"#475569", fontSize:12, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:oi===q.answer?"#00d4aa":"#1e293b", fontWeight:700, fontSize:11 }}>{["A","B","C","D"][oi]}.</span>
                    {opt}
                    {oi===q.answer && <span style={{ marginLeft:"auto", fontSize:12 }}>✓</span>}
                  </div>
                ))}
              </div>
              {/* Explanation */}
              <div style={{ marginLeft:34, marginTop:8, background:"rgba(79,142,247,0.04)", border:"1px solid rgba(79,142,247,0.1)", borderRadius:8, padding:"7px 12px" }}>
                <span style={{ color:"#334155", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Explanation: </span>
                <span style={{ color:"#475569", fontSize:12 }}>{q.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // QUIZ MODE
  if (done) {
    const pct = Math.round((score/filtered.length)*100);
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", gap:20 }}>
        <div style={{ fontSize:56 }}>{pct>=70?"🏆":pct>=50?"👍":"💪"}</div>
        <div style={{ color:"#f0f4ff", fontSize:24, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>Quiz Complete!</div>
        <div style={{ color, fontSize:40, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{score}/{filtered.length}</div>
        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:8, width:"100%", maxWidth:300 }}>
          <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:99, transition:"width 1s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
        <div style={{ color:"#94a3b8", fontSize:14 }}>{pct>=70?"Excellent! You're well prepared":"Keep practicing — you'll nail it!"}</div>
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button onClick={resetQuiz}
            style={{ background:`${color}15`, color, border:`1px solid ${color}35`, borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            Retry Quiz
          </button>
          <button onClick={()=>{ resetQuiz(); setMode("browse"); }}
            style={{ background:"rgba(255,255,255,0.04)", color:"#64748b", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 24px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',Georgia,serif" }}>
            Browse Mode
          </button>
        </div>
      </div>
    );
  }

  const q = filtered[quizIndex];
  const isLast = quizIndex === filtered.length - 1;

  const handleNext = () => {
    if (!isLast) { setQuizIndex(i=>i+1); setSelected(null); setRevealed(false); }
    else setDone(true);
  };

  return (
    <div>
      {/* Quiz header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#94a3b8", fontSize:13 }}>Question {quizIndex+1} of {filtered.length}</span>
          <TypeBadge type={q.type} />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#00d4aa", fontSize:13, fontWeight:700 }}>Score: {score}</span>
          <button onClick={()=>{ resetQuiz(); setMode("browse"); }}
            style={{ background:"transparent", color:"#334155", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"5px 12px", fontSize:11, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:4, marginBottom:24 }}>
        <div style={{ width:`${((quizIndex)/filtered.length)*100}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:99, transition:"width 0.4s ease" }} />
      </div>

      {/* Question */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"22px 24px", marginBottom:18 }}>
        <p style={{ color:"#f0f4ff", fontSize:15, lineHeight:1.8, margin:0, fontFamily:"'Outfit',sans-serif", fontWeight:500 }}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:20 }}>
        {q.options.map((opt, oi) => {
          const isCorrect = oi === q.answer;
          const isSelected = oi === selected;
          let bg = "rgba(255,255,255,0.02)", border = "rgba(255,255,255,0.07)", color2 = "#94a3b8";
          if (revealed) {
            if (isCorrect) { bg="rgba(0,212,170,0.1)"; border="rgba(0,212,170,0.3)"; color2="#00d4aa"; }
            else if (isSelected) { bg="rgba(239,68,68,0.08)"; border="rgba(239,68,68,0.25)"; color2="#f87171"; }
          } else if (isSelected) {
            bg=`${color}12`; border=`${color}35`; color2=color;
          }
          return (
            <div key={oi} onClick={()=>{ if (!revealed) setSelected(oi); }}
              style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:"13px 18px", color:color2, fontSize:13, fontWeight:isSelected||isCorrect?700:500, cursor:revealed?"default":"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.22s", fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ width:24, height:24, borderRadius:7, border:`1.5px solid currentColor`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
                {["A","B","C","D"][oi]}
              </span>
              {opt}
              {revealed && isCorrect && <span style={{ marginLeft:"auto" }}>✅</span>}
              {revealed && isSelected && !isCorrect && <span style={{ marginLeft:"auto" }}>❌</span>}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <button onClick={()=>{ setRevealed(true); if (selected===q.answer) setScore(s=>s+1); }}
          disabled={selected===null}
          style={{ background:selected!==null?color:"rgba(255,255,255,0.04)", color:selected!==null?"#05080f":"#334155", border:"none", borderRadius:12, padding:"12px 32px", fontSize:13, fontWeight:800, cursor:selected!==null?"pointer":"default", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.25s", width:"100%" }}>
          Check Answer
        </button>
      ) : (
        <div>
          <div style={{ background:"rgba(79,142,247,0.06)", border:"1px solid rgba(79,142,247,0.15)", borderRadius:12, padding:"12px 16px", marginBottom:12 }}>
            <span style={{ color:"#4f8ef7", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>💡 Explanation: </span>
            <span style={{ color:"#64748b", fontSize:13 }}>{q.explanation}</span>
          </div>
          <button onClick={handleNext}
            style={{ background:color, color:"#05080f", border:"none", borderRadius:12, padding:"12px 32px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.25s", width:"100%" }}>
            {isLast ? "Finish Quiz 🏁" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPANY DETAIL PAGE
═══════════════════════════════════════ */
function CompanyDetail({ companyKey, onBack }) {
  const [tab, setTab] = useState("dsa"); // "dsa" | "aptitude"
  const dsaData = DSA_DB?.[companyKey];
  const aptData = APTITUDE_DB?.[companyKey];
  const name  = dsaData?.company || aptData?.name || companyKey;
  const color = dsaData?.color   || aptData?.color || "#4f8ef7";

  return (
    <div style={{ animation:"fadeUp 0.4s both" }}>
      {/* Back + company header */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, flexWrap:"wrap" }}>
        <button onClick={onBack}
          style={{ background:"transparent", color:"#64748b", border:"1px solid rgba(255,255,255,0.08)", padding:"8px 16px", borderRadius:9, fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="#4f8ef7"}
          onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>
          ← All Companies
        </button>
        <CompanyLogo name={name.toLowerCase()} color={color} size={42} />
        <div>
          <div style={{ color:"#f0f4ff", fontSize:20, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{name}</div>
          <div style={{ color:"#334155", fontSize:12 }}>
            {dsaData?.problems?.length||0} DSA problems · {aptData?.questions?.length||0} Aptitude questions
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:4, marginBottom:22, width:"fit-content", gap:4 }}>
        {[
          { key:"dsa",      label:"📘 DSA Sheet",         has: !!dsaData },
          { key:"aptitude", label:"🧠 Aptitude Questions", has: !!aptData },
        ].map(({ key, label, has }) => (
          <button key={key} onClick={()=>{ if(has) setTab(key); }}
            style={{ background:tab===key?`${color}18`:"transparent", color:tab===key?color:has?"#475569":"#1e293b", border:`1px solid ${tab===key?`${color}30`:"transparent"}`, borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:700, cursor:has?"pointer":"default", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.04em", transition:"all 0.22s", opacity:has?1:0.4 }}>
            {label}
            {!has && <span style={{ fontSize:10, marginLeft:6, opacity:0.5 }}>(soon)</span>}
          </button>
        ))}
      </div>

      {/* Panel content */}
      {tab === "dsa"      && <DSAPanel      data={dsaData} color={color} />}
      {tab === "aptitude" && <AptitudePanel data={aptData} color={color} />}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════ */
export const DSAAptitude = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [search, setSearch]                   = useState("");
  const [tierFilter, setTierFilter]           = useState("All");

  // Merge all company keys from both databases
  const dsaKeys = Object.keys(DSA_DB || {});
  const aptKeys = Object.keys(APTITUDE_DB || {});
  const allKeys = [...new Set([...dsaKeys, ...aptKeys])];

  // Filter by search and tier
  const displayed = allKeys.filter(key => {
    const name = DSA_DB?.[key]?.company || APTITUDE_DB?.[key]?.name || key;
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tierFilter !== "All") {
      const inTier = Object.entries(COMPANY_TIERS||{}).some(([tier, keys]) => tier === tierFilter && keys?.includes(key));
      if (!inTier) return false;
    }
    return true;
  });

  const totalDSA = dsaKeys.reduce((s,k) => s + (DSA_DB[k]?.problems?.length||0), 0);
  const totalApt = aptKeys.reduce((s,k) => s + (APTITUDE_DB[k]?.questions?.length||0), 0);

  return (
    <div style={{ minHeight:"100vh", background:"#05080f", fontFamily:"'Outfit','Segoe UI',sans-serif", position:"relative" }}>
      <GridCanvas />

      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 32px", background:"rgba(5,8,15,0.92)", borderBottom:"1px solid rgba(255,255,255,0.055)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(18px)", flexWrap:"wrap" }}>
        <button onClick={() => navigate("/Candidate/06_MainCand")}
          style={{ background:"transparent", color:"#64748b", border:"1px solid rgba(255,255,255,0.08)", padding:"7px 14px", borderRadius:8, fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="#4f8ef7"}
          onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>← Dashboard</button>

        <div style={{ fontWeight:800, fontSize:17 }}><span style={{ color:"#f0f4ff" }}>HIRE</span><span style={{ color:"#4f8ef7" }}>ON</span></div>

        <div style={{ background:"rgba(79,142,247,0.07)", border:"1px solid rgba(79,142,247,0.18)", borderRadius:20, padding:"4px 14px", color:"#4f8ef7", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>DSA + Aptitude</div>

        <div style={{ marginLeft:"auto", display:"flex", gap:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#4f8ef7", fontSize:14, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{totalDSA}+</div>
            <div style={{ color:"#334155", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em" }}>DSA Problems</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#00d4aa", fontSize:14, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{totalApt}+</div>
            <div style={{ color:"#334155", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em" }}>Apt Questions</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#ff9900", fontSize:14, fontWeight:900, fontFamily:"'Syne',Georgia,serif" }}>{allKeys.length}</div>
            <div style={{ color:"#334155", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em" }}>Companies</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px", position:"relative", zIndex:1 }}>

        {selectedCompany ? (
          <CompanyDetail companyKey={selectedCompany} onBack={()=>setSelectedCompany(null)} />
        ) : (
          <>
            {/* Hero */}
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <h1 style={{ fontSize:"clamp(26px,4vw,52px)", fontWeight:900, color:"#f0f4ff", fontFamily:"'Syne',Georgia,serif", letterSpacing:"-1.5px", margin:"0 0 12px" }}>
                DSA <span style={{ color:"#4f8ef7" }}>+</span> Aptitude
                <span style={{ display:"block", fontStyle:"italic", fontWeight:300, color:"rgba(240,244,255,0.3)", fontFamily:"Georgia,'Times New Roman',serif", fontSize:"0.55em", letterSpacing:"-0.5px", marginTop:4 }}>
                  Company-wise Preparation
                </span>
              </h1>
              <p style={{ color:"#475569", fontSize:14, maxWidth:500, margin:"0 auto" }}>
                Curated DSA problems and previous year aptitude questions for top companies
              </p>
            </div>

            {/* Search + Tier filters */}
            <div style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap", alignItems:"center" }}>
              <input placeholder="Search companies..."
                value={search} onChange={e=>setSearch(e.target.value)}
                style={{ background:"#020508", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"10px 18px", color:"#f0f4ff", fontFamily:"'Outfit',sans-serif", fontSize:13, outline:"none", width:240, transition:"border-color 0.2s" }}
                onFocus={e=>e.currentTarget.style.borderColor="rgba(79,142,247,0.4)"}
                onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"} />

              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["All",...Object.keys(TIER_COLORS)].map(tier => (
                  <button key={tier} onClick={()=>setTierFilter(tier)}
                    style={{ background:tierFilter===tier?(TIER_COLORS[tier]?.bg||"rgba(255,255,255,0.06)"):"rgba(255,255,255,0.02)", color:tierFilter===tier?(TIER_COLORS[tier]?.color||"#f0f4ff"):"#475569", border:`1px solid ${tierFilter===tier?(TIER_COLORS[tier]?.border||"rgba(255,255,255,0.15)"):"rgba(255,255,255,0.06)"}`, borderRadius:9, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',Georgia,serif", letterSpacing:"0.06em", transition:"all 0.22s" }}>
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Company grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
              {displayed.map(key => (
                <CompanyCard
                  key={key}
                  companyKey={key}
                  dsaData={DSA_DB?.[key]}
                  aptData={APTITUDE_DB?.[key]}
                  onSelect={setSelectedCompany}
                />
              ))}
            </div>

            {displayed.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#334155", fontSize:14 }}>
                No companies match your search.
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes cardIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
    </div>
  );
};