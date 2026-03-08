import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const JobMatching = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>Recommended</div>
        <h1 className={styles.heroTitle}>Job <span className={styles.grad}>Recommendations</span></h1>
        <p className={styles.heroSub}>Our AI engine reads your profile and surfaces the most relevant job opportunities tailored specifically for you.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadIcon}>🎯</span>
          <h3>Find Jobs Matched For You</h3>
          <p>Tell us your skills, experience level and preferred location to get your best matched job listings.</p>
          <button className={styles.uploadBtn}>Find My Jobs</button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>🤝</span><h4>Skill Match</h4><p>Jobs are matched based on the specific skills listed in your profile and uploaded resume.</p></div>
          <div className={styles.infoCard}><span>📍</span><h4>Location Filter</h4><p>Find jobs near you or filter by remote, hybrid or on-site work preferences easily.</p></div>
          <div className={styles.infoCard}><span>💰</span><h4>Salary Range</h4><p>Only see jobs that match your expected salary range so you never waste time applying.</p></div>
          <div className={styles.infoCard}><span>⚡</span><h4>Real Time Results</h4><p>Job recommendations update in real time as new listings are added by recruiters on HIREON.</p></div>
        </div>
      </div>
    </div>
  );
};
