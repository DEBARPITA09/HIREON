import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./01a_Home.module.css";

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
            For Top<br/>
            <span className={styles.outline}>Talent</span>
          </h1>
          <p className={styles.heroP}>
            Connect with world-class companies using AI-powered matching, smart screening,
            and real-time job alerts — designed to get you hired faster.
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
              {t:"AI-powered matching",           s:"designed for faster, smarter hiring."},
              {t:"Resume analysis & ATS scoring", s:"to maximise shortlisting chances."},
              {t:"Real-time application tracking",s:"from apply to offer."},
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

      {/* ── TICKER ── */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {["3,20,000+ Placed","·","94% Match Rate","·","14 Day Avg Hire","·","500+ Companies","·","AI-Powered Matching","·",
            "3,20,000+ Placed","·","94% Match Rate","·","14 Day Avg Hire","·","500+ Companies","·","AI-Powered Matching","·"].map((item,i)=>(
            <span key={i} className={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};