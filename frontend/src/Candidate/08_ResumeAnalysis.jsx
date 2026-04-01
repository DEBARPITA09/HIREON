import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #080808; }
    textarea { font-family: 'DM Sans', sans-serif; }
    textarea::placeholder { color: rgba(255,255,255,0.18); }
    textarea:focus { outline: none; border-color: rgba(255,255,255,0.28) !important; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;} }
    @keyframes bob     { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
    @keyframes slide   { 0%{margin-left:-50%;}100%{margin-left:110%;} }
    @keyframes spin    { to{transform:rotate(360deg);} }
    .fade { animation: fadeUp 0.42s ease both; }
  `}</style>
);

/* ═══════════════════════════════════
   DOMAINS — same list, HIREON colours
═══════════════════════════════════ */
const DOMAINS = [
  { id:"webdev",     label:"Web Development",        color:T.blue,   sub:"React, Node, HTML/CSS, JavaScript" },
  { id:"backend",    label:"Backend Development",     color:T.purple, sub:"Spring Boot, Django, APIs, Databases" },
  { id:"ai_ml",      label:"AI / Machine Learning",   color:T.green,  sub:"Python, TensorFlow, PyTorch, NLP" },
  { id:"datascience",label:"Data Science",            color:T.yellow, sub:"Pandas, SQL, Visualization, Stats" },
  { id:"devops",     label:"DevOps & Cloud",          color:T.blue,   sub:"Docker, AWS, CI/CD, Linux" },
  { id:"android",    label:"Android Development",     color:T.green,  sub:"Kotlin, Java, Firebase, XML" },
  { id:"cybersec",   label:"Cybersecurity",           color:T.red,    sub:"Networking, Ethical Hacking, OWASP" },
  { id:"dsa",        label:"Competitive Programming", color:T.yellow, sub:"DSA, LeetCode, Codeforces, CP" },
  { id:"iot",        label:"IoT & Embedded Systems",  color:T.purple, sub:"Arduino, Raspberry Pi, C/C++" },
  { id:"blockchain", label:"Blockchain",              color:T.green,  sub:"Solidity, Web3, Smart Contracts" },
  { id:"uiux",       label:"UI/UX Design",            color:T.accent, sub:"Figma, Prototyping, User Research" },
  { id:"fullstack",  label:"Full Stack Development",  color:T.blue,   sub:"MERN, MEAN, Spring + React" },
];

/* ═══════════════════════════════════
   GROQ API (unchanged logic)
═══════════════════════════════════ */
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
    headers: { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
    body: JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[{role:"user",content:prompt}], temperature:0.3, max_tokens:2048 }),
  });
  if (!response.ok) { const err = await response.json().catch(()=>({})); throw new Error(`Groq API error: ${err?.error?.message||response.status}`); }
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g,"").trim();
  try { return JSON.parse(clean); } catch { throw new Error("AI returned invalid response. Please try again."); }
};

/* ═══════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════ */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
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
   UTILS
═══════════════════════════════════ */
const strengthColor = s => s>=80?T.green : s>=60?T.blue : s>=40?T.yellow : T.red;

function CountUp({ target }) {
  const [v,setV] = useState(0);
  useEffect(() => {
    let cur=0; const step=target/80;
    const t=setInterval(()=>{cur+=step; if(cur>=target){setV(target);clearInterval(t);}else setV(Math.floor(cur));},16);
    return ()=>clearInterval(t);
  },[target]);
  return <>{v}</>;
}

function Ring({ score, size=148, stroke=10 }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, offset=circ-(score/100)*circ, color=strengthColor(score);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1.4s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,color,lineHeight:1}}>
          <CountUp target={score}/>
        </span>
        <span style={{fontSize:"0.65rem",color:T.muted,marginTop:3}}>/ 100</span>
      </div>
    </div>
  );
}

function Bar({ value, color }) {
  const [w,setW] = useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(value),300);return()=>clearTimeout(t);},[value]);
  return (
    <div style={{background:T.border,borderRadius:99,height:6,overflow:"hidden"}}>
      <div style={{width:`${w}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:99,transition:"width 1.2s ease"}}/>
    </div>
  );
}

