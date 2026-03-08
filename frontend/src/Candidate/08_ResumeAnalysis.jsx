import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:"#060d1a",surface:"#0b1528",card:"#0f1e35",border:"#1a3350",
  teal:"#0ea5e9",teal2:"#00D4AA",blue:"#4F8EF7",gold:"#f59e0b",
  purple:"#8b5cf6",text:"#e2e8f0",muted:"#64748b",muted2:"#94a3b8",
  white:"#ffffff",danger:"#ef4444",
};

const DOMAINS = [
  {id:"webdev",label:"Web Development",icon:"🌐",color:"#0ea5e9",sub:"React, Node, HTML/CSS, JavaScript"},
  {id:"backend",label:"Backend Development",icon:"⚙️",color:"#8b5cf6",sub:"Spring Boot, Django, APIs, Databases"},
  {id:"ai_ml",label:"AI / Machine Learning",icon:"🤖",color:"#00D4AA",sub:"Python, TensorFlow, PyTorch, NLP"},
  {id:"datascience",label:"Data Science",icon:"📊",color:"#f59e0b",sub:"Pandas, SQL, Visualization, Stats"},
  {id:"devops",label:"DevOps & Cloud",icon:"☁️",color:"#38bdf8",sub:"Docker, AWS, CI/CD, Linux"},
  {id:"android",label:"Android Development",icon:"📱",color:"#4ade80",sub:"Kotlin, Java, Firebase, XML"},
  {id:"cybersec",label:"Cybersecurity",icon:"🔐",color:"#f87171",sub:"Networking, Ethical Hacking, OWASP"},
  {id:"dsa",label:"Competitive Programming",icon:"🏆",color:"#fbbf24",sub:"DSA, LeetCode, Codeforces, CP"},
  {id:"iot",label:"IoT & Embedded Systems",icon:"🔌",color:"#a78bfa",sub:"Arduino, Raspberry Pi, C/C++"},
  {id:"blockchain",label:"Blockchain",icon:"⛓️",color:"#34d399",sub:"Solidity, Web3, Smart Contracts"},
  {id:"uiux",label:"UI/UX Design",icon:"🎨",color:"#f472b6",sub:"Figma, Prototyping, User Research"},
  {id:"fullstack",label:"Full Stack Development",icon:"💻",color:"#60a5fa",sub:"MERN, MEAN, Spring + React"},
];

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
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},
    body:JSON.stringify({
      model:"llama-3.3-70b-versatile",
      messages:[{role:"user",content:prompt}],
      temperature:0.3,
      max_tokens:2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(()=>({}));
    throw new Error(`Groq API error: ${err?.error?.message || response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g,"").trim();
  try { return JSON.parse(clean); }
  catch { throw new Error("AI returned invalid response. Please try again."); }
};

const strengthColor = (s) => {
  if (s>=80) return "#00D4AA";
  if (s>=60) return "#4F8EF7";
  if (s>=40) return "#f59e0b";
  return "#ef4444";
};

function CountUp({target}) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    let cur=0; const step=target/80;
    const t=setInterval(()=>{cur+=step;if(cur>=target){setV(target);clearInterval(t);}else setV(Math.floor(cur));},16);
    return ()=>clearInterval(t);
  },[target]);
  return <>{v}</>;
}

function Ring({score,size=150,stroke=11}) {
  const r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ-(score/100)*circ,color=strengthColor(score);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1.4s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:32,fontWeight:900,color,lineHeight:1}}><CountUp target={score}/></span>
        <span style={{fontSize:11,color:C.muted,marginTop:2}}>/ 100</span>
      </div>
    </div>
  );
}

function Bar({value,color}) {
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(value),300);return()=>clearTimeout(t);},[value]);
  return (
    <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:7,overflow:"hidden"}}>
      <div style={{width:`${w}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:99,transition:"width 1.2s ease"}}/>
    </div>
  );
}

function Particles() {
  const ref=useRef();
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;
    let W=canvas.width,H=canvas.height,raf;
    const pts=Array.from({length:38},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.8+.4,c:["rgba(14,165,233,","rgba(79,142,247,","rgba(0,212,170,"][Math.floor(Math.random()*3)],a:Math.random()*.4+.1}));
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        pts.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<110){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(79,142,247,${.05*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}});
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c+p.a+")";ctx.fill();
        p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      });
      raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

