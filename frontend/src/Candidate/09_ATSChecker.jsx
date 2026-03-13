import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* ═══════════════════════════════════
   HIREON DESIGN TOKENS
═══════════════════════════════════ */
const T = {
  bg:      "#080808",
  surface: "rgba(255,255,255,0.03)",
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
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'DM Sans',sans-serif; background:#080808; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;} }
    @keyframes bob     { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
    @keyframes slide   { 0%{margin-left:-50%;}100%{margin-left:110%;} }
    .fade { animation:fadeUp 0.42s ease both; }
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
   HELPERS
═══════════════════════════════════ */
const scoreColor = s => s>=80?T.green : s>=60?T.blue : s>=40?T.yellow : T.red;

function AnimatedBar({ value, color, delay=0 }) {
  const [w,setW] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setW(value),300+delay); return()=>clearTimeout(t); },[value,delay]);
  return (
    <div style={{background:T.border,borderRadius:99,height:6,overflow:"hidden"}}>
      <div style={{width:`${w}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:99,transition:"width 1.2s ease"}}/>
    </div>
  );
}

function CountUp({ target }) {
  const [v,setV] = useState(0);
  useEffect(()=>{
    let cur=0; const step=target/80;
    const t=setInterval(()=>{ cur+=step; if(cur>=target){setV(target);clearInterval(t);}else setV(Math.floor(cur)); },16);
    return()=>clearInterval(t);
  },[target]);
  return <>{v}</>;
}

function Ring({ score, size=156, stroke=11 }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, offset=circ-(score/100)*circ, color=scoreColor(score);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1.5s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color,lineHeight:1}}>
          <CountUp target={score}/>
        </span>
        <span style={{fontSize:"0.62rem",color:T.muted,marginTop:3}}>/ 100</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SHARED TOPBAR
═══════════════════════════════════ */
function Topbar({ right, breadcrumb="ATS Checker" }) {
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
const SectionCard = ({ title, accent=T.blue, children }) => (
  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
    padding:24,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,${accent},transparent)`}}/>
    <div style={{display:"flex",alignItems:"center",marginBottom:18,paddingBottom:12,
      borderBottom:`1px solid ${T.border}`}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"0.75rem",fontWeight:900,
        textTransform:"uppercase",letterSpacing:"0.15em",color:T.white,margin:0}}>{title}</h3>
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════
   SCREEN 1 — LANDING
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
          background:`${T.yellow}08`,color:T.yellow,border:`1px solid ${T.yellow}22`,
          padding:"5px 16px",borderRadius:20,fontSize:"0.68rem",fontWeight:600,
          letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:32}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.yellow,
            boxShadow:`0 0 8px ${T.yellow}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
          Instant · Free · AI Powered
        </div>

        <h1 className="fade" style={{fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)",fontWeight:900,lineHeight:1.05,
          color:T.white,margin:"0 0 10px",animationDelay:"0.08s"}}>
          Your Resume Deserves
        </h1>
        <h1 className="fade" style={{fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)",fontWeight:900,lineHeight:1.05,
          fontStyle:"italic",color:T.accent,margin:"0 0 28px",animationDelay:"0.16s"}}>
          To Be Seen.
        </h1>

        <p className="fade" style={{fontSize:"0.88rem",color:T.muted,maxWidth:440,
          lineHeight:1.85,margin:"0 0 12px",animationDelay:"0.2s"}}>
          Most resumes never reach a human — they're filtered out by ATS bots before anyone reads them.
        </p>
        <p className="fade" style={{fontSize:"0.88rem",color:T.muted2,maxWidth:420,
          lineHeight:1.85,margin:"0 0 48px",animationDelay:"0.24s"}}>
          Upload your PDF and get an instant score across{" "}
          <span style={{color:T.yellow,fontWeight:700}}>7 critical metrics</span>{" "}
          — with exact fixes to get past the filters.
        </p>

        <div className="fade" style={{display:"flex",background:T.surface,
          border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",
          marginBottom:52,animationDelay:"0.3s"}}>
          {[{val:"7",label:"Metrics"},{val:"ATS",label:"Optimised"},{val:"PDF",label:"Upload"}].map(({val,label},i,arr)=>(
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
          Check My ATS Score →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SCREEN 2 — UPLOAD
═══════════════════════════════════ */
function UploadScreen({ onAnalyze }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  const [file,         setFile]        = useState(null);
  const [dragging,     setDragging]    = useState(false);
  const [loading,      setLoading]     = useState(false);
  const [errMsg,       setErrMsg]      = useState("");
  const [loadingStep,  setLoadingStep] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") { setErrMsg("Please upload a PDF file only."); return; }
    if (f.size > 5*1024*1024) { setErrMsg("File too large. Max 5MB."); return; }
    setFile(f); setErrMsg("");
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setErrMsg("");
    try {
      setLoadingStep("Uploading your resume...");
      const formData = new FormData(); formData.append("resume", file);
      setLoadingStep("Extracting text from PDF...");
      const response = await fetch(`${BACKEND_URL}/api/ats-check`, { method:"POST", body:formData });
      setLoadingStep("AI is analysing your resume...");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error. Please try again.");
      if (!data.success) throw new Error(data.error || "Analysis failed.");
      onAnalyze(data.result, file.name, data.wordCount);
    } catch(e) {
      setErrMsg(e.message); setLoading(false); setLoadingStep("");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",position:"relative"}}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
      <Topbar breadcrumb="Upload Resume"/>
      <div style={{maxWidth:660,margin:"0 auto",padding:"52px 24px",position:"relative",zIndex:1}}>

        {/* Heading */}
        <div style={{textAlign:"center",marginBottom:44}} className="fade">
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${T.yellow}08`,color:T.yellow,border:`1px solid ${T.yellow}22`,
            padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
            letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:18}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
              boxShadow:`0 0 6px ${T.green}`,display:"inline-block"}}/>
            Upload Your Resume
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.6rem,4vw,2.6rem)",fontWeight:900,
            color:T.white,margin:"0 0 10px",lineHeight:1.1}}>
            Drop It. Scan It. Fix It.
          </h2>
          <p style={{color:T.muted,fontSize:"0.78rem",lineHeight:1.75}}>
            PDF format only · Max 5MB · Never stored on our servers
          </p>
        </div>

        {errMsg && (
          <div style={{background:"rgba(248,113,113,0.08)",border:`1px solid ${T.red}35`,
            borderRadius:10,padding:"12px 18px",color:T.red,fontSize:"0.82rem",
            fontWeight:500,marginBottom:18}}>
            {errMsg}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{background:T.surface,border:`1px solid ${T.blue}20`,
            borderRadius:14,padding:"44px 24px",textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:"2.5rem",marginBottom:16,display:"inline-block",animation:"bob 1.5s ease-in-out infinite"}}>📊</div>
            <div style={{fontFamily:"'Playfair Display',serif",color:T.white,fontWeight:700,
              fontSize:"0.95rem",letterSpacing:"0.04em",marginBottom:18}}>{loadingStep}</div>
            <div style={{background:T.border,borderRadius:99,height:5,overflow:"hidden",maxWidth:300,margin:"0 auto"}}>
              <div style={{height:"100%",width:"50%",background:`linear-gradient(90deg,${T.green},${T.blue})`,
                borderRadius:99,animation:"slide 1.8s ease-in-out infinite"}}/>
            </div>
          </div>
        )}

        {/* Drop Zone */}
        {!loading && (
          <div
            onClick={()=>!file&&inputRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)}
            onDrop={handleDrop}
            style={{
              background: dragging?`${T.blue}08` : file?`${T.green}05` : T.surface,
              border:`2px dashed ${dragging?T.blue:file?T.green:T.border}`,
              borderRadius:14,padding:"52px 24px",textAlign:"center",
              cursor:file?"default":"pointer",transition:"all 0.2s",marginBottom:16,
            }}>
            <input ref={inputRef} type="file" accept=".pdf" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>
            {file ? (
              <>
                <div style={{fontFamily:"'Playfair Display',serif",color:T.green,fontWeight:700,
                  fontSize:"1rem",letterSpacing:"0.02em",marginBottom:6}}>{file.name}</div>
                <div style={{color:T.muted,fontSize:"0.78rem",marginBottom:22}}>
                  {(file.size/1024).toFixed(1)} KB · PDF Ready
                </div>
                <button onClick={e=>{e.stopPropagation();setFile(null);}}
                  style={{background:"transparent",color:T.muted,border:`1px solid ${T.border}`,
                    padding:"5px 16px",borderRadius:7,fontFamily:"'DM Sans',sans-serif",
                    fontSize:"0.75rem",fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color=T.red;e.currentTarget.style.borderColor=T.red+"50";}}
                  onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
                  Remove
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:"2rem",marginBottom:14,opacity:0.4}}>📄</div>
                <div style={{fontFamily:"'Playfair Display',serif",color:T.white,fontWeight:700,
                  fontSize:"0.9rem",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:7}}>
                  Drop Your Resume Here
                </div>
                <div style={{color:T.muted,fontSize:"0.78rem",marginBottom:18}}>or click to browse files</div>
                <div style={{display:"inline-block",background:T.surface,border:`1px solid ${T.border}`,
                  borderRadius:7,padding:"5px 16px",color:T.muted,fontSize:"0.7rem",
                  fontWeight:600,letterSpacing:"0.06em"}}>
                  PDF Only · Max 5MB
                </div>
              </>
            )}
          </div>
        )}

        {/* Info cards */}
        {!loading && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,
            background:T.border,borderRadius:12,overflow:"hidden",marginBottom:28}}>
            {[{title:"Private",desc:"Never stored"},{title:"Instant",desc:"Results in seconds"},{title:"Accurate",desc:"Real PDF extraction"}].map(({title,desc})=>(
              <div key={title} style={{background:T.bg,padding:"18px 14px",textAlign:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",color:T.white,fontWeight:700,
                  fontSize:"0.92rem",marginBottom:4}}>{title}</div>
                <div style={{color:T.muted,fontSize:"0.65rem",fontWeight:600,
                  textTransform:"uppercase",letterSpacing:"0.08em"}}>{desc}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div style={{textAlign:"center"}}>
            <button onClick={handleAnalyze} disabled={!file}
              style={{background:file?T.white:`rgba(255,255,255,0.06)`,
                color:file?"#080808":T.muted,border:"none",borderRadius:10,
                padding:"14px 52px",fontSize:"0.82rem",fontWeight:700,
                cursor:file?"pointer":"not-allowed",
                fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em",
                textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseEnter={e=>{if(file){e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}}
              onMouseLeave={e=>{if(file){e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}}>
              Scan My Resume →
            </button>
            {!file && <p style={{color:T.muted,fontSize:"0.72rem",marginTop:10}}>Upload a PDF to continue</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SCREEN 3 — RESULTS
═══════════════════════════════════ */
function ResultsScreen({ result, fileName, wordCount, onRetry }) {
  const navigate = useNavigate();
  const canvasRef = useRef();
  useParticles(canvasRef);
  const sc = scoreColor(result.overallScore);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}>
      <Topbar
        breadcrumb="ATS Report"
        right={
          <button onClick={onRetry}
            style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,
              padding:"6px 14px",color:T.muted,fontSize:"0.78rem",fontWeight:600,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
            onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
            New Scan
          </button>
        }
      />

      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px",
        display:"flex",flexDirection:"column",gap:16}}>

        {/* Page heading */}
        <div style={{marginBottom:16,textAlign:"center"}} className="fade">
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${T.yellow}08`,color:T.yellow,border:`1px solid ${T.yellow}22`,
            padding:"4px 14px",borderRadius:20,fontSize:"0.65rem",fontWeight:600,
            letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:T.green,
              boxShadow:`0 0 6px ${T.green}`,display:"inline-block"}}/>
            Scan Complete
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.6rem,4vw,2.6rem)",fontWeight:900,
            color:T.white,margin:0,lineHeight:1.1}}>Your ATS Report.</h2>
        </div>

        {/* Score Hero */}
        <div style={{background:T.surface,border:`1px solid ${sc}22`,borderRadius:14,
          padding:"28px 28px",display:"flex",alignItems:"center",gap:32,
          flexWrap:"wrap",position:"relative",overflow:"hidden",
          boxShadow:`0 8px 40px ${sc}0c`}} className="fade">
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,
            background:`linear-gradient(90deg,${sc},transparent)`}}/>
          <Ring score={result.overallScore}/>
          <div style={{flex:1,minWidth:220}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",color:T.white,
                fontSize:"1.4rem",fontWeight:900,margin:0}}>ATS Score</h2>
              <span style={{background:`${sc}18`,color:sc,border:`1px solid ${sc}40`,
                borderRadius:7,padding:"3px 12px",fontSize:"0.7rem",fontWeight:700,
                letterSpacing:"0.06em",textTransform:"uppercase"}}>{result.scoreLabel}</span>
            </div>
            <p style={{color:T.muted2,fontSize:"0.83rem",lineHeight:1.75,margin:"0 0 10px"}}>
              {result.headline}
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {fileName && <span style={{color:T.muted,fontSize:"0.72rem"}}>{fileName}</span>}
              {wordCount && <span style={{color:T.muted,fontSize:"0.72rem"}}>{wordCount} words extracted</span>}
            </div>
          </div>
        </div>

        {/* 7 Metrics */}
        <SectionCard title="7 ATS Metrics" accent={T.blue}>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {result.metrics.map((m,i)=>{
              const c = scoreColor(m.score);
              return (
                <div key={i}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    alignItems:"center",marginBottom:7}}>
                    <span style={{color:T.muted2,fontSize:"0.83rem",fontWeight:600}}>{m.name}</span>
                    <span style={{fontFamily:"'Playfair Display',serif",color:c,fontWeight:900,fontSize:"0.95rem",flexShrink:0}}>
                      {m.score}<span style={{color:T.muted,fontSize:"0.68rem",fontWeight:400}}>/100</span>
                    </span>
                  </div>
                  <AnimatedBar value={m.score} color={c} delay={i*80}/>
                  <p style={{color:T.muted,fontSize:"0.75rem",marginTop:6,lineHeight:1.65}}>{m.comment}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Top Strengths */}
        <SectionCard title="Top Strengths" accent={T.green}>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {result.topStrengths.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,
                padding:"12px 15px",background:`${T.green}05`,
                border:`1px solid ${T.green}15`,borderRadius:9}}>
                <span style={{fontFamily:"'Playfair Display',serif",color:T.green,fontWeight:900,
                  fontSize:"0.8rem",flexShrink:0,marginTop:1}}>0{i+1}</span>
                <p style={{color:T.muted2,fontSize:"0.78rem",margin:0,lineHeight:1.7}}>{s}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Critical Fixes */}
        <SectionCard title="Critical Fixes" accent={T.red}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {result.criticalFixes.map((f,i)=>(
              <div key={i} style={{background:`rgba(255,255,255,0.02)`,
                border:`1px solid ${T.red}18`,borderRadius:10,padding:"14px 16px"}}>
                <div style={{color:T.red,fontWeight:700,fontSize:"0.82rem",marginBottom:8}}>{f.issue}</div>
                <div style={{background:`${T.yellow}08`,border:`1px solid ${T.yellow}22`,
                  borderRadius:7,padding:"8px 12px"}}>
                  <span style={{color:"rgba(251,191,36,0.85)",fontSize:"0.75rem",lineHeight:1.65}}>
                    <strong>Fix:</strong> {f.fix}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Quick Wins */}
        <SectionCard title="Quick Wins" accent={T.blue}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
            {result.quickWins.map((tip,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,
                padding:"11px 14px",background:`${T.blue}05`,
                border:`1px solid ${T.blue}15`,borderRadius:9}}>
                <div style={{width:22,height:22,borderRadius:"50%",
                  background:`${T.blue}15`,border:`1px solid ${T.blue}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:T.blue,fontSize:"0.68rem",fontWeight:800,flexShrink:0}}>{i+1}</div>
                <p style={{color:T.muted2,fontSize:"0.75rem",margin:0,lineHeight:1.7}}>{tip}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CTAs */}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",paddingTop:8}}>
          <button onClick={onRetry}
            style={{background:"transparent",color:T.muted2,border:`1px solid ${T.border2}`,
              borderRadius:10,padding:"14px 36px",fontSize:"0.82rem",fontWeight:600,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.white;}}
            onMouseLeave={e=>{e.currentTarget.style.color=T.muted2;e.currentTarget.style.borderColor=T.border2;}}>
            Scan Another
          </button>
          <button onClick={()=>navigate("/Candidate/services/resume-builder")}
            style={{background:T.white,color:"#080808",border:"none",borderRadius:10,
              padding:"14px 44px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
            Build a Better Resume →
          </button>
        </div>

      </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT
═══════════════════════════════════ */
export const ATSChecker = () => {
  const [screen,    setScreen]    = useState("landing");
  const [result,    setResult]    = useState(null);
  const [fileName,  setFileName]  = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleAnalyze = (data, name, wc) => {
    setResult(data); setFileName(name); setWordCount(wc); setScreen("result");
  };

  return (
    <>
      <GlobalStyle/>
      {screen==="landing" && <LandingScreen onNext={()=>setScreen("upload")}/>}
      {screen==="upload"  && <UploadScreen onAnalyze={handleAnalyze}/>}
      {screen==="result"  && <ResultsScreen result={result} fileName={fileName} wordCount={wordCount} onRetry={()=>{setResult(null);setScreen("upload");}}/>}
    </>
  );
};