/* ═══════════════════════════════════
   SHARED TOPBAR
═══════════════════════════════════ */
function Topbar({ right, breadcrumb="Resume Analysis" }) {
  const navigate = useNavigate();
  return (
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 32px",height:56,background:"rgba(8,8,8,0.92)",
      backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,
      position:"sticky",top:0,zIndex:200}}>
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
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"0.85rem",color:T.white}}>
          {breadcrumb}
        </span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {right}
        <div style={{display:"flex",alignItems:"center",gap:6,
          fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"0.95rem",
          color:T.white,letterSpacing:"0.05em"}}>
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

/* shared section card */
const SectionCard = ({ title, accent=T.green, children }) => (
  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
    padding:24,marginBottom:16,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,${accent},transparent)`}}/>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,
      paddingBottom:12,borderBottom:`1px solid ${T.border}`}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"0.75rem",fontWeight:900,
        textTransform:"uppercase",letterSpacing:"0.15em",color:T.white,margin:0}}>{title}</h3>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════
   LANDING SCREEN
═══════════════════════════════════ */
function LandingScreen({ onNext }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",
      fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>
      <Topbar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"80px 24px",textAlign:"center",position:"relative",zIndex:1}}>

        <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:8,
          background:`${T.green}08`,color:T.green,border:`1px solid ${T.green}22`,
          padding:"5px 16px",borderRadius:20,fontSize:"0.68rem",fontWeight:600,
          letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:32}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.green,
            boxShadow:`0 0 8px ${T.green}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
          AI Powered · Instant Results · 100% Free
        </div>

        <h1 className="fade" style={{fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)",fontWeight:900,lineHeight:1.05,
          color:T.white,margin:"0 0 10px",animationDelay:"0.08s"}}>
          Analyse Your Resume.
        </h1>
        <h1 className="fade" style={{fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)",fontWeight:900,lineHeight:1.05,
          fontStyle:"italic",color:T.accent,margin:"0 0 28px",animationDelay:"0.16s"}}>
          Know Your Strengths.
        </h1>

        <p className="fade" style={{fontSize:"0.88rem",color:T.muted,maxWidth:400,
          lineHeight:1.85,margin:"0 0 52px",animationDelay:"0.24s"}}>
          Paste your resume, choose your target domain, and get a detailed AI-powered
          strength report with actionable feedback — in seconds.
        </p>

        <div className="fade" style={{display:"flex",background:T.surface,
          border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",
          marginBottom:52,animationDelay:"0.3s"}}>
          {[{val:"Domain",label:"Specific"},{val:"Instant",label:"Feedback"},{val:"Free",label:"No Cost"}].map(({val,label},i,arr)=>(
            <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",
              padding:"16px 36px",gap:4,borderRight:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:900,color:T.white}}>{val}</span>
              <span style={{fontSize:"0.62rem",fontWeight:600,color:T.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</span>
            </div>
          ))}
        </div>

        <button className="fade" onClick={onNext}
          style={{background:T.white,color:"#080808",border:"none",borderRadius:10,
            padding:"14px 52px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em",
            textTransform:"uppercase",transition:"all 0.2s",animationDelay:"0.36s"}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
          Analyse My Resume →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   INPUT SCREEN
═══════════════════════════════════ */
function InputScreen({ onAnalyze }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  const [text,    setText]   = useState("");
  const [domain,  setDomain] = useState(null);
  const [errMsg,  setErrMsg] = useState("");
  const [loading, setLoading]= useState(false);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canStart  = text.trim().length > 100 && domain && !loading;

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true); setErrMsg("");
    try {
      const result = await callGroq(text.trim(), domain.label);
      onAnalyze(result, domain);
    } catch(e) {
      setErrMsg(e.message);
      setLoading(false);
    }
  };

  const stepDone  = i => (i===0 && text.length>100) || (i===1 && !!domain);
  const stepActive= i => (i===0 && text.length<=100) || (i===1 && text.length>100 && !domain) || (i===2 && canStart);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",
      paddingBottom:60,position:"relative"}}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}>
        <Topbar/>
        <div style={{maxWidth:820,margin:"0 auto",padding:"40px 24px"}}>

          {/* Step indicator */}
          <div style={{textAlign:"center",marginBottom:40}} className="fade">
            <div style={{display:"inline-flex",alignItems:"center",gap:8,
              background:`${T.blue}10`,color:T.blue,border:`1px solid ${T.blue}28`,
              padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
              letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:28}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
                boxShadow:`0 0 6px ${T.green}`,display:"inline-block"}}/>
              Resume Analysis
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              {["Paste Resume","Choose Domain","Start Analysis"].map((s,i)=>{
                const done=stepDone(i), active=stepActive(i);
                return (
                  <React.Fragment key={s}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <div style={{width:34,height:34,borderRadius:"50%",
                        background:done?T.green:active?T.blue:T.surface,
                        border:`2px solid ${done?T.green:active?T.blue:T.border}`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:done?"0.85rem":"0.75rem",fontWeight:700,
                        color:done||active?T.bg:T.muted,transition:"all 0.3s"}}>
                        {done?"✓":i+1}
                      </div>
                      <span style={{fontSize:"0.65rem",color:done?T.green:active?T.blue:T.muted,
                        fontWeight:600,whiteSpace:"nowrap"}}>{s}</span>
                    </div>
                    {i<2 && <div style={{width:56,height:2,background:done?T.green:T.border,
                      margin:"0 8px",marginBottom:22,borderRadius:99,transition:"background 0.3s"}}/>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {errMsg && (
            <div style={{background:"rgba(248,113,113,0.08)",border:`1px solid ${T.red}35`,
              borderRadius:10,padding:"12px 18px",color:T.red,fontSize:"0.82rem",
              fontWeight:500,marginBottom:18}}>
              {errMsg}
            </div>
          )}

          {/* STEP 1 — Paste Resume */}
          <SectionCard title="Step 1 — Paste Your Resume Text" accent={T.blue}>
            <p style={{color:T.muted,fontSize:"0.78rem",marginBottom:14,lineHeight:1.7}}>
              Open your resume → Select All <kbd style={{background:T.surface,borderRadius:4,
              padding:"1px 6px",fontSize:"0.7rem",border:`1px solid ${T.border}`}}>Ctrl+A</kbd> → Copy&nbsp;
              <kbd style={{background:T.surface,borderRadius:4,padding:"1px 6px",fontSize:"0.7rem",
              border:`1px solid ${T.border}`}}>Ctrl+C</kbd> → Paste below
            </p>
            <div style={{position:"relative"}}>
              <textarea value={text} onChange={e=>setText(e.target.value)}
                placeholder={"Paste your entire resume text here...\n\nExample:\nJohn Doe\njohn@email.com | LinkedIn | GitHub\n\nEDUCATION\nB.Tech Computer Science — XYZ University\n\nSKILLS\nJava, Python, React, Node.js...\n\nEXPERIENCE\n..."}
                style={{width:"100%",minHeight:260,background:"rgba(255,255,255,0.02)",
                  border:`1px solid ${text.length>100?T.green+"55":T.border}`,
                  borderRadius:10,padding:16,color:T.white,fontSize:"0.82rem",
                  lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",resize:"vertical",
                  transition:"border-color 0.2s"}}/>
              <div style={{position:"absolute",bottom:12,right:14,
                background:"rgba(8,8,8,0.8)",borderRadius:7,padding:"2px 9px",
                fontSize:"0.68rem",color:wordCount>50?T.green:T.muted,fontWeight:600}}>
                {wordCount} words {wordCount>50?"✓":"(need more)"}
              </div>
            </div>
            <div style={{marginTop:12,background:`${T.yellow}08`,
              border:`1px solid ${T.yellow}25`,borderRadius:8,
              padding:"9px 13px",display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{color:T.yellow,fontSize:"0.65rem",fontWeight:700,
                textTransform:"uppercase",letterSpacing:"0.1em",flexShrink:0,marginTop:2}}>TIP</span>
              <p style={{color:"rgba(251,191,36,0.8)",fontSize:"0.75rem",margin:0,lineHeight:1.6}}>
                Open your resume PDF in browser → <strong>Ctrl+A</strong> → <strong>Ctrl+C</strong> → paste here with <strong>Ctrl+V</strong>
              </p>
            </div>
          </SectionCard>

          {/* STEP 2 — Choose Domain */}
          <SectionCard title="Step 2 — Choose Your Target Domain" accent={T.purple}>
            <p style={{color:T.muted,fontSize:"0.78rem",marginBottom:18,lineHeight:1.7}}>
              Select the field you are targeting or building your career in.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:9}}>
              {DOMAINS.map(d=>(
                <div key={d.id} onClick={()=>setDomain(d)}
                  style={{background:domain?.id===d.id?`${d.color}10`:T.surface,
                    border:`1px solid ${domain?.id===d.id?d.color:T.border}`,
                    borderRadius:10,padding:"13px 12px",cursor:"pointer",transition:"all 0.2s",
                    transform:domain?.id===d.id?"scale(1.02)":"scale(1)",
                    boxShadow:domain?.id===d.id?`0 4px 20px ${d.color}20`:"none",
                    position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{if(domain?.id!==d.id)e.currentTarget.style.borderColor=T.border2;}}
                  onMouseLeave={e=>{if(domain?.id!==d.id)e.currentTarget.style.borderColor=T.border;}}>
                  {domain?.id===d.id && <div style={{position:"absolute",top:0,left:0,right:0,
                    height:2,background:`linear-gradient(90deg,${d.color},transparent)`}}/>}
                  <div style={{color:domain?.id===d.id?d.color:T.muted2,fontWeight:600,
                    fontSize:"0.8rem",marginBottom:3}}>{d.label}</div>
                  <div style={{color:T.muted,fontSize:"0.68rem",lineHeight:1.5}}>{d.sub}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* CTA */}
          <div style={{textAlign:"center",marginTop:8}}>
            <button onClick={handleStart} disabled={!canStart}
              style={{background:canStart?T.white:`rgba(255,255,255,0.06)`,
                color:canStart?"#080808":T.muted,border:"none",borderRadius:10,
                padding:"14px 52px",fontSize:"0.82rem",fontWeight:700,
                cursor:canStart?"pointer":"not-allowed",
                fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em",
                textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseEnter={e=>{if(canStart){e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}}
              onMouseLeave={e=>{if(canStart){e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}}>
              {loading?"Analysing...":"Start Analysis →"}
            </button>
            {text.length<=100 && <p style={{color:T.muted,fontSize:"0.72rem",marginTop:10}}>Paste your resume text to continue</p>}
            {text.length>100 && !domain && <p style={{color:T.muted,fontSize:"0.72rem",marginTop:10}}>Choose a domain to continue</p>}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════ */
function LoadingScreen({ domain }) {
  const steps = ["Reading your resume...","Understanding your experience...","Comparing with domain requirements...","Generating your strength report..."];
  const [step,setStep] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setStep(s=>(s+1)%steps.length),1800);return()=>clearInterval(t);},[]);

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",
      fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <Topbar/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
        padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{background:T.surface,border:`1px solid ${domain.color}25`,
          borderRadius:14,padding:"48px 48px",textAlign:"center",maxWidth:420,
          width:"90%",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,
            background:`linear-gradient(90deg,${domain.color},transparent)`}}/>

          <div style={{fontSize:"2.8rem",marginBottom:20,display:"inline-block",
            animation:"bob 1.5s ease-in-out infinite"}}>⚙️</div>

          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${T.blue}10`,color:T.blue,border:`1px solid ${T.blue}28`,
            padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
            letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:20}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
              boxShadow:`0 0 6px ${T.green}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
            Analysing Your Resume
          </div>

          <h2 style={{fontFamily:"'Playfair Display',serif",color:T.white,
            fontSize:"1.4rem",fontWeight:900,marginBottom:8}}>Working on it...</h2>
          <p style={{color:domain.color,fontWeight:600,fontSize:"0.85rem",marginBottom:28}}>
            {domain.label}
          </p>

          <div style={{background:T.border,borderRadius:99,height:5,overflow:"hidden",marginBottom:18,position:"relative"}}>
            <div style={{height:"100%",width:"50%",background:`linear-gradient(90deg,${T.green},${T.blue})`,
              borderRadius:99,animation:"slide 1.8s ease-in-out infinite"}}/>
          </div>

          <p style={{color:T.muted,fontSize:"0.78rem",minHeight:22}}>{steps[step]}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════ */
function ResultScreen({ result, domain, onRetry }) {
  const navigate = useNavigate();
  const sc = strengthColor(result.overallStrength);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:60}}>
      <Topbar
        breadcrumb="Analysis Complete"
        right={
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:`${domain.color}10`,border:`1px solid ${domain.color}28`,
              borderRadius:20,padding:"3px 12px",color:domain.color,
              fontSize:"0.68rem",fontWeight:600}}>{domain.label}</div>
            <button onClick={onRetry}
              style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,
                padding:"6px 14px",color:T.muted,fontSize:"0.78rem",fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
              onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
              New Analysis
            </button>
          </div>
        }
      />

      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px"}}>

        {/* Heading */}
        <div style={{marginBottom:32,textAlign:"center"}} className="fade">
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${T.green}08`,color:T.green,border:`1px solid ${T.green}22`,
            padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
            letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
              boxShadow:`0 0 6px ${T.green}`,display:"inline-block"}}/>
            Analysis Complete
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.6rem,4vw,2.6rem)",fontWeight:900,color:T.white,
            margin:0,lineHeight:1.1}}>Your Resume Report.</h2>
        </div>

        {/* Score Hero */}
        <div style={{background:T.surface,border:`1px solid ${sc}22`,borderRadius:14,
          padding:"28px 28px",display:"flex",alignItems:"center",gap:32,
          flexWrap:"wrap",position:"relative",overflow:"hidden",marginBottom:16,
          boxShadow:`0 8px 40px ${sc}0c`}} className="fade">
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,
            background:`linear-gradient(90deg,${sc},transparent)`}}/>
          <Ring score={result.overallStrength}/>
          <div style={{flex:1,minWidth:220}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",color:T.white,
                fontSize:"1.4rem",fontWeight:900,margin:0,lineHeight:1.1}}>
                RESUME STRENGTH
              </h2>
              <span style={{background:`${sc}18`,color:sc,border:`1px solid ${sc}40`,
                borderRadius:7,padding:"3px 12px",fontSize:"0.7rem",fontWeight:700,
                letterSpacing:"0.06em",textTransform:"uppercase"}}>{result.strengthLabel}</span>
            </div>
            <p style={{color:T.muted2,fontSize:"0.83rem",lineHeight:1.75,margin:"0 0 14px"}}>
              {result.headline}
            </p>
            <div style={{background:`${domain.color}0c`,border:`1px solid ${domain.color}22`,
              borderRadius:8,padding:"8px 12px",display:"inline-flex",alignItems:"center",gap:6}}>
              <span style={{color:domain.color,fontSize:"0.72rem",fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.08em"}}>
                Analysed for: {domain.label}
              </span>
            </div>
          </div>
        </div>

        {/* Strong Areas */}
        <SectionCard title="Strong Areas" accent={T.green}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {result.strongAreas.map((s,i)=>(
              <div key={i} style={{background:`rgba(255,255,255,0.02)`,
                border:`1px solid ${T.green}18`,borderRadius:10,
                padding:"14px 16px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:10,left:-1,width:2,height:22,
                  background:`linear-gradient(180deg,${T.green},transparent)`,borderRadius:"0 2px 2px 0"}}/>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:8,gap:8,flexWrap:"wrap"}}>
                  <span style={{color:T.green,fontWeight:700,fontSize:"0.82rem"}}>{s.area}</span>
                  <span style={{fontFamily:"'Playfair Display',serif",color:T.green,fontWeight:900,fontSize:"0.9rem"}}>{s.score}%</span>
                </div>
                <Bar value={s.score} color={T.green}/>
                <p style={{color:T.muted2,fontSize:"0.78rem",margin:"8px 0 0",lineHeight:1.65}}>{s.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Weak Areas */}
        <SectionCard title="Areas to Improve" accent={T.red}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {result.weakAreas.map((w,i)=>(
              <div key={i} style={{background:`rgba(255,255,255,0.02)`,
                border:`1px solid ${T.red}18`,borderRadius:10,
                padding:"14px 16px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:10,left:-1,width:2,height:22,
                  background:`linear-gradient(180deg,${T.red},transparent)`,borderRadius:"0 2px 2px 0"}}/>
                <div style={{color:T.red,fontWeight:700,fontSize:"0.82rem",marginBottom:6}}>{w.area}</div>
                <p style={{color:T.muted2,fontSize:"0.78rem",margin:"0 0 10px",lineHeight:1.65}}>{w.detail}</p>
                <div style={{background:`${T.yellow}08`,border:`1px solid ${T.yellow}22`,
                  borderRadius:7,padding:"7px 11px",display:"flex",alignItems:"flex-start",gap:6}}>
                  <span style={{color:T.yellow,fontSize:"0.62rem",fontWeight:700,
                    textTransform:"uppercase",letterSpacing:"0.1em",flexShrink:0,marginTop:2}}>FIX</span>
                  <span style={{color:"rgba(251,191,36,0.82)",fontSize:"0.75rem",lineHeight:1.6}}>{w.gap}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Domain Skills Coverage */}
        <SectionCard title="Domain Skills Coverage" accent={domain.color}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:9,marginBottom:16}}>
            {result.domainSkillsCovered.map((sk,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                background:`rgba(255,255,255,0.02)`,
                border:`1px solid ${sk.present?domain.color+"30":T.border}`,
                borderRadius:9,padding:"9px 13px"}}>
                <div style={{width:7,height:7,borderRadius:"50%",
                  background:sk.present?domain.color:T.border,flexShrink:0}}/>
                <span style={{color:sk.present?domain.color:T.muted,fontSize:"0.78rem",
                  fontWeight:sk.present?600:400}}>{sk.skill}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,background:T.border,borderRadius:99,height:6,overflow:"hidden"}}>
              <div style={{width:`${(result.domainSkillsCovered.filter(s=>s.present).length/result.domainSkillsCovered.length)*100}%`,
                height:"100%",background:`linear-gradient(90deg,${domain.color},${domain.color}88)`,
                borderRadius:99,transition:"width 1.2s ease"}}/>
            </div>
            <span style={{color:domain.color,fontWeight:700,fontSize:"0.8rem",flexShrink:0}}>
              {result.domainSkillsCovered.filter(s=>s.present).length}/{result.domainSkillsCovered.length} skills
            </span>
          </div>
        </SectionCard>

        {/* Top Recommendations */}
        <SectionCard title="Top Recommendations" accent={T.blue}>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {result.topRecommendations.map((tip,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,
                padding:"11px 15px",background:`rgba(255,255,255,0.02)`,
                border:`1px solid ${T.border}`,borderRadius:9}}>
                <div style={{width:22,height:22,borderRadius:"50%",
                  background:`${T.blue}15`,border:`1px solid ${T.blue}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:T.blue,fontSize:"0.68rem",fontWeight:800,flexShrink:0}}>{i+1}</div>
                <p style={{color:T.muted2,fontSize:"0.78rem",margin:0,lineHeight:1.7}}>{tip}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Next Steps */}
        <SectionCard title="Your Next Steps" accent={domain.color}>
          <p style={{color:T.muted2,fontSize:"0.83rem",lineHeight:1.85,margin:0}}>{result.nextSteps}</p>
        </SectionCard>

        {/* CTAs */}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:8}}>
          <button onClick={onRetry}
            style={{background:T.white,color:"#080808",border:"none",borderRadius:10,
              padding:"14px 40px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
            Analyse Another Resume
          </button>
          <button onClick={()=>navigate("/Candidate/services/resume-builder")}
            style={{background:"transparent",color:T.muted2,border:`1px solid ${T.border2}`,
              borderRadius:10,padding:"14px 40px",fontSize:"0.82rem",fontWeight:600,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.white;}}
            onMouseLeave={e=>{e.currentTarget.style.color=T.muted2;e.currentTarget.style.borderColor=T.border2;}}>
            Build a Better Resume
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT
═══════════════════════════════════ */
export const ResumeAnalysis = () => {
  const [screen, setScreen] = useState("landing");
  const [result, setResult] = useState(null);
  const [domain, setDomain] = useState(null);

  const handleAnalyze = (data, selectedDomain) => {
    setResult(data); setDomain(selectedDomain); setScreen("result");
  };

  return (
    <>
      <GlobalStyle/>
      {screen==="landing" && <LandingScreen onNext={()=>setScreen("input")}/>}
      {screen==="input"   && <InputScreen onAnalyze={(data,dom)=>{setDomain(dom);setScreen("loading");setTimeout(async()=>{handleAnalyze(data,dom);},0);}}/>}
      {screen==="loading" && <LoadingScreen domain={domain}/>}
      {screen==="result"  && <ResultScreen result={result} domain={domain} onRetry={()=>{setResult(null);setScreen("input");}}/>}
    </>
  );
};