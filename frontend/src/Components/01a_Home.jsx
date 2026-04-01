import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./01a_Home.module.css";

/* ─── Floating Help Chatbot — same KB as Help page ─── */
const KB = [
  { tags:["create account","sign up","signup","register","how to join","new account","get started","how do i start"],
    answer:"Creating a HIREON account is simple:\n• Click Candidate or Recruiter on the home page\n• Choose Sign Up and fill in your details\n• Your account is ready instantly!" },
  { tags:["free","cost","price","pricing","paid","subscription","charge","how much"],
    answer:"HIREON is completely free for both candidates and recruiters.\nAll core features are available at no cost." },
  { tags:["ats score","ats","applicant tracking","what is ats","ats mean"],
    answer:"ATS stands for Applicant Tracking System — software that filters resumes automatically.\n\nYour HIREON ATS score shows how likely your resume is to pass:\n• Above 80 → strong\n• 60–80 → decent\n• Below 60 → needs work" },
  { tags:["improve ats","increase ats","better ats","low ats","boost ats","fix ats"],
    answer:"To improve your ATS score:\n• Add keywords from the job description\n• Use a clean single-column layout\n• Add a strong Skills section\n• Use standard headings: Experience, Education, Skills" },
  { tags:["resume analysis","ai analysis","ai resume","analyse resume","analyze resume"],
    answer:"Upload your PDF resume to the Candidate dashboard → our AI parses it and gives you a detailed ATS score plus improvement tips. Takes under 30 seconds." },
  { tags:["job recommendation","job match","recommended jobs","find jobs","matching jobs"],
    answer:"HIREON matches your profile and skills against all active listings. Keep your Skills section updated for the best matches." },
  { tags:["apply job","how to apply","apply for job","submit application"],
    answer:"Browse Recommended Jobs → click any job → click Apply Now. Your profile and resume are submitted instantly. Every application is tracked in your dashboard." },
  { tags:["track application","application status","my applications","check application"],
    answer:"Go to My Applications in your Candidate dashboard. Each application shows real-time status — Pending, Accepted or Rejected." },
  { tags:["post job","recruiter post","add job","create job","job listing","how to post"],
    answer:"Log in to Recruiter dashboard → click Post a Job → fill in role, description, requirements → listing goes live immediately." },
  { tags:["recruiter","recruiter dashboard","view candidates","recruiter feature"],
    answer:"The HIREON Recruiter dashboard lets you:\n• Post job listings\n• View all applicants with ATS scores\n• Accept or reject candidates\n• Track your full hiring pipeline" },
  { tags:["reset password","forgot password","change password","cant login","login issue"],
    answer:"Go to the login page → click Forgot Password → enter your email → a reset link arrives in minutes. Check spam if you don't see it." },
  { tags:["hireon","what is hireon","about hireon","tell me about","what does hireon do"],
    answer:"HIREON is an AI-powered hiring platform connecting job seekers with recruiters.\n\nFor candidates: resume analysis, ATS scoring, job matching, application tracking.\nFor recruiters: post jobs, screen applicants, manage your pipeline.\n\nEverything is free. Built in Bhubaneswar, Odisha." },
  { tags:["contact support","talk to human","email support","need help","contact us"],
    answer:"Reach us at support@hireon.com\nMonday–Friday · 9am–6pm IST\nWe respond within 24 hours." },
  { tags:["dsa","aptitude","practice","coding","interview prep","technical"],
    answer:"HIREON has a DSA & Aptitude practice section with 500+ problems tagged by company (MAANG, Product, Service), difficulty and topic. Find it in your Candidate dashboard." },
  { tags:["ai interview","mock interview","interview practice","ai mock"],
    answer:"HIREON's AI Mock Interview lets you practice with an AI that asks real interview questions for your target role, evaluates your answers and gives instant feedback." },
];

function findKBAnswer(input) {
  const lower = input.toLowerCase().trim();
  let best = null, bestScore = 0;
  for (const entry of KB) {
    for (const tag of entry.tags) {
      if (lower.includes(tag)) {
        const score = tag.split(" ").length * tag.length;
        if (score > bestScore) { bestScore = score; best = entry; }
      }
    }
  }
  return bestScore > 0 ? best : null;
}

function FloatingChatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMsgs]   = useState([{ from:"bot", text:"Hi! 👋 I'm the HIREON assistant. Ask me anything about the platform!" }]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput("");
    setMsgs(prev => [...prev, { from:"user", text:msg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 500 + Math.random()*300));
    setTyping(false);
    const greets = ["hi","hello","hey","hii","helo","sup","yo","namaste"];
    const thanks  = ["thanks","thank you","thank","thx","ty","great","perfect","awesome"];
    const lower = msg.toLowerCase().trim();
    if (greets.some(g => lower === g || lower.startsWith(g+" "))) {
      setMsgs(prev => [...prev, { from:"bot", text:"Hello! 👋 Great to have you here.\n\nAsk me anything about HIREON — ATS scores, job applications, recruiter tools or account help!" }]);
    } else if (thanks.some(t => lower === t || lower.startsWith(t+" "))) {
      setMsgs(prev => [...prev, { from:"bot", text:"You're welcome! Happy to help. Anything else?" }]);
    } else {
      const match = findKBAnswer(msg);
      if (match) {
        setMsgs(prev => [...prev, { from:"bot", text:match.answer }]);
      } else {
        setMsgs(prev => [...prev, { from:"bot", text:"I don't have a specific answer for that right now.\n\nTry asking about:\n• ATS scores or resume analysis\n• Job applications or matching\n• Recruiter tools\n• Account help\n\nOr email us at support@hireon.com" }]);
      }
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const bubbleStyle = (from) => ({
    maxWidth:"85%", padding:"9px 13px", borderRadius: from==="bot" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
    background: from==="bot" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.85)",
    fontSize:"0.78rem", lineHeight:1.65, whiteSpace:"pre-wrap", alignSelf: from==="bot" ? "flex-start" : "flex-end",
  });

  return (
    <>
      {/* Floating bubble button */}
      <button onClick={() => setOpen(v => !v)} style={{
        position:"fixed", bottom:28, right:28, zIndex:9999,
        width:54, height:54, borderRadius:"50%",
        background:"#fff", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 24px rgba(0,0,0,0.5)", transition:"transform 0.2s",
      }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      >
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#080808", letterSpacing: "0.08em", fontFamily: "DM Sans, sans-serif" }}>HELP</span>
        }
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position:"fixed", bottom:92, right:28, zIndex:9998,
          width:340, height:480, borderRadius:16,
          background:"#0d0d0d", border:"1px solid rgba(255,255,255,0.1)",
          boxShadow:"0 16px 60px rgba(0,0,0,0.7)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          animation:"chatSlideIn 0.2s ease",
        }}>
          <style>{`@keyframes chatSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Header */}
          <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize:"0.83rem", fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',serif" }}>HIREON Assistant</div>
              <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)" }}>
                <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#81e6a0", marginRight:5, verticalAlign:"middle" }}/>
                Online · HIREON topics only
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 12px", display:"flex", flexDirection:"column", gap:10, scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
            {messages.map((m,i) => (
              <div key={i} style={bubbleStyle(m.from)}>{m.text}</div>
            ))}
            {typing && (
              <div style={{ ...bubbleStyle("bot"), display:"flex", gap:4, alignItems:"center", padding:"12px 14px" }}>
                {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,0.35)", animation:`typingDot 1.2s ${i*0.2}s infinite` }}/>)}
                <style>{`@keyframes typingDot{0%,80%,100%{transform:scale(0.8);opacity:0.4}40%{transform:scale(1.1);opacity:1}}`}</style>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about HIREON..."
              disabled={typing}
              style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 12px", color:"#fff", fontSize:"0.78rem", outline:"none", fontFamily:"'DM Sans',sans-serif" }}
            />
            <button onClick={() => send()} disabled={!input.trim() || typing}
              style={{ background:"#fff", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, opacity: (!input.trim() || typing) ? 0.4 : 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}



/* ─── Background Canvas ─── */
function useBackground(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 130;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random()-0.5)*0.00022, vy: (Math.random()-0.5)*0.00022,
      r: 0.8+Math.random()*1.8, a: 0.15+Math.random()*0.45, ph: Math.random()*Math.PI*2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        const pulse=0.82+0.18*Math.sin(t*0.018+p.ph);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*pulse})`; ctx.fill();
      });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<0.1){
          ctx.beginPath(); ctx.moveTo(pts[i].x*W,pts[i].y*H); ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle=`rgba(255,255,255,${0.07*(1-d/0.1)})`; ctx.lineWidth=0.4; ctx.stroke();
        }
      }
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
}