function LandingScreen({onNext}) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,fontFamily:"'Outfit','Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <Particles/>
      <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:500,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,212,170,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",maxWidth:640,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.teal},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px rgba(14,165,233,0.4)`}}>🧠</div>
          <span style={{color:C.white,fontWeight:800,fontSize:20,letterSpacing:"0.05em"}}>HIRE<span style={{color:C.blue}}>ON</span></span>
          <div style={{background:`${C.teal2}18`,border:`1px solid ${C.teal2}40`,borderRadius:20,padding:"4px 14px",color:C.teal2,fontSize:11,fontWeight:600}}>AI ANALYSIS</div>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(79,142,247,0.1)",color:C.blue,border:"1px solid rgba(79,142,247,0.25)",borderRadius:20,padding:"4px 16px",fontSize:12,fontWeight:600,marginBottom:20}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.teal2,boxShadow:`0 0 7px ${C.teal2}`,display:"inline-block",animation:"pulse 2s infinite"}}/>
          AI Powered · Instant Results · 100% Free
        </div>
        <h1 style={{fontSize:"clamp(26px,5vw,50px)",fontWeight:900,lineHeight:1.12,margin:"0 0 14px",color:C.white}}>
          IS YOUR RESUME{" "}
          <span style={{background:`linear-gradient(135deg,${C.teal},${C.teal2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>STRONG ENOUGH</span>
          <br/>FOR YOUR <span style={{color:C.gold}}>DREAM ROLE?</span>
        </h1>
        <p style={{fontSize:17,color:C.muted2,margin:"0 0 10px",fontWeight:500}}>Don't worry — <span style={{color:C.teal,fontWeight:700}}>we are here for you!</span></p>
        <p style={{fontSize:14,color:C.muted,maxWidth:480,margin:"0 auto 44px",lineHeight:1.8}}>Paste your resume text, choose your target domain, and get a detailed AI-powered strength report with actionable feedback — in seconds!</p>
        <div style={{display:"flex",gap:14,marginBottom:44,flexWrap:"wrap",justifyContent:"center"}}>
          {[{val:"Domain",label:"Specific Analysis",icon:"🎯",color:C.teal2},{val:"Instant",label:"AI Feedback",icon:"⚡",color:C.blue},{val:"Free",label:"No Cost Ever",icon:"🆓",color:C.gold}].map(({val,label,icon,color})=>(
            <div key={val} style={{display:"flex",alignItems:"center",gap:10,background:`${color}12`,border:`1px solid ${color}30`,borderRadius:40,padding:"10px 20px"}}>
              <span style={{fontSize:17}}>{icon}</span>
              <div><div style={{fontSize:14,fontWeight:800,color,lineHeight:1}}>{val}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:1}}>{label}</div></div>
            </div>
          ))}
        </div>
        <button onClick={onNext} style={{background:`linear-gradient(135deg,${C.teal},#0284c7)`,color:"#fff",border:"none",borderRadius:12,padding:"16px 48px",fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.08em",textTransform:"uppercase",boxShadow:`0 4px 24px rgba(14,165,233,0.4)`,transition:"box-shadow 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 8px 32px rgba(14,165,233,0.65)`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 24px rgba(14,165,233,0.4)`}>
          🚀 ANALYSE MY RESUME
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.5);opacity:0.5;}}`}</style>
    </div>
  );
}

function InputScreen({onAnalyze}) {
  const navigate=useNavigate();
  const [text,setText]=useState("");
  const [domain,setDomain]=useState(null);
  const [errMsg,setErrMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const wordCount=text.trim().split(/\s+/).filter(Boolean).length;
  const canStart=text.trim().length>100&&domain&&!loading;

  const handleStart=async()=>{
    if(!canStart)return;
    setLoading(true);setErrMsg("");
    try {
      const result=await callGroq(text.trim(),domain.label);
      onAnalyze(result,domain);
    } catch(e) {
      console.error("Error:",e);
      setErrMsg("❌ "+e.message);
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit','Segoe UI',sans-serif",paddingBottom:60}}>
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"18px 40px",background:C.surface,borderBottom:`1px solid rgba(79,142,247,0.12)`,position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>navigate("/Candidate/06_MainCand")} style={{background:"rgba(79,142,247,0.08)",color:C.blue,border:"1px solid rgba(79,142,247,0.2)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back to Dashboard</button>
        <div style={{fontWeight:800,fontSize:18}}><span style={{color:C.white}}>HIRE</span><span style={{color:C.blue}}>ON</span></div>
        <div style={{marginLeft:"auto",background:`${C.teal2}15`,border:`1px solid ${C.teal2}40`,borderRadius:20,padding:"4px 14px",color:C.teal2,fontSize:11,fontWeight:600}}>AI Resume Analysis</div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px"}}>

        {/* Steps */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:40}}>
          {["Paste Resume","Choose Domain","Start Analysis"].map((s,i)=>{
            const done=(i===0&&text.length>100)||(i===1&&domain);
            const active=(i===0&&text.length<=100)||(i===1&&text.length>100&&!domain)||(i===2&&text.length>100&&domain);
            return (
              <React.Fragment key={s}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:done?C.teal2:active?C.blue:"rgba(255,255,255,0.06)",border:`2px solid ${done?C.teal2:active?C.blue:"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:done?16:13,fontWeight:700,color:done||active?"#fff":C.muted,transition:"all 0.3s"}}>
                    {done?"✓":i+1}
                  </div>
                  <span style={{fontSize:11,color:done?C.teal2:active?C.blue:C.muted,fontWeight:600,whiteSpace:"nowrap"}}>{s}</span>
                </div>
                {i<2&&<div style={{width:60,height:2,background:done?C.teal2:"rgba(255,255,255,0.06)",margin:"0 8px",marginBottom:22,transition:"background 0.3s"}}/>}
              </React.Fragment>
            );
          })}
        </div>

        {errMsg&&(
          <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:"14px 20px",color:"#ef4444",fontSize:14,fontWeight:500,marginBottom:20}}>
            {errMsg}
          </div>
        )}

        {/* STEP 1 */}
        <div style={{marginBottom:28}}>
          <h2 style={{color:C.white,fontSize:18,fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
            <span style={{background:`${C.blue}20`,border:`1px solid ${C.blue}40`,borderRadius:8,padding:"3px 10px",color:C.blue,fontSize:12,fontWeight:700}}>STEP 1</span>
            Paste Your Resume Text
          </h2>
          <p style={{color:C.muted,fontSize:13,marginBottom:14}}>
            Open your resume → Select All (<kbd style={{background:"rgba(255,255,255,0.08)",borderRadius:4,padding:"1px 6px",fontSize:11}}>Ctrl+A</kbd>) → Copy (<kbd style={{background:"rgba(255,255,255,0.08)",borderRadius:4,padding:"1px 6px",fontSize:11}}>Ctrl+C</kbd>) → Paste below
          </p>
          <div style={{position:"relative"}}>
            <textarea value={text} onChange={e=>setText(e.target.value)}
              placeholder={"Paste your entire resume text here...\n\nExample:\nJohn Doe\njohn@email.com | LinkedIn | GitHub\n\nEDUCATION\nB.Tech Computer Science — XYZ University\n\nSKILLS\nJava, Python, React, Node.js...\n\nEXPERIENCE\n..."}
              style={{width:"100%",minHeight:280,background:"linear-gradient(145deg,#0D1A2E,#0A1220)",border:`2px solid ${text.length>100?"rgba(0,212,170,0.4)":"rgba(79,142,247,0.28)"}`,borderRadius:16,padding:"20px",color:C.text,fontSize:14,lineHeight:1.7,fontFamily:"'Courier New',monospace",resize:"vertical",outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"}}/>
            <div style={{position:"absolute",bottom:14,right:16,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:"3px 10px",fontSize:11,color:wordCount>50?C.teal2:C.muted,fontWeight:600}}>
              {wordCount} words {wordCount>50?"✓":"(need more)"}
            </div>
          </div>
          <div style={{marginTop:10,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{fontSize:16,flexShrink:0}}>💡</span>
            <p style={{color:"#fcd34d",fontSize:12,margin:0,lineHeight:1.6}}>
              <strong>Tip:</strong> Open your resume PDF in browser → Press <strong>Ctrl+A</strong> → <strong>Ctrl+C</strong> → Come back and press <strong>Ctrl+V</strong> to paste!
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div style={{marginBottom:36}}>
          <h2 style={{color:C.white,fontSize:18,fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
            <span style={{background:`${C.blue}20`,border:`1px solid ${C.blue}40`,borderRadius:8,padding:"3px 10px",color:C.blue,fontSize:12,fontWeight:700}}>STEP 2</span>
            Choose Your Target Domain
          </h2>
          <p style={{color:C.muted,fontSize:13,marginBottom:20}}>Select the field you are targeting or building your career in.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:12}}>
            {DOMAINS.map(d=>(
              <div key={d.id} onClick={()=>setDomain(d)} style={{background:domain?.id===d.id?`${d.color}15`:"linear-gradient(145deg,#0D1220,#0A1020)",border:`2px solid ${domain?.id===d.id?d.color:"rgba(79,142,247,0.12)"}`,borderRadius:14,padding:"16px 14px",cursor:"pointer",transition:"all 0.2s",transform:domain?.id===d.id?"scale(1.02)":"scale(1)",boxShadow:domain?.id===d.id?`0 4px 20px ${d.color}25`:"none"}}>
                <div style={{fontSize:24,marginBottom:8}}>{d.icon}</div>
                <div style={{color:domain?.id===d.id?d.color:C.white,fontWeight:700,fontSize:13,marginBottom:4}}>{d.label}</div>
                <div style={{color:C.muted,fontSize:11,lineHeight:1.5}}>{d.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <button onClick={handleStart} disabled={!canStart} style={{background:canStart?`linear-gradient(135deg,${C.teal},${C.teal2})`:"rgba(255,255,255,0.06)",color:canStart?"#fff":C.muted,border:"none",borderRadius:14,padding:"18px 56px",fontSize:18,fontWeight:800,cursor:canStart?"pointer":"not-allowed",fontFamily:"inherit",letterSpacing:"0.1em",textTransform:"uppercase",boxShadow:canStart?`0 6px 28px rgba(14,165,233,0.4)`:"none",transition:"all 0.2s"}}>
            {loading?"⏳ Analysing...":"🔍 START ANALYSIS"}
          </button>
          {text.length<=100&&<p style={{color:C.muted,fontSize:12,marginTop:10}}>Paste your resume text to continue</p>}
          {text.length>100&&!domain&&<p style={{color:C.muted,fontSize:12,marginTop:10}}>Choose a domain to continue</p>}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({domain}) {
  const steps=["Reading your resume...","Understanding your experience...","Comparing with domain requirements...","Generating your strength report..."];
  const [step,setStep]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setStep(s=>(s+1)%steps.length),1800);return()=>clearInterval(t);},[]);
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit','Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <Particles/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:440,padding:32}}>
        <div style={{fontSize:56,marginBottom:20,display:"inline-block",animation:"bob 1.5s ease-in-out infinite"}}>🧠</div>
        <h2 style={{color:C.white,fontSize:22,fontWeight:800,marginBottom:8}}>Analysing Your Resume</h2>
        <p style={{color:domain.color,fontWeight:600,fontSize:14,marginBottom:28}}>{domain.icon} {domain.label}</p>
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:6,overflow:"hidden",marginBottom:20,position:"relative"}}>
          <div style={{height:"100%",width:"50%",background:`linear-gradient(90deg,${C.teal},${C.teal2})`,borderRadius:99,animation:"slide 1.8s ease-in-out infinite"}}/>
        </div>
        <p style={{color:C.muted,fontSize:14,minHeight:22}}>{steps[step]}</p>
      </div>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}@keyframes slide{0%{margin-left:-50%;}100%{margin-left:110%;}}`}</style>
    </div>
  );
}

function ResultScreen({result,domain,onRetry}) {
  const navigate=useNavigate();
  const sc=strengthColor(result.overallStrength);
  const color=domain.color;
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit','Segoe UI',sans-serif",paddingBottom:60}}>
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"18px 40px",background:C.surface,borderBottom:`1px solid rgba(79,142,247,0.12)`,position:"sticky",top:0,zIndex:100,flexWrap:"wrap"}}>
        <button onClick={()=>navigate("/Candidate/06_MainCand")} style={{background:"rgba(79,142,247,0.08)",color:C.blue,border:"1px solid rgba(79,142,247,0.2)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Dashboard</button>
        <div style={{fontWeight:800,fontSize:18}}><span style={{color:C.white}}>HIRE</span><span style={{color:C.blue}}>ON</span></div>
        <div style={{marginLeft:"auto",display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{background:`${color}18`,border:`1px solid ${color}40`,borderRadius:20,padding:"4px 14px",color,fontSize:12,fontWeight:600}}>{domain.icon} {domain.label}</div>
          <button onClick={onRetry} style={{background:"rgba(79,142,247,0.08)",color:C.blue,border:"1px solid rgba(79,142,247,0.2)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"}}>🔄 New Analysis</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"36px 24px",display:"flex",flexDirection:"column",gap:22}}>

        {/* Score Hero */}
        <div style={{background:"linear-gradient(145deg,#0D1A2E,#0A1220)",border:`1px solid ${sc}30`,borderRadius:20,padding:"36px 32px",display:"flex",alignItems:"center",gap:36,flexWrap:"wrap",position:"relative",overflow:"hidden",boxShadow:`0 8px 40px ${sc}15`}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${sc},transparent)`}}/>
          <Ring score={result.overallStrength}/>
          <div style={{flex:1,minWidth:220}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,flexWrap:"wrap"}}>
              <h2 style={{color:C.white,fontSize:24,fontWeight:900,margin:0}}>Resume Strength</h2>
              <span style={{background:`${sc}20`,color:sc,border:`1px solid ${sc}50`,borderRadius:8,padding:"4px 14px",fontSize:14,fontWeight:800}}>{result.strengthLabel}</span>
            </div>
            <p style={{color:C.muted2,fontSize:15,lineHeight:1.7,margin:"0 0 16px"}}>{result.headline}</p>
            <div style={{background:`${color}10`,border:`1px solid ${color}25`,borderRadius:10,padding:"10px 14px",display:"inline-flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{domain.icon}</span>
              <span style={{color,fontSize:13,fontWeight:600}}>Analysed for: {domain.label}</span>
            </div>
          </div>
        </div>

        {/* Strong Areas */}
        <div style={{background:"linear-gradient(145deg,#0D1220,#0A1020)",border:"1px solid rgba(0,212,170,0.15)",borderRadius:16,padding:"24px 22px"}}>
          <h3 style={{color:C.white,fontSize:16,fontWeight:700,marginBottom:18}}>💪 Strong Areas</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {result.strongAreas.map((s,i)=>(
              <div key={i} style={{background:"rgba(0,212,170,0.04)",border:"1px solid rgba(0,212,170,0.12)",borderRadius:12,padding:"14px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:8,flexWrap:"wrap"}}>
                  <span style={{color:C.teal2,fontWeight:700,fontSize:14}}>✅ {s.area}</span>
                  <span style={{color:C.teal2,fontWeight:800,fontSize:15}}>{s.score}%</span>
                </div>
                <Bar value={s.score} color={C.teal2}/>
                <p style={{color:C.muted2,fontSize:13,margin:"10px 0 0",lineHeight:1.6}}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div style={{background:"linear-gradient(145deg,#0D1220,#0A1020)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,padding:"24px 22px"}}>
          <h3 style={{color:C.white,fontSize:16,fontWeight:700,marginBottom:18}}>⚠️ Areas to Improve</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {result.weakAreas.map((w,i)=>(
              <div key={i} style={{background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:12,padding:"14px 18px"}}>
                <div style={{color:"#f87171",fontWeight:700,fontSize:14,marginBottom:6}}>⚡ {w.area}</div>
                <p style={{color:C.muted2,fontSize:13,margin:"0 0 8px",lineHeight:1.6}}>{w.detail}</p>
                <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"flex-start",gap:6}}>
                  <span style={{fontSize:14}}>💡</span>
                  <span style={{color:"#fcd34d",fontSize:12,lineHeight:1.6}}><strong>Fix:</strong> {w.gap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Skills */}
        <div style={{background:"linear-gradient(145deg,#0D1220,#0A1020)",border:`1px solid ${color}20`,borderRadius:16,padding:"24px 22px"}}>
          <h3 style={{color:C.white,fontSize:16,fontWeight:700,marginBottom:18}}>{domain.icon} Domain Skills Coverage</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
            {result.domainSkillsCovered.map((sk,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:sk.present?`${C.teal2}08`:"rgba(255,255,255,0.02)",border:`1px solid ${sk.present?C.teal2+"30":"rgba(255,255,255,0.06)"}`,borderRadius:10,padding:"10px 14px"}}>
                <span style={{fontSize:18}}>{sk.present?"✅":"❌"}</span>
                <span style={{color:sk.present?C.teal2:C.muted,fontSize:13,fontWeight:sk.present?600:400}}>{sk.skill}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,background:"rgba(255,255,255,0.06)",borderRadius:99,height:8,overflow:"hidden"}}>
              <div style={{width:`${(result.domainSkillsCovered.filter(s=>s.present).length/result.domainSkillsCovered.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}99)`,borderRadius:99,transition:"width 1.2s ease"}}/>
            </div>
            <span style={{color,fontWeight:700,fontSize:13,flexShrink:0}}>{result.domainSkillsCovered.filter(s=>s.present).length}/{result.domainSkillsCovered.length} skills</span>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{background:"linear-gradient(145deg,#0D1220,#0A1020)",border:"1px solid rgba(79,142,247,0.15)",borderRadius:16,padding:"24px 22px"}}>
          <h3 style={{color:C.white,fontSize:16,fontWeight:700,marginBottom:18}}>🎯 Top Recommendations</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {result.topRecommendations.map((tip,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:"rgba(79,142,247,0.04)",border:"1px solid rgba(79,142,247,0.1)",borderRadius:10}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:`${C.blue}20`,border:`1px solid ${C.blue}40`,display:"flex",alignItems:"center",justifyContent:"center",color:C.blue,fontSize:12,fontWeight:800,flexShrink:0}}>{i+1}</div>
                <p style={{color:C.muted2,fontSize:13,margin:0,lineHeight:1.7}}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div style={{background:`linear-gradient(135deg,${color}12,rgba(14,165,233,0.05))`,border:`1px solid ${color}30`,borderRadius:16,padding:"24px 22px",display:"flex",alignItems:"flex-start",gap:16}}>
          <span style={{fontSize:32,flexShrink:0}}>🚀</span>
          <div>
            <h3 style={{color:C.white,fontSize:15,fontWeight:700,marginBottom:8}}>Your Next Steps</h3>
            <p style={{color:C.muted2,fontSize:14,lineHeight:1.75,margin:0}}>{result.nextSteps}</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onRetry} style={{background:`linear-gradient(135deg,${C.teal},${C.teal2})`,color:"#fff",border:"none",borderRadius:12,padding:"14px 36px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 20px rgba(14,165,233,0.3)`}}>🔍 Analyse Another Resume</button>
          <button onClick={()=>navigate("/Candidate/services/resume-builder")} style={{background:"rgba(79,142,247,0.1)",color:C.blue,border:`1px solid ${C.blue}40`,borderRadius:12,padding:"14px 36px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📝 Build a Better Resume</button>
        </div>

      </div>
    </div>
  );
}

export const ResumeAnalysis = () => {
  const [screen,setScreen]=useState("landing");
  const [result,setResult]=useState(null);
  const [domain,setDomain]=useState(null);

  const handleAnalyze=(data,selectedDomain)=>{
    setResult(data);setDomain(selectedDomain);setScreen("result");
  };

  if(screen==="landing") return <LandingScreen onNext={()=>setScreen("input")}/>;
  if(screen==="loading") return <LoadingScreen domain={domain}/>;
  if(screen==="result")  return <ResultScreen result={result} domain={domain} onRetry={()=>{setResult(null);setScreen("input");}}/>;
  return <InputScreen onAnalyze={handleAnalyze}/>;
};
