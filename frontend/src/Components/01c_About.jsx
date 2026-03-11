import React from "react";
import styles from "./01c_About.module.css";

export const About = () => {
  return (
    <div className={styles.page}>

      {/* HERO */}
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
          and never hear back. Recruiters drown in irrelevant applications. We built
          HIREON to solve both sides of this problem at once.
        </p>
      </div>

      {/* MISSION */}
      <div className={styles.missionRow}>
        <div className={styles.missionCard}>
          <div className={styles.missionIcon}>🚀</div>
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

      {/* STATS */}
      <div className={styles.statsRow}>
        {[
          { v: '3.2M+', l: 'Candidates', sub: 'Registered on platform' },
          { v: '48K+',  l: 'Companies',  sub: 'Actively hiring' },
          { v: '94%',   l: 'Match Rate', sub: 'AI accuracy score' },
          { v: '14d',   l: 'Avg. Hire',  sub: 'From apply to offer' },
        ].map(s => (
          <div key={s.l} className={styles.statCard}>
            <div className={styles.statVal}>{s.v}</div>
            <div className={styles.statLabel}>{s.l}</div>
            <div className={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* VALUES */}
      <div className={styles.valuesSection}>
        <div className={styles.sectionLabel}>What We Stand For</div>
        <div className={styles.valuesGrid}>

          <div className={styles.valueCard}>
            <span className={styles.valueIcon}>🤖</span>
            <h3>AI at the Core</h3>
            <p>Every feature is backed by intelligent algorithms. From resume scoring to job matching, we don't just digitise hiring — we elevate it.</p>
          </div>

          <div className={styles.valueCard}>
            <span className={styles.valueIcon}>🔒</span>
            <h3>Trust and Privacy</h3>
            <p>Your data belongs to you. We follow strict privacy standards so candidates and recruiters can engage with complete confidence.</p>
          </div>

          <div className={styles.valueCard}>
            <span className={styles.valueIcon}>⚡</span>
            <h3>Speed and Clarity</h3>
            <p>No waiting, no confusion. Candidates hear back faster and recruiters move through pipelines without bottlenecks slowing them down.</p>
          </div>

          <div className={styles.valueCard}>
            <span className={styles.valueIcon}>🌍</span>
            <h3>Built for India</h3>
            <p>Designed from the ground up for the Indian job market — understanding its scale, diversity and the aspirations of millions of job seekers.</p>
          </div>

        </div>
      </div>

      {/* STORY TIMELINE */}
      <div className={styles.timelineSection}>
        <div className={styles.sectionLabel}>Our Story</div>
        <div className={styles.timeline}>
          {[
            { y: 'The Problem', t: 'Broken Hiring', d: 'We saw talented candidates getting rejected by ATS bots before any human ever read their resume. Recruiters were drowning in irrelevant applications with no smart filter.' },
            { y: 'The Idea', t: 'HIREON is Born', d: 'A team of engineers and designers set out to build a platform that uses real AI to match people to opportunities, not just keywords to job descriptions.' },
            { y: 'The Build', t: 'Platform Launch', d: 'Built with React, AI resume analysis, ATS scoring, job matching algorithms, and a recruiter dashboard — all designed for India\'s job market.' },
            { y: 'The Vision', t: 'Hiring Reimagined', d: 'A future where every candidate gets a fair shot and every recruiter finds the right person — faster, smarter and without the noise.' },
          ].map((item, i) => (
            <div key={i} className={styles.tlItem}>
              <div className={styles.tlDot}></div>
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