/* ─── Cursor ─── */
function useCursor() {
  const cr=useRef(null), fr=useRef(null);
  useEffect(()=>{
    let fx=0,fy=0,mx=0,my=0;
    const mm=e=>{mx=e.clientX;my=e.clientY;if(cr.current){cr.current.style.left=mx+"px";cr.current.style.top=my+"px";}};
    document.addEventListener("mousemove",mm);
    const tick=()=>{fx+=(mx-fx)*0.12;fy+=(my-fy)*0.12;if(fr.current){fr.current.style.left=fx+"px";fr.current.style.top=fy+"px";}requestAnimationFrame(tick);};
    tick();
    return ()=>document.removeEventListener("mousemove",mm);
  },[]);
  return {cr,fr};
}


/* ─── Scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      const d = el.dataset.delay || 0;
      el.style.transition = 'opacity 0.7s ease ' + d + 'ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ' + d + 'ms';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

/* ─── Chrome bar ─── */
const Chrome = ({url}) => (
  <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
    <div style={{display:"flex",gap:4}}>
      {["#ff5f56","#ffbd2e","#27c93f"].map(c=>(
        <span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>
      ))}
    </div>
    <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8}}>
      <span style={{fontSize:".52rem",color:"rgba(255,255,255,.18)",fontFamily:"DM Sans,sans-serif"}}>{url}</span>
    </div>
  </div>
);

const C = { blue:"#8ab4f8", green:"#81e6a0", grey:"#c8c8c8" };

