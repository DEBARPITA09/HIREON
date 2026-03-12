import React from "react";
import styles from "./01c_About.module.css";

export const About = () => {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          About Us
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

      <div className={styles.missionRow}>
        <div className={styles.missionCard}>
          <div className={styles.missionIcon}>🚀</div>
          <div className={styles.missionText}>
            <h2>Our Mission</h2>
            <p>
              To make the journey from job seeker to employee and from job post to
              hired candidate as intelligent, transparent and frictionless as possible.
              We believe every person deserves a fair shot at the right opportunity,
              and every recruiter deserves tools that actually save them time.
            </p>
            <p>
              HIREON is a final year engineering mini project built with real world
              intent. We use AI driven resume analysis, ATS scoring and smart job
              matching to bridge the critical gap between talent and opportunity.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.valuesSection}>
        <div className={styles.sectionLabel}>What We Stand For</div>
        <div className={styles.valuesGrid}>

          <div className={styles.valueCard}>
            <span className={styles.valueIcon}>🤖</span>
            <h3>AI at the Core</h3>
            <p>Every feature is backed by intelligent algorithms. From resume scoring to job matching, we do not just digitise hiring, we elevate it.</p>
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
            <p>Designed from the ground up for the Indian job market, understanding its scale, diversity and the aspirations of millions of job seekers.</p>
          </div>

        </div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.sectionLabel}>The Team</div>
        <div className={styles.teamGrid}>

          <div className={styles.teamCard}>
            <div className={styles.avatarBlue}>D</div>
            <h4>Debarpita</h4>
            <p>Frontend Development</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarGreen}>M</div>
            <h4>Manoranjan</h4>
            <p>UI / UX Design</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarPurple}>A</div>
            <h4>Ananya</h4>
            <p>Backend Development</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarOrange}>R</div>
            <h4>Rounaq</h4>
            <p>ML and AI Integration</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarTeal}>J</div>
            <h4>Jyotiraj</h4>
            <p>Database and API Design</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatarPink}>A</div>
            <h4>Aditi</h4>
            <p>Testing and QA</p>
          </div>

        </div>
      </div>

    </div>
  );
};
