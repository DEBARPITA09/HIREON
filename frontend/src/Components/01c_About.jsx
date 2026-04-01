import React, { useRef, useEffect } from "react";
import styles from "./01c_About.module.css";


/* ─── Floating Particle Background ─── */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00018, vy: (Math.random() - 0.5) * 0.00018,
      r: 0.6 + Math.random() * 1.6, a: 0.1 + Math.random() * 0.32, ph: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const pulse = 0.82 + 0.18 * Math.sin(t * 0.016 + p.ph);
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a * pulse})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.08) {
          ctx.beginPath(); ctx.moveTo(pts[i].x * W, pts[i].y * H); ctx.lineTo(pts[j].x * W, pts[j].y * H);
          ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - d / 0.08)})`; ctx.lineWidth = 0.4; ctx.stroke();
        }
      }
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

export const About = () => {
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  return (
  <div className={styles.page}>
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />

    {/* HERO */}
    <div className={styles.hero}>
      <div className={styles.heroBadge}><span className={styles.dot}/> About HIREON</div>
      <h1 className={styles.heroTitle}>
        Reimagining Hiring for the<br/>
        <span className={styles.italic}>Modern World</span>
      </h1>
      <p className={styles.heroSub}>
        HIREON was built to fix the broken hiring experience. Candidates apply blindly and never hear back.
        Recruiters drown in irrelevant applications. We built HIREON to solve both sides at once.
      </p>
    </div>

    {/* WHAT WE BELIEVE */}
    <div className={styles.beliefStrip}>
      <div className={styles.beliefItem}>
        <div className={styles.beliefIcon}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className={styles.beliefText}>
          <div className={styles.beliefTitle}>AI at the Core</div>
          <div className={styles.beliefDesc}>Every match, every score, every suggestion is driven by intelligence — not guesswork.</div>
        </div>
      </div>
      <div className={styles.beliefDivider}/>
      <div className={styles.beliefItem}>
        <div className={styles.beliefIcon}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div className={styles.beliefText}>
          <div className={styles.beliefTitle}>Built for India</div>
          <div className={styles.beliefDesc}>Designed from the ground up for India's scale, diversity, and the aspirations of millions of job seekers.</div>
        </div>
      </div>
      <div className={styles.beliefDivider}/>
      <div className={styles.beliefItem}>
        <div className={styles.beliefIcon}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div className={styles.beliefText}>
          <div className={styles.beliefTitle}>Zero Friction</div>
          <div className={styles.beliefDesc}>No black holes. No long waits. Candidates hear back and recruiters move fast — both sides win.</div>
        </div>
      </div>
    </div>

    {/* MISSION */}
    <div className={styles.section}>
      <div className={styles.missionCard}>
        <div className={styles.missionIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className={styles.missionText}>
          <h2>Our Mission</h2>
          <p>To make the journey from job seeker to employee — and from job post to hired candidate — as intelligent, transparent and frictionless as possible. We believe every person deserves a fair shot at the right opportunity.</p>
          <p>HIREON uses AI-driven resume analysis, ATS scoring and smart job matching to bridge the critical gap between talent and opportunity.</p>
        </div>
      </div>
    </div>

    {/* VALUES */}
    <div className={styles.section}>
      <div className={styles.sectionLabel}>What We Stand For</div>
      <div className={styles.valuesGrid}>
        {[
          { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, t:"AI at the Core", d:"Every feature is backed by intelligent algorithms. From resume scoring to job matching, we don't just digitise hiring — we elevate it." },
          { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, t:"Trust and Privacy", d:"Your data belongs to you. We follow strict privacy standards so candidates and recruiters can engage with complete confidence." },
          { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, t:"Speed and Clarity", d:"No waiting, no confusion. Candidates hear back faster and recruiters move through pipelines without bottlenecks." },
          { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, t:"Built for India", d:"Designed from the ground up for the Indian job market — understanding its scale, diversity and aspirations of millions." },
        ].map((v,i)=>(
          <div key={i} className={styles.valueCard}>
            <div className={styles.valueIconWrap}>{v.icon}</div>
            <h3>{v.t}</h3>
            <p>{v.d}</p>
          </div>
        ))}
      </div>
    </div>

    {/* TIMELINE */}
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Our Story</div>
      <div className={styles.timeline}>
        {[
          {y:"The Problem", t:"Broken Hiring",       d:"Talented candidates were rejected by ATS bots before any human read their resume. Recruiters drowned in irrelevant applications with no smart filter."},
          {y:"The Idea",    t:"HIREON is Born",       d:"A team of engineers and designers set out to build a platform using real AI to match people to opportunities — not just keywords to job descriptions."},
          {y:"The Build",   t:"Platform Built",       d:"Built with React, AI resume analysis, ATS scoring, job matching algorithms, and a recruiter dashboard — all designed for India's job market."},
          {y:"The Vision",  t:"Hiring Reimagined",    d:"A future where every candidate gets a fair shot and every recruiter finds the right person — faster, smarter and without the noise."},
        ].map((item,i)=>(
          <div key={i} className={styles.tlItem}>
            <div className={styles.tlLeft}>
              <div className={styles.tlDot}/>
              {i<3 && <div className={styles.tlLine}/>}
            </div>
            <div className={styles.tlContent}>
              <div className={styles.tlYear}>{item.y}</div>
              <div className={styles.tlTitle}>{item.t}</div>
              <div className={styles.tlDesc}>{item.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
  );
};