/* ── All 5 card bodies ── */
const CARDS = [
  {
    id:"dashboard", url:"hireon.app/dashboard",
    chip:{ dot:"#81e6a0", title:"Arjun Rawat — Hired", sub:"Joined Google · 14 days via HIREON" },
    body:(
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:".92rem",fontWeight:700,color:"#fff"}}>Welcome back, Arjun</div>
            <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:2}}>3 new interview invites today</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",fontSize:".58rem",fontWeight:500,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:100,color:"rgba(255,255,255,.7)"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#fff",display:"inline-block"}}/>Active
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
          {[{v:"12",l:"Applied",c:C.grey},{v:"5",l:"Interviews",c:C.blue},{v:"2",l:"Offers",c:C.green}].map(s=>(
            <div key={s.l} style={{borderRadius:9,padding:"8px 10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.1rem",fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:".52rem",color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".07em",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:".52rem",fontWeight:600,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>ATS Score</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{position:"relative",width:68,height:68,flexShrink:0}}>
            <svg width="68" height="68" viewBox="0 0 68 68" style={{transform:"rotate(-90deg)"}}>
              <circle cx="34" cy="34" r="26" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6"/>
              <circle cx="34" cy="34" r="26" fill="none" stroke="rgba(200,200,200,.75)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2*Math.PI*26*0.82} ${2*Math.PI*26}`}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:"1rem",fontWeight:900,color:"#fff",lineHeight:1}}>82</div>
              <div style={{fontSize:".4rem",color:"rgba(255,255,255,.3)",textTransform:"uppercase",marginTop:2}}>Score</div>
            </div>
          </div>
          <div style={{flex:1}}>
            {[{n:"Keywords",v:88,c:C.grey},{n:"Formatting",v:76,c:C.blue},{n:"Experience",v:82,c:C.green}].map(s=>(
              <div key={s.n} style={{marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:".6rem",color:"rgba(255,255,255,.38)"}}>{s.n}</span>
                  <span style={{fontSize:".58rem",fontWeight:600,color:s.c}}>{s.v}%</span>
                </div>
                <div style={{height:3,background:"rgba(255,255,255,.07)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${s.v}%`,background:s.c,borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id:"jobs", url:"hireon.app/jobs",
    chip:{ dot:"#8ab4f8", title:"94% Match Found", sub:"Frontend Engineer · Google" },
    body:(
      <div style={{padding:"14px 16px"}}>
        <div style={{fontSize:".52rem",fontWeight:600,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>Recommended Roles</div>
        {[
          {av:"G",bg:"rgba(255,255,255,.12)",t:"Frontend Engineer",   c:"Google · Bangalore",  p:"94%",pc:C.blue },
          {av:"A",bg:"rgba(255,255,255,.10)",t:"SDE II – Platform",   c:"Amazon · Remote",     p:"88%",pc:C.grey },
          {av:"R",bg:"rgba(255,255,255,.08)",t:"Full Stack Dev",       c:"Razorpay · Hyderabad",p:"81%",pc:C.green},
          {av:"M",bg:"rgba(255,255,255,.07)",t:"Backend Engineer",     c:"Microsoft · Pune",    p:"77%",pc:"#c4b5fd"},
        ].map(j=>(
          <div key={j.t} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:8,marginBottom:6}}>
            <div style={{width:28,height:28,borderRadius:7,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:j.bg,fontFamily:"DM Sans,sans-serif",fontSize:".62rem",fontWeight:600,color:"#fff"}}>{j.av}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:".72rem",fontWeight:500,color:"#fff"}}>{j.t}</div>
              <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:1}}>{j.c}</div>
            </div>
            <span style={{padding:"2px 8px",borderRadius:100,fontSize:".55rem",fontWeight:600,color:j.pc,border:`1px solid ${j.pc}55`,background:`${j.pc}18`}}>{j.p}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:"hired", url:"hireon.app/success",
    chip:{ dot:"#fbbf24", title:"Offer Received!", sub:"₹52 LPA · Google · SWE II" },
    body:(
      <div style={{padding:"14px 16px"}}>
        <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:14,textAlign:"center",marginBottom:14}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1.5px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:".88rem",fontWeight:700,color:"#fff"}}>Congratulations, Arjun!</div>
          <div style={{fontSize:".58rem",color:"rgba(255,255,255,.32)",marginTop:3}}>Hired via HIREON in 14 days</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14}}>
          {[{v:"52 LPA",l:"CTC Offered",c:C.grey},{v:"Google",l:"Company",c:C.green},{v:"SWE II",l:"Role",c:"#fff"},{v:"Bangalore",l:"Location",c:C.blue}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:9,padding:"8px 10px"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:".9rem",fontWeight:700,color:s.c}}>{s.v}</div>
              <div style={{fontSize:".52rem",color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".07em",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:".52rem",fontWeight:600,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>Journey Timeline</div>
        {[
          {t:"Profile Created",d:"Jan 10",c:C.green},
          {t:"AI Matched — Google SWE II 94%",d:"Jan 12",c:C.green},
          {t:"Offer Letter — 52 LPA",d:"Jan 24",c:C.grey},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:8,paddingBottom:6,position:"relative"}}>
            {i<2&&<div style={{position:"absolute",left:6,top:14,width:1,height:"calc(100% - 4px)",background:"rgba(255,255,255,.07)"}}/>}
            <div style={{width:13,height:13,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,.06)",border:`1.5px solid ${item.c}88`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="6" height="6" viewBox="0 0 12 12" fill="none" stroke={item.c} strokeWidth="3" strokeLinecap="round"><polyline points="2 6 5 9 10 3"/></svg>
            </div>
            <div>
              <div style={{fontSize:".65rem",fontWeight:500,color:item.c}}>{item.t}</div>
              <div style={{fontSize:".55rem",color:"rgba(255,255,255,.25)",marginTop:1}}>{item.d}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:"ats", url:"hireon.app/ats-checker",
    chip:{ dot:"#f87171", title:"ATS Score: 88/100", sub:"Above 85% of applicants" },
    body:(
      <div style={{padding:"14px 16px"}}>
        <div style={{fontSize:".52rem",fontWeight:600,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>ATS Checker Report</div>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
          <div style={{position:"relative",width:76,height:76,flexShrink:0}}>
            <svg width="76" height="76" viewBox="0 0 76 76" style={{transform:"rotate(-90deg)"}}>
              <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="7"/>
              <circle cx="38" cy="38" r="30" fill="none" stroke="#81e6a0" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2*Math.PI*30*0.88} ${2*Math.PI*30}`}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.1rem",fontWeight:900,color:"#fff",lineHeight:1}}>88</div>
              <div style={{fontSize:".38rem",color:"rgba(255,255,255,.3)",textTransform:"uppercase",marginTop:2}}>ATS</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:".7rem",color:"#81e6a0",fontWeight:600,marginBottom:4}}>Great Match!</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.35)",lineHeight:1.6}}>Your resume is well-optimised for this role. Fix 2 issues to reach 95+.</div>
          </div>
        </div>
        {[
          {l:"Keyword Match",  v:92, c:C.green, s:"Excellent"},
          {l:"Formatting",     v:85, c:C.blue,  s:"Good"},
          {l:"Skills Section", v:78, c:C.grey,  s:"Improve"},
          {l:"Experience",     v:88, c:C.green, s:"Strong"},
        ].map(r=>(
          <div key={r.l} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"center"}}>
              <span style={{fontSize:".62rem",color:"rgba(255,255,255,.4)"}}>{r.l}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:".52rem",color:"rgba(255,255,255,.2)"}}>{r.s}</span>
                <span style={{fontSize:".58rem",fontWeight:700,color:r.c}}>{r.v}%</span>
              </div>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${r.v}%`,background:r.c,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:"resume", url:"hireon.app/resume-builder",
    chip:{ dot:"#c4b5fd", title:"Resume Built!", sub:"ATS-ready · Downloaded" },
    body:(
      <div style={{padding:"14px 16px"}}>
        <div style={{fontSize:".52rem",fontWeight:600,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Resume Builder</div>
        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:".92rem",fontWeight:700,color:"#fff"}}>Arjun Rawat</div>
              <div style={{fontSize:".6rem",color:"rgba(255,255,255,.3)",marginTop:2}}>Software Engineer · Bangalore</div>
            </div>
            <div style={{padding:"3px 10px",background:"rgba(129,230,160,.1)",border:"1px solid rgba(129,230,160,.25)",borderRadius:100,fontSize:".55rem",fontWeight:600,color:"#81e6a0"}}>ATS Ready ✓</div>
          </div>
          {["Experience","Skills","Education","Projects"].map((sec,i)=>(
            <div key={sec} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:16,height:16,borderRadius:4,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="#81e6a0" strokeWidth="2.5" strokeLinecap="round"><polyline points="2 6 5 9 10 3"/></svg>
              </div>
              <div style={{flex:1,height:6,background:"rgba(255,255,255,.04)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${[85,92,78,88][i]}%`,background:"rgba(255,255,255,.12)",borderRadius:3}}/>
              </div>
              <span style={{fontSize:".55rem",color:"rgba(255,255,255,.28)",minWidth:52}}>{sec}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1,padding:"8px",background:"rgba(138,180,248,.08)",border:"1px solid rgba(138,180,248,.18)",borderRadius:8,textAlign:"center"}}>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:".88rem",fontWeight:700,color:C.blue}}>4</div>
            <div style={{fontSize:".5rem",color:"rgba(255,255,255,.25)",marginTop:2,textTransform:"uppercase",letterSpacing:".06em"}}>Sections</div>
          </div>
          <div style={{flex:1,padding:"8px",background:"rgba(129,230,160,.06)",border:"1px solid rgba(129,230,160,.16)",borderRadius:8,textAlign:"center"}}>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:".88rem",fontWeight:700,color:C.green}}>88%</div>
            <div style={{fontSize:".5rem",color:"rgba(255,255,255,.25)",marginTop:2,textTransform:"uppercase",letterSpacing:".06em"}}>Complete</div>
          </div>
          <div style={{flex:1,padding:"8px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,textAlign:"center"}}>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:".88rem",fontWeight:700,color:"#fff"}}>PDF</div>
            <div style={{fontSize:".5rem",color:"rgba(255,255,255,.25)",marginTop:2,textTransform:"uppercase",letterSpacing:".06em"}}>Export</div>
          </div>
        </div>
      </div>
    ),
  },
];

/* ══════════════════════════════════════════
   VERTICAL CONVEYOR CAROUSEL  (TUF-style)
   3 cards always visible — stacked top→front
   Every 3s the bottom card exits upward and
   a new card enters from below.
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   CONVEYOR CAROUSEL — TUF-style
   • 3 cards always on screen (back / mid / front)
   • Every 3.2 s: front exits UP, mid→front,
     back→mid, new card rises in as back
   • Pure CSS transitions, no RAF
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   TUF-STYLE CAROUSEL
   • Big tilted card stack in centre
   • Rotating orbit ring with tech icons
   • Floating user chips around the ring
   • Cards cycle every 3.2s with smooth transitions
══════════════════════════════════════════ */

const TECH_ICONS = [
  {
    label: "JavaScript",
    bg: "#f7df1e",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#f7df1e"/><path d="M20.79 22.168c.495.804 1.139 1.395 2.278 1.395 1.006 0 1.649-.503 1.649-1.196 0-.831-.66-1.126-1.768-1.609l-.607-.261c-1.751-.745-2.914-1.679-2.914-3.651 0-1.818 1.384-3.202 3.549-3.202 1.541 0 2.648.536 3.446 1.938l-1.887 1.211c-.415-.745-.863-1.038-1.559-1.038-.71 0-1.16.45-1.16 1.038 0 .728.45 1.022 1.492 1.472l.607.261c2.063.884 3.227 1.786 3.227 3.812 0 2.185-1.717 3.376-4.022 3.376-2.254 0-3.71-1.073-4.42-2.482zm-8.507.225c.363.641.693 1.183 1.487 1.183.76 0 1.24-.297 1.24-1.452v-7.86h2.326v7.894c0 2.392-1.402 3.479-3.447 3.479-1.849 0-2.921-0.957-3.467-2.109z" fill="#000"/></svg>
  },
  {
    label: "GitHub",
    bg: "#24292e",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#24292e" rx="8"/><path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M16 6C10.477 6 6 10.477 6 16c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0116 11.82c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C23.137 24.163 26 20.418 26 16c0-5.523-4.477-10-10-10z"/></svg>
  },
  {
    label: "LinkedIn",
    bg: "#0077b5",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#0077b5" rx="8"/><path fill="#fff" d="M9.5 12.5h3v10h-3zm1.5-4.8a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM14.5 12.5h2.9v1.4h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.56h-3v-4.93c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.29-1.9 2.62v5h-3v-10z"/></svg>
  },
  {
    label: "LeetCode",
    bg: "#1a1a1a",
    svg: <svg viewBox="0 0 95 111" width="22" height="26"><path fill="#ffa116" d="M68.8 44.2H29.3c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5h39.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5z"/><path fill="#b3b3b3" d="M27.4 79.8l26.1 26.1c3.5 3.5 9.2 3.5 12.7 0l22.4-22.4c3.5-3.5 3.5-9.2 0-12.7L62.5 44.7 27.4 79.8z"/><path fill="#ffa116" d="M41.3 5.6L5.6 41.3c-3.5 3.5-3.5 9.2 0 12.7l9.4 9.4 44.8-44.8-6.1-13c-3.4-3.4-9-3.4-12.4 0z"/></svg>
  },
  {
    label: "Python",
    bg: "#3776ab",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#3776ab" rx="8"/><path fill="#ffd43b" d="M16.07 6c-1.06 0-2.07.09-2.96.26-2.62.46-3.1 1.43-3.1 3.21v2.35h6.2v.78H8.06c-1.8 0-3.38 1.08-3.88 3.14-.57 2.36-.59 3.83 0 6.29.44 1.83 1.49 3.14 3.29 3.14h2.13v-2.82c0-2.04 1.77-3.84 3.88-3.84h6.17c1.73 0 3.1-1.42 3.1-3.16V9.47c0-1.69-1.42-2.95-3.1-3.21A19.8 19.8 0 0016.07 6zm-3.35 1.88c.64 0 1.16.52 1.16 1.17a1.16 1.16 0 01-1.16 1.16 1.16 1.16 0 01-1.16-1.16c0-.65.52-1.17 1.16-1.17z"/><path fill="#fff" d="M22.84 15.6v2.74c0 2.13-1.8 3.92-3.88 3.92h-6.17c-1.7 0-3.1 1.46-3.1 3.16v5.94c0 1.69 1.47 2.68 3.1 3.16 1.96.58 3.84.68 6.17 0 1.56-.45 3.1-1.35 3.1-3.16v-2.35H15.9v-.78h9.26c1.8 0 2.47-1.26 3.1-3.14.65-1.94.62-3.8 0-6.29-.44-1.79-1.29-3.14-3.1-3.14h-2.32zm-3.47 13.26c.64 0 1.16.52 1.16 1.16 0 .65-.52 1.17-1.16 1.17a1.17 1.17 0 01-1.16-1.17c0-.64.52-1.16 1.16-1.16z"/></svg>
  },
  {
    label: "Google",
    bg: "#fff",
    svg: <svg viewBox="0 0 48 48" width="24" height="24"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.19 29.5 1 24 1 14.84 1 7.1 6.33 3.44 14.07l7.11 5.52C12.37 13.28 17.72 9.5 24 9.5z"/><path fill="#4285F4" d="M46.56 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.64c-.55 2.96-2.2 5.46-4.68 7.14l7.18 5.57C43.26 37.55 46.56 31.5 46.56 24.5z"/><path fill="#FBBC05" d="M10.55 28.41A14.44 14.44 0 019.5 24c0-1.53.26-3.01.72-4.41l-7.11-5.52A23.94 23.94 0 001 24c0 3.87.93 7.52 2.56 10.75l7-5.34z"/><path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.93l-7.18-5.57c-1.82 1.22-4.15 1.94-6.31 1.94-6.28 0-11.63-3.78-13.45-9.09l-7 5.34C7.1 41.67 14.84 47 24 47z"/><path fill="#4285F4" d="M46.56 24.5H24v9h12.64c-.55 2.96-2.2 5.46-4.68 7.14" opacity="0"/></svg>
  },
  {
    label: "Java",
    bg: "#e76f00",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#e76f00" rx="8"/><path fill="#fff" d="M12.5 21.6s-.9.52.64.7c1.87.21 2.82.18 4.88-.2 0 0 .54.34 1.3.63-4.62 1.98-10.46-.12-6.82-1.13zM11.9 18.9s-1.01.75.53.91c2 .2 3.57.22 6.3-.3 0 0 .38.38.97.59-5.59 1.63-11.81.13-7.8-1.2zM17.2 13.7c1.14 1.31-.3 2.49-.3 2.49s2.89-1.49 1.56-3.35c-1.24-1.74-2.19-2.6 2.97-5.58 0 0-8.11 2.03-4.23 6.44z"/><path fill="#fff" d="M21.9 23.5s.67.55-.74.97c-2.67.81-11.12 1.06-13.47.03-.84-.37.74-.87 1.23-.98.52-.11.81-.09.81-.09-.93-.66-6.02 1.29-2.59 1.85 9.37 1.52 17.09-.68 14.76-1.78zM12.8 16.1s-4.24 1.01-1.5 1.38c1.16.15 3.47.12 5.62-.06 1.76-.15 3.52-.47 3.52-.47s-.62.27-1.07.57c-4.31 1.13-12.63.6-10.23-.55 2.04-1 3.66-.87 3.66-.87zM20 20.6c4.38-2.27 2.36-4.46 0.94-4.17-.35.07-.5.13-.5.13s.13-.2.37-.28c2.77-1.02 4.9 2.83-.9 4.48 0 0 .07-.06.09-.16z"/><path fill="#fff" d="M14.3 7S12 12.4 17.9 15.9c1.75 1.06.2 2.6.2 2.6s4.42-2.28 2.39-5.13c-1.9-2.66-3.35-3.98-6.19-6.37z"/></svg>
  },
  {
    label: "C++",
    bg: "#00599c",
    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" fill="#00599c" rx="8"/><path fill="#fff" d="M16 7c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-1.5 12.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5c1.48 0 2.8.72 3.62 1.83l-1.5 1.5A2.25 2.25 0 0014.5 13c-1.24 0-2.25 1.01-2.25 2.25S13.26 17.5 14.5 17.5c.81 0 1.52-.43 1.92-1.07l1.5 1.5A4.48 4.48 0 0114.5 19.5zm6-4.25h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3.5 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/></svg>
  },
];

const USER_CHIPS = [
  { name:"Arjun Rawat",   company:"Google",   color:"#81e6a0", angle: 35  },
  { name:"Priya Sharma",  company:"Amazon",   color:"#8ab4f8", angle: 135 },
  { name:"Rohit Das",     company:"Microsoft",color:"#c4b5fd", angle: 220 },
  { name:"Sneha Iyer",    company:"Deloitte", color:"#fbbf24", angle: 310 },
];


/* ══════════════════════════════════════════
   ZERO-JANK CAROUSEL
   No useState, no re-renders, no key changes.
   All 5 cards are mounted ONCE and never unmount.
   A setInterval directly writes CSS classes via
   classList — React never touches these elements
   after mount.
══════════════════════════════════════════ */
function ConveyorCarousel() {
  const wrapRef   = useRef(null);
  const ringRef   = useRef(null);
  const cardRefs  = useRef(CARDS.map(() => React.createRef()));
  const chipRef   = useRef(null);
  const chipDotRef  = useRef(null);
  const chipTitleRef= useRef(null);
  const chipSubRef  = useRef(null);

  useEffect(() => {
    const N     = CARDS.length;
    let front   = 0;  // index of current front card
    let animating = false;

    // ── slot class names (defined in CSS, zero-transition on init)
    const SLOTS = ['slotBack', 'slotMid', 'slotFront', 'slotExit', 'slotHidden'];

    // assign initial slots without transition
    const applySlots = (frontIdx, withTransition) => {
      CARDS.forEach((_, i) => {
        const el = cardRefs.current[i]?.current;
        if (!el) return;
        if (!withTransition) el.style.transition = 'none';
        else el.style.transition = '';

        // remove all slot classes
        SLOTS.forEach(s => el.classList.remove(styles[s]));

        const offset = ((i - frontIdx) % N + N) % N;
        // offset 0 = front, N-1 = back-most (we only show 3 slots)
        if      (offset === 0) el.classList.add(styles.slotFront);
        else if (offset === 1) el.classList.add(styles.slotHidden); // just exited
        else if (offset === 2) el.classList.add(styles.slotBack);
        else if (offset === 3) el.classList.add(styles.slotMid);    // wraps around
        else                   el.classList.add(styles.slotHidden);
      });
    };

    // simpler cleaner slot mapping: back, mid, front for 3 visible
    const setSlots = (frontIdx, exitIdx, withTransition) => {
      const midIdx  = (frontIdx - 1 + N) % N;
      const backIdx = (frontIdx - 2 + N) % N;

      CARDS.forEach((_, i) => {
        const el = cardRefs.current[i]?.current;
        if (!el) return;
        el.style.transition = withTransition ? '' : 'none';
        SLOTS.forEach(s => el.classList.remove(styles[s]));

        if      (i === frontIdx) el.classList.add(styles.slotFront);
        else if (i === midIdx)   el.classList.add(styles.slotMid);
        else if (i === backIdx)  el.classList.add(styles.slotBack);
        else if (i === exitIdx)  el.classList.add(styles.slotExit);
        else                     el.classList.add(styles.slotHidden);
      });
    };

    // ── initial placement (no transition)
    setSlots(front, null, false);
    // force reflow then re-enable transitions
    void cardRefs.current[0]?.current?.offsetHeight;
    cardRefs.current.forEach(r => { if (r.current) r.current.style.transition = ''; });

    // ── update chip display
    const updateChip = (idx) => {
      const chip = CARDS[idx].chip;
      if (chipDotRef.current)   { chipDotRef.current.style.background  = chip.dot; chipDotRef.current.style.boxShadow = `0 0 8px ${chip.dot}`; }
      if (chipTitleRef.current)  chipTitleRef.current.textContent = chip.title;
      if (chipSubRef.current)    chipSubRef.current.textContent   = chip.sub;
    };
    updateChip(front);

    // ── advance every 3.2s
    const interval = setInterval(() => {
      if (animating) return;
      animating = true;

      const exitIdx = front;
      front = (front + 1) % N;

      setSlots(front, exitIdx, true);
      updateChip(front);

      // allow next advance after transition finishes
      setTimeout(() => { animating = false; }, 750);
    }, 3200);

    // ── orbit ring RAF
    let angle = 0;
    let lastT = performance.now();
    let raf;
    const spin = (now) => {
      const dt = Math.min(now - lastT, 50);
      lastT = now;
      angle += dt * 0.022;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
      }
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, []);

  const chip = CARDS[0].chip; // initial — DOM updates it directly

  return (
    <div ref={wrapRef} className={styles.conveyorWrap}>

      {/* ── ORBIT RING ── */}
      <div ref={ringRef} className={styles.orbitRing}>
        {TECH_ICONS.map((icon, i) => {
          const angle = (i / TECH_ICONS.length) * 360;
          const rad   = angle * Math.PI / 180;
          return (
            <div
              key={icon.label}
              className={styles.orbitIcon}
              style={{
                left: `calc(50% + ${Math.cos(rad) * 340}px)`,
                top:  `calc(50% + ${Math.sin(rad) * 340}px)`,
                transform: `translate(-50%,-50%) rotate(${-angle}deg)`,
                background: icon.bg,
              }}
            >
              {icon.svg}
            </div>
          );
        })}
      </div>

      {/* ── FLOATING USER CHIPS ── */}
      {USER_CHIPS.map((u, i) => {
        const rad = u.angle * Math.PI / 180;
        return (
          <div
            key={u.name}
            className={styles.userChip}
            style={{
              left: `calc(50% + ${Math.cos(rad) * 390}px)`,
              top:  `calc(50% + ${Math.sin(rad) * 390}px)`,
              animationDelay: `${i * 1.1}s`,
            }}
          >
            <div className={styles.userAvatar} style={{ background: u.color, color:"#000" }}>
              {u.name[0]}
            </div>
            <div>
              <div className={styles.userName}>{u.name}</div>
              <div className={styles.userSub}>
                Joined <span style={{ color: u.color }}>{u.company}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── ALL 5 CARDS — mounted once, never remounted ── */}
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          ref={cardRefs.current[i]}
          className={`${styles.conveyorCard} ${styles.slotHidden}`}
        >
          <Chrome url={card.url} />
          {card.body}
        </div>
      ))}

      {/* ── CHIP ── */}
      <div className={styles.conveyorChip}>
        <span ref={chipDotRef} className={styles.conveyorChipDot}
          style={{ background: chip.dot, boxShadow:`0 0 8px ${chip.dot}` }} />
        <div>
          <div ref={chipTitleRef} className={styles.chipTitle}>{chip.title}</div>
          <div ref={chipSubRef}   className={styles.chipSub}>{chip.sub}</div>
        </div>
      </div>

    </div>
  );
}


/* =====================================================
   SHARED HELPERS
===================================================== */
const Divider = ({ label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:20, margin:"0 auto 64px", maxWidth:1100, padding:"0 3.5rem" }}>
    <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.055)" }} />
    <span style={{ fontSize:"0.58rem", fontWeight:700, color:"rgba(255,255,255,0.18)", letterSpacing:"0.22em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{label}</span>
    <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.055)" }} />
  </div>
);

/* =====================================================
   SECTION 2 — AI TOOLS SHOWCASE
   Tab switcher (3 tools) left + live browser mockup right
===================================================== */
const AI_TOOLS = [
  {
    id:"resume-analysis", icon:"RESUME", title:"Resume Analysis", accent:"#81e6a0",
    sub:"AI reads your resume and scores it across 12 domains including skills, formatting, experience and more.",
    tag:"Powered by Groq · llama-3.3-70b",
    preview:(
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:".52rem",fontWeight:700,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Analysis Result</div>
        <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:18}}>
          <div style={{position:"relative",width:84,height:84,flexShrink:0}}>
            <svg width="84" height="84" viewBox="0 0 84 84" style={{transform:"rotate(-90deg)"}}>
              <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="8"/>
              <circle cx="42" cy="42" r="34" fill="none" stroke="#81e6a0" strokeWidth="8" strokeLinecap="round" strokeDasharray="185.9 213.6"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.3rem",fontWeight:900,color:"#fff",lineHeight:1}}>87</div>
              <div style={{fontSize:".38rem",color:"rgba(255,255,255,.3)",textTransform:"uppercase",marginTop:2}}>Score</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:".78rem",color:"#81e6a0",fontWeight:700,marginBottom:4}}>Strong Profile!</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.35)",lineHeight:1.6}}>Your resume aligns well with Full Stack roles. Minor improvements in Projects section recommended.</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {[{l:"Strong Areas",items:["React/Next.js","Node.js","System Design"],c:"#81e6a0"},{l:"Improve",items:["Add project links","Quantify impact","Keywords"],c:"#fbbf24"}].map(col=>(
            <div key={col.l} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:".5rem",fontWeight:700,color:col.c,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{col.l}</div>
              {col.items.map(item=>(
                <div key={item} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:col.c,flexShrink:0}}/>
                  <span style={{fontSize:".6rem",color:"rgba(255,255,255,.45)"}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:"ats-check", icon:"ATS", title:"ATS Checker", accent:"#fbbf24",
    sub:"Upload your resume and job description. Get an instant keyword match score with actionable fix suggestions.",
    tag:"PDF upload · Real-time scoring",
    preview:(
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:".52rem",fontWeight:700,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>ATS Match Report</div>
        <div style={{background:"rgba(251,191,36,.06)",border:"1px solid rgba(251,191,36,.18)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.6rem",fontWeight:900,color:"#fbbf24"}}>91</div>
          <div>
            <div style={{fontSize:".68rem",fontWeight:600,color:"#fbbf24"}}>Excellent Match</div>
            <div style={{fontSize:".56rem",color:"rgba(255,255,255,.3)",marginTop:2}}>Top 8% of all applicants</div>
          </div>
        </div>
        {[{l:"Keyword Density",v:94,c:"#81e6a0"},{l:"Job Title Match",v:89,c:"#8ab4f8"},{l:"Skills Coverage",v:91,c:"#fbbf24"},{l:"Format Clarity",v:87,c:"#c8c8c8"}].map(r=>(
          <div key={r.l} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:".6rem",color:"rgba(255,255,255,.38)"}}>{r.l}</span>
              <span style={{fontSize:".58rem",fontWeight:700,color:r.c}}>{r.v}%</span>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${r.v}%`,background:r.c,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:"mock-interview", icon:"MIC", title:"AI Mock Interview", accent:"#8ab4f8",
    sub:"Practice real interview questions with live AI feedback on your answers, tone, and structure.",
    tag:"Voice + Text · Adaptive difficulty",
    preview:(
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:".52rem",fontWeight:700,color:"rgba(255,255,255,.22)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Mock Interview Round 2</div>
        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontSize:".6rem",fontWeight:600,color:"#8ab4f8",marginBottom:6}}>Interviewer (AI)</div>
          <div style={{fontSize:".7rem",color:"rgba(255,255,255,.7)",lineHeight:1.65}}>"Explain how you would design a URL shortener. Walk me through your system design thinking."</div>
        </div>
        <div style={{background:"rgba(138,180,248,.05)",border:"1px solid rgba(138,180,248,.15)",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:".6rem",fontWeight:600,color:"rgba(255,255,255,.4)",marginBottom:6}}>Your Answer</div>
          <div style={{fontSize:".68rem",color:"rgba(255,255,255,.55)",lineHeight:1.65}}>"I would use a hash function for short codes, Redis for caching, and a load balancer with consistent hashing..."</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:"Clarity",v:88,c:"#81e6a0"},{l:"Depth",v:82,c:"#8ab4f8"},{l:"Confidence",v:91,c:"#fbbf24"}].map(m=>(
            <div key={m.l} style={{flex:1,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:8,padding:"8px",textAlign:"center"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:".88rem",fontWeight:700,color:m.c}}>{m.v}%</div>
              <div style={{fontSize:".48rem",color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".06em",marginTop:2}}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function AIToolsSection() {
  const [active, setActive] = useState(0);
  const tool = AI_TOOLS[active];
  const ChromeBar = ({url}) => (
    <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
      <div style={{display:"flex",gap:4}}>
        {["#ff5f56","#ffbd2e","#27c93f"].map(c=>(<span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>))}
      </div>
      <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8}}>
        <span style={{fontSize:".52rem",color:"rgba(255,255,255,.18)",fontFamily:"DM Sans,sans-serif"}}>{url}</span>
      </div>
    </div>
  );
  return (
    <section style={{ padding:"0 0 120px", position:"relative", zIndex:10 }}>
      <Divider label="AI-Powered Candidate Tools" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 3.5rem" }}>
        <div data-reveal="1" data-delay="0" style={{ marginBottom:52, maxWidth:560 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(129,230,160,0.07)", color:"#81e6a0", border:"1px solid rgba(129,230,160,0.18)", padding:"4px 14px", borderRadius:20, fontSize:"0.65rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#81e6a0", boxShadow:"0 0 8px #81e6a0", display:"inline-block" }} />
            For Candidates
          </div>
          <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,3.5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 14px" }}>
            Every Tool You Need<br/><span style={{ fontStyle:"italic", color:"#c8c8c8" }}>to Get Hired.</span>
          </h2>
          <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.38)", lineHeight:1.8, fontWeight:300, margin:0 }}>
            From resume building to AI mock interviews — HIREON gives candidates a full arsenal to stand out and land offers faster.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:36, alignItems:"flex-start" }}>
          <div data-reveal="1" data-delay="100" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {AI_TOOLS.map((t,i) => (
              <div key={t.id} onClick={() => setActive(i)}
                style={{ background:active===i?`${t.accent}09`:"rgba(255,255,255,0.02)", border:`1px solid ${active===i?t.accent+"32":"rgba(255,255,255,0.07)"}`, borderRadius:12, padding:"16px 18px", cursor:"pointer", transition:"all 0.25s", position:"relative", overflow:"hidden" }}>
                {active===i && <div style={{ position:"absolute", top:0, left:0, bottom:0, width:2, background:`linear-gradient(180deg,${t.accent},transparent)`, borderRadius:"12px 0 0 12px" }} />}
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${t.accent}15`, border:`1px solid ${t.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:".48rem", fontWeight:800, color:t.accent, letterSpacing:".06em" }}>{t.icon}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <div style={{ fontFamily:"Playfair Display,serif", fontSize:"0.9rem", fontWeight:700, color:active===i?t.accent:"rgba(255,255,255,0.72)" }}>{t.title}</div>
                      {active===i && <div style={{ width:5, height:5, borderRadius:"50%", background:t.accent, boxShadow:`0 0 7px ${t.accent}` }} />}
                    </div>
                    <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.34)", lineHeight:1.6, marginBottom:5 }}>{t.sub}</div>
                    <div style={{ fontSize:"0.57rem", color:"rgba(255,255,255,0.19)", fontWeight:500 }}>{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div data-reveal="1" data-delay="180"
            style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 32px 72px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.04)", position:"relative" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${tool.accent}55,transparent)` }} />
            <ChromeBar url={`hireon.app/${tool.id}`} />
            {tool.preview}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   SECTION 3 — HOW IT WORKS
   3 steps: alternating left/right layout with browser mockups
===================================================== */
const HOW_STEPS = [
  {
    num:"01", role:"Candidate", accent:"#81e6a0",
    title:"Build. Analyse. Apply.",
    sub:"Create your ATS-optimised resume, get AI-powered analysis, then let HIREON match you to real roles with 90%+ fit scores.",
    stat1:{v:"14 days",l:"avg. time to hired"}, stat2:{v:"94%",l:"match accuracy"},
    preview:(
      <div style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 32px 72px rgba(0,0,0,0.85)" }}>
        <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6}}>
          <div style={{display:"flex",gap:4}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=>(<span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>))}</div>
          <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8}}><span style={{fontSize:".52rem",color:"rgba(255,255,255,.18)"}}>hireon.app/candidate/dashboard</span></div>
        </div>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:".9rem",fontWeight:700,color:"#fff"}}>Your Job Feed</div>
              <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:2}}>8 new matches today</div>
            </div>
            <div style={{background:"rgba(129,230,160,.1)",border:"1px solid rgba(129,230,160,.25)",padding:"3px 10px",borderRadius:100,fontSize:".58rem",fontWeight:600,color:"#81e6a0"}}>Active</div>
          </div>
          {[{co:"Google",role:"Frontend Eng.",loc:"Bangalore",pct:94,c:"#81e6a0"},{co:"Amazon",role:"SDE II",loc:"Remote",pct:88,c:"#8ab4f8"},{co:"Razorpay",role:"Full Stack",loc:"Hyderabad",pct:81,c:"#fbbf24"}].map(j=>(
            <div key={j.role} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:8,marginBottom:6}}>
              <div style={{width:26,height:26,borderRadius:7,background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",fontWeight:700,color:"#fff",flexShrink:0}}>{j.co[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:".72rem",fontWeight:500,color:"#fff"}}>{j.role}</div>
                <div style={{fontSize:".56rem",color:"rgba(255,255,255,.28)"}}>{j.co} · {j.loc}</div>
              </div>
              <span style={{padding:"2px 8px",borderRadius:100,fontSize:".55rem",fontWeight:600,color:j.c,border:`1px solid ${j.c}50`,background:`${j.c}14`}}>{j.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num:"02", role:"Recruiter", accent:"#8ab4f8",
    title:"Post. Screen. Hire.",
    sub:"Post a job in minutes. HIREON's AI screens every applicant, ranks them by fit score, and surfaces only the best — so you skip the noise.",
    stat1:{v:"3x",l:"faster hiring cycle"}, stat2:{v:"200+",l:"applicants screened/day"},
    preview:(
      <div style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 32px 72px rgba(0,0,0,0.85)" }}>
        <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6}}>
          <div style={{display:"flex",gap:4}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=>(<span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>))}</div>
          <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8}}><span style={{fontSize:".52rem",color:"rgba(255,255,255,.18)"}}>hireon.app/recruiter/applicants</span></div>
        </div>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:".9rem",fontWeight:700,color:"#fff"}}>AI-Screened Applicants</div>
              <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:2}}>Frontend Engineer · Google</div>
            </div>
            <div style={{fontSize:".58rem",color:"rgba(138,180,248,.7)",fontWeight:600}}>247 total</div>
          </div>
          {[{name:"Arjun Rawat",score:94,badge:"Top Pick",bc:"#81e6a0",exp:"3 yrs · React, Node, AWS"},{name:"Priya Sharma",score:88,badge:"Strong",bc:"#8ab4f8",exp:"2 yrs · React, TypeScript"},{name:"Ravi Kumar",score:81,badge:"Good Fit",bc:"#fbbf24",exp:"4 yrs · Vue, Python, SQL"}].map(a=>(
            <div key={a.name} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:8,marginBottom:6}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1.5px solid rgba(255,255,255,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:700,color:"#fff",flexShrink:0}}>{a.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:".72rem",fontWeight:600,color:"#fff"}}>{a.name}</div>
                <div style={{fontSize:".56rem",color:"rgba(255,255,255,.28)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.exp}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                <span style={{fontFamily:"Playfair Display,serif",fontSize:".78rem",fontWeight:900,color:a.bc}}>{a.score}%</span>
                <span style={{padding:"1px 7px",borderRadius:100,fontSize:".48rem",fontWeight:600,color:a.bc,border:`1px solid ${a.bc}40`,background:`${a.bc}10`}}>{a.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num:"03", role:"Both", accent:"#fbbf24",
    title:"Real-Time. Both Sides.",
    sub:"Candidates track every application live. Recruiters update statuses instantly. Everyone stays in sync — no emails, no black holes.",
    stat1:{v:"100%",l:"real-time sync"}, stat2:{v:"0",l:"application black holes"},
    preview:(
      <div style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 32px 72px rgba(0,0,0,0.85)" }}>
        <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6}}>
          <div style={{display:"flex",gap:4}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=>(<span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>))}</div>
          <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4,display:"flex",alignItems:"center",paddingLeft:8}}><span style={{fontSize:".52rem",color:"rgba(255,255,255,.18)"}}>hireon.app/applications</span></div>
        </div>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:".9rem",fontWeight:700,color:"#fff",marginBottom:14}}>Application Tracker</div>
          {[
            {co:"Google",  role:"Frontend Engineer", status:"Interview Scheduled", sc:"#8ab4f8", date:"Jan 22"},
            {co:"Amazon",  role:"SDE II Platform",   status:"Under Review",        sc:"#fbbf24", date:"Jan 19"},
            {co:"Razorpay",role:"Full Stack Dev",     status:"Offer Received",      sc:"#81e6a0", date:"Jan 24"},
            {co:"Microsoft",role:"Backend Engineer", status:"Applied",             sc:"#c8c8c8", date:"Jan 18"},
          ].map(a=>(
            <div key={a.role} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:8,marginBottom:6}}>
              <div style={{width:26,height:26,borderRadius:7,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".62rem",fontWeight:700,color:"#fff",flexShrink:0}}>{a.co[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:".7rem",fontWeight:500,color:"#fff"}}>{a.role}</div>
                <div style={{fontSize:".56rem",color:"rgba(255,255,255,.28)",marginTop:1}}>{a.co} · {a.date}</div>
              </div>
              <span style={{padding:"2px 9px",borderRadius:100,fontSize:".52rem",fontWeight:600,color:a.sc,border:`1px solid ${a.sc}40`,background:`${a.sc}10`,whiteSpace:"nowrap"}}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function HowItWorksSection() {
  return (
    <section style={{ padding:"0 0 120px", position:"relative", zIndex:10 }}>
      <Divider label="How HIREON Works" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 3.5rem" }}>
        <div data-reveal="1" data-delay="0" style={{ marginBottom:64, textAlign:"center" }}>
          <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,3.5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 14px" }}>
            Simple Steps,<br/><span style={{ fontStyle:"italic", color:"#c8c8c8" }}>Extraordinary Results.</span>
          </h2>
          <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.38)", lineHeight:1.8, fontWeight:300, maxWidth:460, margin:"0 auto" }}>
            Whether you are hiring or being hired, HIREON makes the process fast, transparent, and intelligent.
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:80 }}>
          {HOW_STEPS.map((step, idx) => (
            <div key={step.num} data-reveal="1" data-delay={String(idx*80)}
              style={{ display:"grid", gridTemplateColumns:idx%2===0?"1fr 1.2fr":"1.2fr 1fr", gap:56, alignItems:"center" }}>
              <div style={{ order:idx%2===0?0:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ fontFamily:"Playfair Display,serif", fontSize:"3rem", fontWeight:900, color:"rgba(255,255,255,0.055)", lineHeight:1 }}>{step.num}</div>
                  <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.055)" }} />
                  <span style={{ fontSize:"0.6rem", fontWeight:700, color:step.accent, letterSpacing:"0.12em", textTransform:"uppercase", border:`1px solid ${step.accent}30`, padding:"3px 10px", borderRadius:20, background:`${step.accent}08` }}>{step.role}</span>
                </div>
                <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 14px" }}>{step.title}</h3>
                <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.42)", lineHeight:1.8, fontWeight:300, margin:"0 0 28px" }}>{step.sub}</p>
                <div style={{ display:"flex", gap:24 }}>
                  {[step.stat1, step.stat2].map(s => (
                    <div key={s.l} style={{ borderLeft:`2px solid ${step.accent}45`, paddingLeft:14 }}>
                      <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem", fontWeight:900, color:step.accent, lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:"0.66rem", color:"rgba(255,255,255,0.3)", marginTop:4, lineHeight:1.4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ order:idx%2===0?1:0, position:"relative" }}>
                <div style={{ position:"absolute", inset:-48, background:`radial-gradient(ellipse at center, ${step.accent}07 0%, transparent 70%)`, pointerEvents:"none" }} />
                {step.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   SECTION 4 — STATS + TESTIMONIALS + FINAL CTA
===================================================== */
const TESTIMONIALS = [
  {
    name:"Arjun Rawat", role:"Frontend Engineer", company:"Google", color:"#81e6a0",
    text:"HIREON matched me to Google in under 2 weeks. The AI resume analysis told me exactly which keywords to add. Got 94% match and landed the offer.",
  },
  {
    name:"Priya Sharma", role:"SDE II", company:"Amazon", color:"#8ab4f8",
    text:"The ATS checker showed my resume was getting filtered before any human saw it. Fixed 3 things, applied again and got a call the very next day.",
  },
  {
    name:"Rohan Mehta", role:"Tech Recruiter", company:"Razorpay", color:"#fbbf24",
    text:"We posted a job at 9am and by lunch had 40 AI-screened candidates ranked by fit. Used to take us 3 days of manual review. HIREON is genuinely different.",
  },
];

function SocialProofSection({ nav }) {
  return (
    <section style={{ padding:"0 0 120px", position:"relative", zIndex:10 }}>
      <Divider label="What People Are Saying" />
      {/* Testimonials */}
      <div style={{ maxWidth:1100, margin:"0 auto 96px", padding:"0 3.5rem" }}>
        <div data-reveal="1" data-delay="0" style={{ textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 14px" }}>
            Real People,<br/><span style={{ fontStyle:"italic", color:"#c8c8c8" }}>Real Results.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name} data-reveal="1" data-delay={String(i*80)}
              style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"22px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${t.color}50,transparent)` }} />
              <div style={{ fontFamily:"Playfair Display,serif", fontSize:"3rem", color:"rgba(255,255,255,0.05)", lineHeight:1, marginBottom:12 }}>"</div>
              <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.52)", lineHeight:1.75, fontWeight:300, margin:"0 0 20px" }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:`${t.color}15`, border:`1.5px solid ${t.color}38`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.82rem", fontWeight:700, color:t.color, flexShrink:0 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily:"Playfair Display,serif", fontSize:"0.82rem", fontWeight:700, color:"#fff" }}>{t.name}</div>
                  <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.32)", marginTop:2 }}>{t.role} · <span style={{ color:t.color }}>{t.company}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Final CTA block */}
      <div data-reveal="1" data-delay="0" style={{ maxWidth:1100, margin:"0 auto", padding:"0 3.5rem" }}>
        <div style={{ background:"rgba(255,255,255,0.022)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"64px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-30%", left:"5%", width:"40%", height:"80%", background:"radial-gradient(ellipse, rgba(129,230,160,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"-30%", right:"5%", width:"40%", height:"80%", background:"radial-gradient(ellipse, rgba(138,180,248,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
          <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,4vw,3.6rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.03em", marginBottom:14, position:"relative" }}>
            Ready to Hire Smarter?<br/><span style={{ fontStyle:"italic", color:"#c8c8c8" }}>Get Hired Faster.</span>
          </h2>
          <p style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.36)", lineHeight:1.8, maxWidth:480, margin:"0 auto 36px", fontWeight:300, position:"relative" }}>
            Join thousands of candidates and recruiters already using HIREON to transform hiring from both sides of the table.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", position:"relative" }}>
            <div
              onClick={() => nav("/Candidate/02_LoginCand")}
              style={{ padding:"12px 32px", background:"#fff", border:"1px solid #fff", borderRadius:9, color:"#080808", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"DM Sans,sans-serif", letterSpacing:"0.04em", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(255,255,255,0.15)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
              I am a Candidate
            </div>
            <div
              onClick={() => nav("/Recruiter/02_LoginRec")}
              style={{ padding:"12px 32px", background:"transparent", border:"1px solid rgba(255,255,255,0.18)", borderRadius:9, color:"rgba(255,255,255,0.72)", fontSize:"0.82rem", fontWeight:500, cursor:"pointer", fontFamily:"DM Sans,sans-serif", letterSpacing:"0.04em", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.38)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; e.currentTarget.style.color="rgba(255,255,255,0.72)"; }}>
              I am a Recruiter
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Home = () => {
  const canvasRef = useRef(null);
  useBackground(canvasRef);
  const { cr, fr } = useCursor();
  const navigate   = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.cursor}         ref={cr}/>
      <div className={styles.cursorFollower} ref={fr}/>
      <canvas ref={canvasRef} className={styles.bgCanvas}/>

      <section className={styles.hero}>

        {/* ── LEFT ── */}
        <div className={styles.heroLeft}>
          <h1 className={styles.heroH}>
            ONE STOP<br/>
            <span className={styles.italic}>Hiring<br/>Platform</span><br/>
            Hire Smarter.<br/>
            <span className={styles.outline}>Get Hired Faster.</span>
          </h1>
          <p className={styles.heroP}>
            Whether you're building a world-class team or landing your dream role —
            HIREON puts AI-powered tools, smart screening, and real-time matching
            on both sides of the table.
          </p>

          {/* ── PORTAL BUTTONS ── */}
          <div className={styles.portalRow}>
            <div className={styles.portalCandidate} onClick={() => navigate("/Candidate/02_LoginCand")}>
              I'm a Candidate
            </div>
            <div className={styles.portalRecruiter} onClick={() => navigate("/Recruiter/02_LoginRec")}>
              I'm a Recruiter
            </div>
          </div>

          <div className={styles.bullets}>
            {[
              {t:"For Candidates —",  s:"AI resume tools, ATS scoring & mock interviews to get you hired."},
              {t:"For Recruiters —",  s:"smart screening, job posting & real-time applicant tracking."},
              {t:"One platform.",      s:"Zero friction. Everything in one place."},
            ].map((b,i) => (
              <div key={i} className={styles.bl}>
                <div className={styles.blDot}/>
                <span><strong>{b.t}</strong> {b.s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Conveyor Carousel ── */}
        <div className={styles.heroRight}>
          <ConveyorCarousel/>
        </div>

      </section>

      {/* SECTION 2 */}
      <AIToolsSection />

      {/* SECTION 3 */}
      <HowItWorksSection />

      {/* SECTION 4 */}
      <SocialProofSection nav={navigate} />

      {/* Floating Help Chatbot */}
      <FloatingChatbot />

    </div>
  );
};