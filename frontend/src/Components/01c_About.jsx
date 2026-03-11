import React from "react";
import styles from "./01c_About.module.css";

export const About = () => (
  <div className={styles.page}>

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

    {/* STATS */}
    <div className={styles.section}>
      <div className={styles.statsRow}>
        {[{n:"3.2L+",l:"Candidates Placed"},{n:"94%",l:"Match Accuracy"},{n:"14 Days",l:"Average Time to Hire"}].map(s=>(
          <div key={s.l} className={styles.statCard}>
            <div className={styles.statNum}>{s.n}</div>
            <div className={styles.statLabel}>{s.l}</div>
          </div>
        ))}
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