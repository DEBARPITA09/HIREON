import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
    const rings = [
      {rx:0.21,ry:0.08,tilt:0.34,spd:0.0006,ph:0,   alpha:0.28,w:1.4},
      {rx:0.17,ry:0.065,tilt:0.56,spd:0.0011,ph:2.1,alpha:0.20,w:0.9},
      {rx:0.27,ry:0.105,tilt:0.20,spd:0.0004,ph:4.2,alpha:0.14,w:0.8},
      {rx:0.13,ry:0.05, tilt:0.70,spd:0.0009,ph:1.0,alpha:0.22,w:0.7},
      {rx:0.32,ry:0.12, tilt:0.12,spd:0.0003,ph:3.3,alpha:0.08,w:0.6},
    ];
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      const cx=W*0.62, cy=H*0.42;
      const fog=ctx.createRadialGradient(cx,cy,0,cx,cy,W*0.42);
      fog.addColorStop(0,"rgba(200,200,200,0.03)"); fog.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=fog; ctx.fillRect(0,0,W,H);

      rings.forEach(ring => {
        const angle = t*ring.spd*60+ring.ph;
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle); ctx.scale(1,ring.tilt);
        ctx.beginPath();
        ctx.ellipse(0,0,ring.rx*W+Math.sin(t*ring.spd*30)*6,ring.ry*H,0,0,Math.PI*2);
        ctx.strokeStyle=`rgba(180,180,180,${ring.alpha})`; ctx.lineWidth=ring.w; ctx.stroke();
        const dx=Math.cos(angle*1.4)*ring.rx*W, dy=Math.sin(angle*1.4)*ring.ry*H;
        ctx.beginPath(); ctx.arc(dx,dy,2.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(220,220,220,${ring.alpha*2.5})`; ctx.fill();
        ctx.restore();
      });

      const sg=ctx.createRadialGradient(cx-10,cy-12,3,cx,cy,38);
      sg.addColorStop(0,"rgba(200,200,200,0.1)"); sg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx,cy,38,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,38,0,Math.PI*2);
      ctx.strokeStyle="rgba(180,180,180,0.14)"; ctx.lineWidth=0.8; ctx.stroke();

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

/* ─────────────────────────────────────────────────
   ORBITAL CARD CAROUSEL
   3 cards placed on a circular orbit path.
   They continuously rotate — front card is scaled
   up & fully visible, side/back cards are smaller
   and dimmer, creating a true 3D carousel feel.
───────────────────────────────────────────── */
const CARDS_DATA = [
  {
    id: "dashboard",
    url: "hireon.app/dashboard",
    render: (C) => (
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:".92rem",fontWeight:700,color:"#fff"}}>Welcome back, Arjun</div>
            <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:2}}>3 new interview invites today</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",fontSize:".58rem",fontWeight:500,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:100,color:"rgba(255,255,255,.7)",whiteSpace:"nowrap"}}>
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
    id: "jobs",
    url: "hireon.app/jobs",
    render: (C) => (
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
    id: "hired",
    url: "hireon.app/success",
    render: (C) => (
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
          {t:"Profile Created",               d:"Jan 10",    c:C.green},
          {t:"AI Matched — Google SWE II 94%",d:"Jan 12",    c:C.green},
          {t:"Offer Letter — 52 LPA",         d:"Jan 24",    c:C.grey },
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
];

/* Chrome bar reused */
const Chrome = ({url}) => (
  <div style={{background:"#0a0a0a",padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:6}}>
    <div style={{display:"flex",gap:4}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:"#ff5f56",display:"inline-block"}}/>
      <span style={{width:8,height:8,borderRadius:"50%",background:"#ffbd2e",display:"inline-block"}}/>
      <span style={{width:8,height:8,borderRadius:"50%",background:"#27c93f",display:"inline-block"}}/>
    </div>
    <div style={{flex:1,height:14,background:"rgba(255,255,255,.04)",borderRadius:4}}/>
    <span style={{fontSize:".54rem",color:"rgba(255,255,255,.15)"}}>{url}</span>
  </div>
);

/* ─── ORBITAL CAROUSEL ─── */
function OrbitalCarousel() {
  const C = { blue:"#8ab4f8", green:"#81e6a0", grey:"#c8c8c8" };
  // One ref per card — we mutate their style directly, NEVER touching React state
  const cardRefs = useRef(CARDS_DATA.map(() => React.createRef()));
  const wrapRef  = useRef(null);
  const angle    = useRef(0);
  const paused   = useRef(false);
  const raf      = useRef(null);

  useEffect(() => {
    const RX = 200, RY = 58;           // ellipse radii px
    const N  = CARDS_DATA.length;
    const SPEED = 0.0012;              // rad per ms  (~0.072 rad/s)
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 50); // clamp to avoid big jumps on tab switch
      last = now;

      if (!paused.current) angle.current += SPEED * dt;

      cardRefs.current.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;

        const theta = angle.current + i * (Math.PI * 2 / N);
        const cosT  = Math.cos(theta);
        const sinT  = Math.sin(theta);

        const x      = cosT * RX;
        const yShift = sinT * RY * 0.38;
        const depth  = (cosT + 1) / 2;            // 0 (back) → 1 (front)
        const scale  = 0.50 + depth * 0.58;        // 0.50 → 1.08
        const opac   = 0.18 + depth * 0.82;        // 0.18 → 1.0
        const zIdx   = Math.round(depth * 100);
        const blur   = depth > 0.6 ? 0 : (1 - depth / 0.6) * 4;

        // ── Direct DOM write — bypasses React entirely ──
        el.style.transform   = `translate(calc(-50% + ${x}px), calc(-50% + ${yShift}px)) scale(${scale})`;
        el.style.opacity     = opac;
        el.style.zIndex      = zIdx;
        el.style.filter      = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        el.style.pointerEvents = depth > 0.55 ? "auto" : "none";
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.orbitWrap}
      onMouseEnter={() => { paused.current = true;  }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className={styles.orbitPath}/>

      {CARDS_DATA.map((card, i) => (
        <div
          key={card.id}
          ref={cardRefs.current[i]}
          className={styles.orbitCard}
          // initial style — RAF will overwrite immediately
          style={{ opacity: 0 }}
        >
          <Chrome url={card.url}/>
          {card.render(C)}
        </div>
      ))}

      {/* Floating chip — shows for front card */}
      <div className={styles.orbitChip}>
        <span className={styles.orbitChipDot}/>
        <div>
          <div className={styles.chipTitle}>Arjun Rawat — Hired</div>
          <div className={styles.chipSub}>Joined Google · 14 days via HIREON</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Home ─── */
export const Home = () => {
  const canvasRef = useRef(null);
  useBackground(canvasRef);
  const { cr, fr } = useCursor();

  return (
    <div className={styles.page}>
      <div className={styles.cursor}         ref={cr}/>
      <div className={styles.cursorFollower} ref={fr}/>
      <canvas ref={canvasRef} className={styles.bgCanvas}/>

      <section className={styles.hero}>
        {/* LEFT */}
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
          <div className={styles.portalRow}>
            <Link to="/Candidate/01_Candidate" className={styles.portalCandidate}>
              <div>
                <div className={styles.portalLabel}>I'm a Candidate</div>
                <div className={styles.portalSub}>Find your dream job</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <Link to="/Recruiter/01_Recruiter" className={styles.portalRecruiter}>
              <div>
                <div className={styles.portalLabel}>I'm a Recruiter</div>
                <div className={styles.portalSub}>Post and hire talent</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className={styles.bullets}>
            {[
              {t:"AI-powered matching",            s:"designed for faster, smarter hiring."},
              {t:"Resume analysis & ATS scoring",  s:"to maximise shortlisting chances."},
              {t:"Real-time application tracking", s:"from apply to offer."},
            ].map((b,i) => (
              <div key={i} className={styles.bl}>
                <div className={styles.blDot}/>
                <span><strong>{b.t}</strong> {b.s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Orbital Carousel */}
        <div className={styles.heroRight}>
          <OrbitalCarousel/>
        </div>
      </section>

      {/* TICKER */}
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
