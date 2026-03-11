import React from "react";
import styles from "./01c_About.module.css";

export const About = () => {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          About HIREON
        </div>
        <h1 className={styles.heroTitle}>
          Reimagining Hiring for the <span className={styles.grad}>Modern World</span>
        </h1>
        <p className={styles.heroSub}>
          HIREON was built to fix the broken hiring experience. Candidates apply blindly
          and never hear back. Recruiters drown in irrelevant applications.
          We built HIREON to solve both sides of this problem at once.
        </p>
      </div>

      {/* MISSION */}
      <div className={styles.section}>
        <div className={styles.missionCard}>
          <div className={styles.missionIconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className={styles.missionText}>
            <h2>Our Mission</h2>
            <p>
              To make the journey from job seeker to employee — and from job post to hired candidate —
              as intelligent, transparent and frictionless as possible. We believe every person deserves
              a fair shot at the right opportunity, and every recruiter deserves tools that actually save them time.
            </p>
            <p>
              HIREON uses AI-driven resume analysis, ATS scoring and smart job matching to bridge the
              critical gap between talent and opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>What We Stand For</div>
        <div className={styles.valuesGrid}>

          <div className={styles.valueCard}>
            <div className={styles.valueIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <h3>AI at the Core</h3>
            <p>Every feature is backed by intelligent algorithms. From resume scoring to job matching, we don't just digitise hiring — we elevate it.</p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Trust and Privacy</h3>
            <p>Your data belongs to you. We follow strict privacy standards so candidates and recruiters can engage with complete confidence.</p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3>Speed and Clarity</h3>
            <p>No waiting, no confusion. Candidates hear back faster and recruiters move through pipelines without bottlenecks slowing them down.</p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3>Built for India</h3>
            <p>Designed from the ground up for the Indian job market — understanding its scale, diversity and the aspirations of millions of job seekers.</p>
          </div>

        </div>
      </div>

      {/* STORY */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Our Story</div>
        <div className={styles.timeline}>
          {[
            { y: 'The Problem', t: 'Broken Hiring', d: 'Talented candidates were getting rejected by ATS bots before any human ever read their resume. Recruiters were drowning in irrelevant applications with no smart filter.' },
            { y: 'The Idea',    t: 'HIREON is Born',      d: 'A team of engineers and designers set out to build a platform that uses real AI to match people to opportunities — not just keywords to job descriptions.' },
            { y: 'The Build',   t: 'Platform Built',      d: 'Built with React, AI resume analysis, ATS scoring, job matching algorithms, and a recruiter dashboard — all designed for India\'s job market.' },
            { y: 'The Vision',  t: 'Hiring Reimagined',   d: 'A future where every candidate gets a fair shot and every recruiter finds the right person — faster, smarter and without the noise.' },
          ].map((item, i) => (
            <div key={i} className={styles.tlItem}>
              <div className={styles.tlLeft}>
                <div className={styles.tlDot}></div>
                {i < 3 && <div className={styles.tlLine}></div>}
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
