import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DSA_DB, COMPANY_TIERS } from "./DSA_DATABASE";
import { APTITUDE_DB, APT_TYPES } from "./APTITUDE_DATABASE";

/* ═══════════════════════════════════
   HIREON DESIGN TOKENS
═══════════════════════════════════ */
const T = {
  bg:      "#080808",
  surface: "rgba(255,255,255,0.03)",
  card:    "rgba(255,255,255,0.04)",
  border:  "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",
  white:   "#ffffff",
  muted:   "rgba(255,255,255,0.38)",
  muted2:  "rgba(255,255,255,0.62)",
  green:   "#81e6a0",
  blue:    "#8ab4f8",
  yellow:  "#fbbf24",
  accent:  "#c8c8c8",
  red:     "#f87171",
  purple:  "#c084fc",
};

/* ═══════════════════════════════════
   GLOBAL STYLE
═══════════════════════════════════ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'DM Sans',sans-serif; background:#080808; }
    input { font-family:'DM Sans',sans-serif; }
    input::placeholder { color:rgba(255,255,255,0.2); }
    input:focus { outline:none; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
    @keyframes cardIn  { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;} }
    .fade { animation:fadeUp 0.42s ease both; }
    .cardIn { animation:cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  `}</style>
);

/* ═══════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════ */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 90;
    const pts = Array.from({length:N}, () => ({
      x:Math.random(), y:Math.random(),
      vx:(Math.random()-.5)*.00018, vy:(Math.random()-.5)*.00018,
      r:.6+Math.random()*1.4, a:.1+Math.random()*.32, ph:Math.random()*Math.PI*2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        const pulse=.82+.18*Math.sin(t*.016+p.ph);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*pulse})`; ctx.fill();
      });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<.08){ctx.beginPath();ctx.moveTo(pts[i].x*W,pts[i].y*H);ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle=`rgba(255,255,255,${.05*(1-d/.08)})`;ctx.lineWidth=.4;ctx.stroke();}
      }
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
}

/* ═══════════════════════════════════
   COMPANY LOGO (unchanged logic)
═══════════════════════════════════ */
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

function CompanyLogo({ name, color, size=42 }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const key = name?.toLowerCase().trim();
  const domain = KNOWN_DOMAINS[key] || `${key?.replace(/\s+/g,"")}.com`;
  const srcs = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];
  const show = srcIdx < srcs.length;
  return (
    <div style={{width:size,height:size,borderRadius:10,background:`${color}10`,
      border:`1px solid ${color}25`,overflow:"hidden",display:"flex",
      alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {show
        ? <img src={srcs[srcIdx]} alt={name} onError={()=>setSrcIdx(i=>i+1)}
            style={{width:size-12,height:size-12,objectFit:"contain"}}/>
        : <span style={{color,fontSize:Math.round(size*.4),fontWeight:900,
            fontFamily:"'Playfair Display',serif"}}>{name?.[0]?.toUpperCase()}</span>
      }
    </div>
  );
}

/* ═══════════════════════════════════
   BADGES
═══════════════════════════════════ */
function DiffBadge({ diff }) {
  const map = {
    Easy:   [T.green,  `${T.green}12`,  `${T.green}30`],
    Medium: [T.yellow, `${T.yellow}12`, `${T.yellow}30`],
    Hard:   [T.red,    `${T.red}12`,    `${T.red}30`],
  };
  const [color,bg,border] = map[diff] || [T.muted,T.surface,T.border];
  return (
    <span style={{background:bg,color,border:`1px solid ${border}`,borderRadius:5,
      padding:"2px 8px",fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.06em"}}>
      {diff}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    "All":       [T.accent,  `${T.accent}12`],
    "Quant":     [T.blue,    `${T.blue}12`],
    "Logical":   [T.purple,  `${T.purple}12`],
    "Verbal":    [T.green,   `${T.green}12`],
    "Coding MCQ":[T.yellow,  `${T.yellow}12`],
  };
  const [color,bg] = map[type] || [T.muted,T.surface];
  return (
    <span style={{background:bg,color,border:`1px solid ${color}25`,borderRadius:5,
      padding:"2px 9px",fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.05em"}}>
      {type}
    </span>
  );
}

/* ═══════════════════════════════════
   TIER COLOURS → HIREON palette
═══════════════════════════════════ */
const TIER_COLORS = {
  "FAANG":          { color:T.yellow, bg:`${T.yellow}0c`, border:`${T.yellow}30` },
  "Tier 1":         { color:T.blue,   bg:`${T.blue}0c`,   border:`${T.blue}30`   },
  "Finance":        { color:T.green,  bg:`${T.green}0c`,  border:`${T.green}30`  },
  "Indian Product": { color:"#fb923c",bg:"rgba(251,146,60,0.08)",border:"rgba(251,146,60,0.25)" },
  "MNC":            { color:T.purple, bg:`${T.purple}0c`, border:`${T.purple}30` },
};

/* ═══════════════════════════════════
   SHARED TOPBAR
═══════════════════════════════════ */
function Topbar({ stats }) {
  const navigate = useNavigate();
  return (
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 32px",height:56,background:"rgba(8,8,8,0.92)",
      backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,
      position:"sticky",top:0,zIndex:200,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>navigate("/Candidate/06_MainCand")}
          style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,
            padding:"6px 14px",color:T.muted,fontSize:"0.78rem",fontWeight:600,
            cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
          onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
          ← Dashboard
        </button>
        <span style={{color:T.border2,fontSize:"0.7rem"}}>/</span>
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,
          fontSize:"0.85rem",color:T.white}}>DSA + Aptitude</span>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:20}}>
        {stats && (
          <div style={{display:"flex",gap:20}}>
            {stats.map(({val,label,color})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",color,
                  fontSize:"0.9rem",fontWeight:900,lineHeight:1}}>{val}</div>
                <div style={{color:T.muted,fontSize:"0.58rem",textTransform:"uppercase",
                  letterSpacing:"0.08em",marginTop:2}}>{label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:6,
          fontFamily:"'Playfair Display',serif",fontWeight:900,
          fontSize:"0.95rem",color:T.white,letterSpacing:"0.05em"}}>
          <div style={{width:24,height:24,borderRadius:5,background:T.white,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#080808" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════
   COMPANY CARD
═══════════════════════════════════ */
function CompanyCard({ companyKey, dsaData, aptData, onSelect }) {
  const [hov, setHov] = useState(false);
  const color   = dsaData?.color || aptData?.color || T.blue;
  const name    = dsaData?.company || aptData?.name || companyKey;
  const hasDSA  = !!dsaData;
  const hasApt  = !!aptData;
  const dsaCount= dsaData?.problems?.length || 0;
  const aptCount= aptData?.questions?.length || 0;

  return (
    <div className="cardIn"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>onSelect(companyKey)}
      style={{background:hov?`${color}06`:T.surface,
        border:`1px solid ${hov?color+"35":T.border}`,borderRadius:14,
        padding:"18px 20px",cursor:"pointer",transition:"all 0.28s cubic-bezier(0.16,1,0.3,1)",
        transform:hov?"translateY(-3px)":"translateY(0)",
        boxShadow:hov?`0 12px 36px rgba(0,0,0,0.35),0 0 0 1px ${color}18`:"none",
        position:"relative",overflow:"hidden"}}>

      {/* accent bar */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color}50,transparent)`,
        opacity:hov?1:0,transition:"opacity 0.3s"}}/>

      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <CompanyLogo name={name.toLowerCase()} color={color} size={42}/>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",color:T.white,
            fontSize:"0.85rem",fontWeight:700,marginBottom:4}}>{name}</div>
          {Object.entries(COMPANY_TIERS||{}).map(([tier,keys])=>
            keys?.includes(companyKey) ? (
              <span key={tier} style={{background:TIER_COLORS[tier]?.bg,
                color:TIER_COLORS[tier]?.color,border:`1px solid ${TIER_COLORS[tier]?.border}`,
                borderRadius:5,padding:"1px 7px",fontSize:"0.6rem",fontWeight:700,
                letterSpacing:"0.06em"}}>{tier}</span>
            ):null
          )}
        </div>
      </div>

      <div style={{display:"flex",gap:8}}>
        {hasDSA && (
          <div style={{flex:1,background:`${T.blue}0c`,border:`1px solid ${T.blue}20`,
            borderRadius:8,padding:"7px 10px",textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",color:T.blue,
              fontSize:"0.95rem",fontWeight:900}}>{dsaCount}</div>
            <div style={{color:T.muted,fontSize:"0.58rem",fontWeight:600,
              textTransform:"uppercase",letterSpacing:"0.08em"}}>DSA</div>
          </div>
        )}
        {hasApt && (
          <div style={{flex:1,background:`${T.green}0c`,border:`1px solid ${T.green}20`,
            borderRadius:8,padding:"7px 10px",textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",color:T.green,
              fontSize:"0.95rem",fontWeight:900}}>{aptCount}</div>
            <div style={{color:T.muted,fontSize:"0.58rem",fontWeight:600,
              textTransform:"uppercase",letterSpacing:"0.08em"}}>Aptitude</div>
          </div>
        )}
      </div>

      {!hasDSA && !hasApt && (
        <div style={{color:T.muted,fontSize:"0.72rem",textAlign:"center",padding:"6px 0"}}>
          Coming soon
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   DSA PANEL
═══════════════════════════════════ */
function DSAPanel({ data, color }) {
  const [topicFilter, setTopicFilter] = useState("All");
  const [diffFilter,  setDiffFilter]  = useState("All");
  const [solved, setSolved] = useState({});

  if (!data) return (
    <div style={{color:T.muted,padding:40,textAlign:"center",fontSize:"0.83rem"}}>
      No DSA data for this company yet.
    </div>
  );

  const topics   = ["All",...new Set(data.problems.map(p=>p.topic))];
  const diffs    = ["All","Easy","Medium","Hard"];
  const filtered = data.problems.filter(p=>{
    if (topicFilter!=="All" && p.topic!==topicFilter) return false;
    if (diffFilter !=="All" && p.difficulty!==diffFilter) return false;
    return true;
  });

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const total = data.problems.length;
  const pct   = Math.round((solvedCount/total)*100);

  return (
    <div>
      {/* Progress bar */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,
        borderRadius:10,padding:"12px 16px",marginBottom:16,
        display:"flex",alignItems:"center",gap:16}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{color:T.muted,fontSize:"0.75rem",fontWeight:600}}>Progress</span>
            <span style={{color:T.white,fontSize:"0.75rem",fontWeight:700}}>
              {solvedCount}/{total} solved
            </span>
          </div>
          <div style={{background:T.border,borderRadius:99,height:5}}>
            <div style={{width:`${pct}%`,height:"100%",
              background:`linear-gradient(90deg,${color},${color}aa)`,
              borderRadius:99,transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)",
              boxShadow:`0 0 6px ${color}50`}}/>
          </div>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",color,
          fontSize:"1.1rem",fontWeight:900}}>{pct}%</div>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {topics.map(t=>(
            <button key={t} onClick={()=>setTopicFilter(t)}
              style={{background:topicFilter===t?`${color}15`:T.surface,
                color:topicFilter===t?color:T.muted,
                border:`1px solid ${topicFilter===t?color+"35":T.border}`,
                borderRadius:7,padding:"4px 11px",fontSize:"0.68rem",fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
              {t}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:5}}>
          {diffs.map(d=>(
            <button key={d} onClick={()=>setDiffFilter(d)}
              style={{background:diffFilter===d?T.card:"transparent",
                color:diffFilter===d?T.white:T.muted,
                border:`1px solid ${diffFilter===d?T.border2:T.border}`,
                borderRadius:7,padding:"4px 11px",fontSize:"0.68rem",fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{background:`${T.yellow}08`,border:`1px solid ${T.yellow}25`,
        borderRadius:8,padding:"8px 12px",marginBottom:12,
        display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:"0.8rem"}}>⚠️</span>
        <span style={{color:T.muted,fontSize:"0.72rem",lineHeight:1.5}}>
          Based on community reports & Glassdoor reviews. Questions may vary by role and interviewer.
        </span>
      </div>

      {/* Problems list */}
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {filtered.map((p,i)=>(
          <div key={p.id} className="cardIn"
            style={{animationDelay:`${i*0.025}s`,
              background:solved[p.id]?`${T.green}05`:T.surface,
              border:`1px solid ${solved[p.id]?T.green+"22":T.border}`,
              borderRadius:10,padding:"10px 14px",
              display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>

            {/* Checkbox */}
            <div onClick={()=>setSolved(s=>({...s,[p.id]:!s[p.id]}))}
              style={{width:17,height:17,borderRadius:4,
                border:`2px solid ${solved[p.id]?T.green:T.border2}`,
                background:solved[p.id]?T.green:"transparent",cursor:"pointer",
                flexShrink:0,display:"flex",alignItems:"center",
                justifyContent:"center",transition:"all 0.2s"}}>
              {solved[p.id] && <span style={{color:"#080808",fontSize:"0.6rem",fontWeight:900}}>✓</span>}
            </div>

            {/* Title */}
            <div style={{flex:1,minWidth:0}}>
              <span style={{color:solved[p.id]?T.muted:T.muted2,fontSize:"0.8rem",
                fontWeight:500,textDecoration:solved[p.id]?"line-through":"none",
                transition:"all 0.2s"}}>
                {p.title}
              </span>
            </div>

            {/* Topic pill */}
            <span style={{color:T.muted,fontSize:"0.62rem",background:T.surface,
              border:`1px solid ${T.border}`,borderRadius:4,padding:"1px 7px",
              flexShrink:0,display:window.innerWidth<700?"none":"block"}}>
              {p.topic}
            </span>

            {/* Frequency bar */}
            <div style={{width:56,flexShrink:0,display:window.innerWidth<700?"none":"block"}}>
              <div style={{background:T.border,borderRadius:99,height:3}}>
                <div style={{width:`${p.frequency||0}%`,height:"100%",
                  background:`linear-gradient(90deg,${color},${color}80)`,borderRadius:99}}/>
              </div>
              <div style={{color:T.muted,fontSize:"0.58rem",textAlign:"center",marginTop:2}}>
                {p.frequency}%
              </div>
            </div>

            <DiffBadge diff={p.difficulty}/>

            <a href={p.leetcode} target="_blank" rel="noopener noreferrer"
              style={{color:T.blue,fontSize:"0.72rem",fontWeight:700,
                textDecoration:"none",flexShrink:0,letterSpacing:"0.04em"}}
              onMouseEnter={e=>e.currentTarget.style.color=T.white}
              onMouseLeave={e=>e.currentTarget.style.color=T.blue}>
              Solve →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   APTITUDE PANEL
═══════════════════════════════════ */
function AptitudePanel({ data, color }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [mode,       setMode]       = useState("start");
  const [quizIndex,  setQuizIndex]  = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [score,      setScore]      = useState(0);
  const [done,       setDone]       = useState(false);
  const [answers,    setAnswers]    = useState({});

  if (!data) return (
    <div style={{color:T.muted,padding:40,textAlign:"center",fontSize:"0.83rem"}}>
      No aptitude data for this company yet.
    </div>
  );

  const filtered = data.questions.filter(q=>typeFilter==="All"||q.type===typeFilter);
  const resetQuiz = () => { setQuizIndex(0);setSelected(null);setRevealed(false);setScore(0);setDone(false);setAnswers({}); };

  /* ── START SCREEN ── shown first when company is clicked ── */
  if (mode === "start") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"52px 24px",gap:20,textAlign:"center"}}>
      <div style={{fontSize:"2.8rem"}}>📝</div>
      <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.4rem",fontWeight:900,margin:0}}>
        Aptitude Quiz
      </h3>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.83rem",margin:0,lineHeight:1.7,maxWidth:320}}>
        {filtered.length} questions available.{" "}
        Take the quiz to test yourself, or browse questions with answers.
      </p>
      <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap",justifyContent:"center"}}>
        <button
          onClick={()=>{ resetQuiz(); setMode("quiz"); }}
          style={{background:"#fff",color:"#080808",border:"none",borderRadius:9,
            padding:"11px 28px",fontSize:"0.83rem",fontWeight:800,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",
            transition:"all 0.2s",boxShadow:"0 4px 20px rgba(255,255,255,0.15)"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 24px rgba(255,255,255,0.2)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(255,255,255,0.15)";}}>
          Start Quiz →
        </button>
        <button
          onClick={()=>setMode("browse")}
          style={{background:"transparent",color:"rgba(255,255,255,0.55)",
            border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,
            padding:"11px 24px",fontSize:"0.83rem",fontWeight:600,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";}}>
          Browse Questions
        </button>
      </div>
    </div>
  );

  /* ── BROWSE MODE ── */
  if (mode === "browse") return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {APT_TYPES.map(t=>(
            <button key={t} onClick={()=>setTypeFilter(t)}
              style={{background:typeFilter===t?`${color}15`:T.surface,
                color:typeFilter===t?color:T.muted,
                border:`1px solid ${typeFilter===t?color+"35":T.border}`,
                borderRadius:7,padding:"4px 11px",fontSize:"0.68rem",fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
              {t}{t!=="All"&&<span style={{opacity:0.55}}> ({data.questions.filter(q=>q.type===t).length})</span>}
            </button>
          ))}
        </div>
        <button onClick={()=>{ resetQuiz(); setMode("quiz"); }}
          style={{background:T.white,color:"#080808",border:"none",borderRadius:8,
            padding:"7px 20px",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
            textTransform:"uppercase",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(255,255,255,0.12)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
          Start Quiz →
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{background:`${T.yellow}08`,border:`1px solid ${T.yellow}25`,
        borderRadius:8,padding:"8px 12px",marginBottom:12,
        display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:"0.8rem"}}>⚠️</span>
        <span style={{color:T.muted,fontSize:"0.72rem"}}>
          Based on previous year placement papers & community reports. Actual exam may vary.
        </span>
      </div>

      {/* Questions browse list */}
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {filtered.map((q,i)=>(
          <div key={q.id} className="cardIn"
            style={{animationDelay:`${i*0.03}s`,background:T.surface,
              border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 16px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:9}}>
              <span style={{color:T.muted,fontSize:"0.68rem",fontWeight:700,minWidth:22}}>Q{i+1}.</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6,flexWrap:"wrap"}}>
                  <TypeBadge type={q.type}/>
                </div>
                <p style={{color:T.muted2,fontSize:"0.8rem",margin:0,lineHeight:1.75}}>{q.q}</p>
              </div>
            </div>
            {/* Options grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginLeft:30}}>
              {q.options.map((opt,oi)=>(
                <div key={oi}
                  style={{background:oi===q.answer?`${T.green}08`:T.surface,
                    border:`1px solid ${oi===q.answer?T.green+"28":T.border}`,
                    borderRadius:7,padding:"6px 11px",
                    color:oi===q.answer?T.green:T.muted,
                    fontSize:"0.75rem",display:"flex",alignItems:"center",gap:7}}>
                  <span style={{color:oi===q.answer?T.green:T.muted,fontWeight:700,
                    fontSize:"0.65rem"}}>{["A","B","C","D"][oi]}.</span>
                  {opt}
                  {oi===q.answer&&<span style={{marginLeft:"auto",fontSize:"0.75rem"}}>✓</span>}
                </div>
              ))}
            </div>
            {/* Explanation */}
            <div style={{marginLeft:30,marginTop:8,background:`${T.blue}06`,
              border:`1px solid ${T.blue}18`,borderRadius:7,padding:"6px 11px"}}>
              <span style={{color:T.muted,fontSize:"0.62rem",fontWeight:700,
                textTransform:"uppercase",letterSpacing:"0.08em"}}>Explanation: </span>
              <span style={{color:T.muted2,fontSize:"0.73rem"}}>{q.explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── QUIZ DONE ── */
  if (done) {
    const pct = Math.round((score/filtered.length)*100);
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        padding:"44px 24px",gap:18,textAlign:"center"}}>
        <div style={{fontSize:"3rem"}}>{pct>=70?"🏆":pct>=50?"👍":"💪"}</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",color:T.white,
          fontSize:"1.5rem",fontWeight:900}}>Quiz Complete!</h3>
        <div style={{fontFamily:"'Playfair Display',serif",color,
          fontSize:"2.2rem",fontWeight:900}}>{score}/{filtered.length}</div>
        <div style={{background:T.border,borderRadius:99,height:8,width:"100%",maxWidth:280}}>
          <div style={{width:`${pct}%`,height:"100%",
            background:`linear-gradient(90deg,${color},${color}aa)`,
            borderRadius:99,transition:"width 1s cubic-bezier(0.16,1,0.3,1)"}}/>
        </div>
        <div style={{color:T.muted2,fontSize:"0.83rem"}}>
          {pct>=70?"Excellent! You're well prepared":"Keep practising — you'll nail it!"}
        </div>
        <div style={{display:"flex",gap:10,marginTop:6}}>
          <button onClick={resetQuiz}
            style={{background:T.white,color:"#080808",border:"none",borderRadius:9,
              padding:"9px 22px",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",
              transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(255,255,255,0.12)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            Retry Quiz
          </button>
          <button onClick={()=>{ resetQuiz(); setMode("start"); }}
            style={{background:"transparent",color:T.muted2,border:`1px solid ${T.border2}`,
              borderRadius:9,padding:"9px 22px",fontSize:"0.78rem",fontWeight:600,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.white;}}
            onMouseLeave={e=>{e.currentTarget.style.color=T.muted2;e.currentTarget.style.borderColor=T.border2;}}>
            Browse Mode
          </button>
        </div>
      </div>
    );
  }

  /* ── QUIZ MODE ── */
  const q = filtered[quizIndex];
  const isLast = quizIndex === filtered.length - 1;
  const handleNext = () => {
    if (!isLast) { setQuizIndex(i=>i+1); setSelected(null); setRevealed(false); }
    else setDone(true);
  };

  return (
    <div>
      {/* Quiz header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:T.muted,fontSize:"0.78rem"}}>
            Question {quizIndex+1} of {filtered.length}
          </span>
          <TypeBadge type={q.type}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"'Playfair Display',serif",color:T.green,
            fontSize:"0.85rem",fontWeight:900}}>Score: {score}</span>
          <button onClick={()=>{ resetQuiz(); setMode("start"); }}
            style={{background:"transparent",color:T.muted,border:`1px solid ${T.border}`,
              borderRadius:7,padding:"4px 11px",fontSize:"0.68rem",
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.color=T.red;e.currentTarget.style.borderColor=T.red+"50";}}
            onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{background:T.border,borderRadius:99,height:4,marginBottom:22}}>
        <div style={{width:`${(quizIndex/filtered.length)*100}%`,height:"100%",
          background:`linear-gradient(90deg,${color},${color}aa)`,
          borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>

      {/* Question */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,
        borderRadius:12,padding:"20px 22px",marginBottom:16}}>
        <p style={{color:T.white,fontSize:"0.88rem",lineHeight:1.8,margin:0,fontWeight:500}}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
        {q.options.map((opt,oi)=>{
          const isCorrect  = oi===q.answer;
          const isSelected = oi===selected;
          let bg=T.surface, border=T.border, textColor=T.muted2;
          if (revealed) {
            if (isCorrect)           { bg=`${T.green}10`; border=`${T.green}35`; textColor=T.green; }
            else if (isSelected)     { bg=`${T.red}08`;   border=`${T.red}30`;   textColor=T.red; }
          } else if (isSelected) {
            bg=`${color}12`; border=`${color}35`; textColor=color;
          }
          return (
            <div key={oi} onClick={()=>{ if(!revealed) setSelected(oi); }}
              style={{background:bg,border:`1px solid ${border}`,borderRadius:10,
                padding:"12px 16px",color:textColor,fontSize:"0.8rem",
                fontWeight:isSelected||isCorrect?700:500,
                cursor:revealed?"default":"pointer",
                display:"flex",alignItems:"center",gap:11,transition:"all 0.22s"}}>
              <span style={{width:22,height:22,borderRadius:6,border:"1.5px solid currentColor",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"0.65rem",fontWeight:800,flexShrink:0}}>
                {["A","B","C","D"][oi]}
              </span>
              {opt}
              {revealed&&isCorrect&&<span style={{marginLeft:"auto"}}>✅</span>}
              {revealed&&isSelected&&!isCorrect&&<span style={{marginLeft:"auto"}}>❌</span>}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <button onClick={()=>{ setRevealed(true); if(selected===q.answer) setScore(s=>s+1); }}
          disabled={selected===null}
          style={{background:selected!==null?T.white:`rgba(255,255,255,0.06)`,
            color:selected!==null?"#080808":T.muted,border:"none",borderRadius:10,
            padding:"12px 32px",fontSize:"0.8rem",fontWeight:700,
            cursor:selected!==null?"pointer":"default",
            fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
            textTransform:"uppercase",transition:"all 0.25s",width:"100%"}}>
          Check Answer
        </button>
      ) : (
        <div>
          <div style={{background:`${T.blue}07`,border:`1px solid ${T.blue}20`,
            borderRadius:10,padding:"11px 14px",marginBottom:10}}>
            <span style={{color:T.blue,fontSize:"0.65rem",fontWeight:700,
              textTransform:"uppercase",letterSpacing:"0.1em"}}>💡 Explanation: </span>
            <span style={{color:T.muted2,fontSize:"0.78rem"}}>{q.explanation}</span>
          </div>
          <button onClick={handleNext}
            style={{background:T.white,color:"#080808",border:"none",borderRadius:10,
              padding:"12px 32px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase",transition:"all 0.25s",width:"100%"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 24px rgba(255,255,255,0.14)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            {isLast ? "Finish Quiz 🏁" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   COMPANY DETAIL
═══════════════════════════════════ */
function CompanyDetail({ companyKey, onBack }) {
  const [tab, setTab] = useState("dsa");
  const dsaData = DSA_DB?.[companyKey];
  const aptData = APTITUDE_DB?.[companyKey];
  const name  = dsaData?.company || aptData?.name || companyKey;
  const color = dsaData?.color   || aptData?.color || T.blue;

  return (
    <div className="fade">
      {/* Back + company header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22,flexWrap:"wrap"}}>
        <button onClick={onBack}
          style={{background:"transparent",color:T.muted,border:`1px solid ${T.border}`,
            padding:"7px 14px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",
            fontSize:"0.78rem",fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
          onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
          ← All Companies
        </button>
        <CompanyLogo name={name.toLowerCase()} color={color} size={40}/>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",color:T.white,
            fontSize:"1.2rem",fontWeight:900}}>{name}</div>
          <div style={{color:T.muted,fontSize:"0.72rem",marginTop:2}}>
            {dsaData?.problems?.length||0} DSA problems · {aptData?.questions?.length||0} Aptitude questions
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{display:"flex",background:T.surface,border:`1px solid ${T.border}`,
        borderRadius:10,padding:3,marginBottom:20,width:"fit-content",gap:3}}>
        {[
          {key:"dsa",      label:"📘 DSA Sheet",         has:!!dsaData},
          {key:"aptitude", label:"🧠 Aptitude Questions", has:!!aptData},
        ].map(({key,label,has})=>(
          <button key={key} onClick={()=>{ if(has) setTab(key); }}
            style={{background:tab===key?T.card:"transparent",
              color:tab===key?T.white:has?T.muted:T.muted,
              border:`1px solid ${tab===key?T.border2:"transparent"}`,
              borderRadius:8,padding:"8px 20px",fontSize:"0.78rem",fontWeight:600,
              cursor:has?"pointer":"default",fontFamily:"'DM Sans',sans-serif",
              letterSpacing:"0.03em",transition:"all 0.22s",opacity:has?1:0.4}}>
            {label}
            {!has&&<span style={{fontSize:"0.6rem",marginLeft:5,opacity:0.5}}>(soon)</span>}
          </button>
        ))}
      </div>

      {/* Panel content */}
      {tab==="dsa"      && <DSAPanel      data={dsaData} color={color}/>}
      {tab==="aptitude" && <AptitudePanel data={aptData} color={color}/>}
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════ */
export const DSAAptitude = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [search,          setSearch]          = useState("");
  const [tierFilter,      setTierFilter]      = useState("All");
  const canvasRef = useRef();
  useParticles(canvasRef);

  const dsaKeys  = Object.keys(DSA_DB || {});
  const aptKeys  = Object.keys(APTITUDE_DB || {});
  const allKeys  = [...new Set([...dsaKeys,...aptKeys])];

  const displayed = allKeys.filter(key=>{
    const name = DSA_DB?.[key]?.company || APTITUDE_DB?.[key]?.name || key;
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tierFilter !== "All") {
      const inTier = Object.entries(COMPANY_TIERS||{}).some(([tier,keys])=>tier===tierFilter&&keys?.includes(key));
      if (!inTier) return false;
    }
    return true;
  });

  const totalDSA = dsaKeys.reduce((s,k)=>s+(DSA_DB[k]?.problems?.length||0),0);
  const totalApt = aptKeys.reduce((s,k)=>s+(APTITUDE_DB[k]?.questions?.length||0),0);

  return (
    <>
      <GlobalStyle/>
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",
        position:"relative"}}>
        <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}/>

        <Topbar stats={[
          {val:`${totalDSA}+`,  label:"DSA Problems",   color:T.blue},
          {val:`${totalApt}+`,  label:"Apt Questions",  color:T.green},
          {val:allKeys.length,  label:"Companies",      color:T.yellow},
        ]}/>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px",
          position:"relative",zIndex:1}}>

          {selectedCompany ? (
            <CompanyDetail companyKey={selectedCompany} onBack={()=>setSelectedCompany(null)}/>
          ) : (
            <>
              {/* Hero */}
              <div style={{textAlign:"center",marginBottom:40}} className="fade">
                <div style={{display:"inline-flex",alignItems:"center",gap:8,
                  background:`${T.green}08`,color:T.green,border:`1px solid ${T.green}22`,
                  padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
                  letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
                    boxShadow:`0 0 6px ${T.green}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
                  Company-wise Preparation
                </div>
                <h1 style={{fontFamily:"'Playfair Display',serif",
                  fontSize:"clamp(1.8rem,4vw,3.4rem)",fontWeight:900,
                  color:T.white,margin:"0 0 6px",lineHeight:1.05,letterSpacing:"-0.02em"}}>
                  DSA <span style={{color:T.blue}}>+</span> Aptitude
                </h1>
                <h2 style={{fontFamily:"'Playfair Display',serif",
                  fontSize:"clamp(1.1rem,2.5vw,1.8rem)",fontWeight:700,fontStyle:"italic",
                  color:T.accent,margin:"0 0 16px"}}>
                  Know What They Ask.
                </h2>
                <p style={{color:T.muted,fontSize:"0.83rem",maxWidth:480,margin:"0 auto"}}>
                  Curated DSA problems and previous year aptitude questions for top companies.
                </p>
              </div>

              {/* Search + Tier filters */}
              <div style={{display:"flex",gap:12,marginBottom:24,
                flexWrap:"wrap",alignItems:"center"}}>
                <input placeholder="Search companies..."
                  value={search} onChange={e=>setSearch(e.target.value)}
                  style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,
                    padding:"9px 16px",color:T.white,fontFamily:"'DM Sans',sans-serif",
                    fontSize:"0.8rem",width:220,transition:"border-color 0.2s"}}
                  onFocus={e=>e.currentTarget.style.borderColor=T.border2}
                  onBlur={e=>e.currentTarget.style.borderColor=T.border}/>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["All",...Object.keys(TIER_COLORS)].map(tier=>(
                    <button key={tier} onClick={()=>setTierFilter(tier)}
                      style={{background:tierFilter===tier?(TIER_COLORS[tier]?.bg||T.card):T.surface,
                        color:tierFilter===tier?(TIER_COLORS[tier]?.color||T.white):T.muted,
                        border:`1px solid ${tierFilter===tier?(TIER_COLORS[tier]?.border||T.border2):T.border}`,
                        borderRadius:8,padding:"6px 14px",fontSize:"0.72rem",fontWeight:600,
                        cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                        letterSpacing:"0.04em",transition:"all 0.22s"}}>
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company grid */}
              <div style={{display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
                {displayed.map(key=>(
                  <CompanyCard key={key} companyKey={key}
                    dsaData={DSA_DB?.[key]} aptData={APTITUDE_DB?.[key]}
                    onSelect={setSelectedCompany}/>
                ))}
              </div>

              {displayed.length===0 && (
                <div style={{textAlign:"center",padding:"56px 0",
                  color:T.muted,fontSize:"0.83rem"}}>
                  No companies match your search.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};