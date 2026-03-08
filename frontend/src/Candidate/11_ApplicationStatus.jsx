import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const ApplicationTracker = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>Stay Updated</div>
        <h1 className={styles.heroTitle}>Application <span className={styles.grad}>Status</span></h1>
        <p className={styles.heroSub}>Keep track of every job you have applied to in one place and always know which stage each application is currently at.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.comingSoon}>
          <span>📬</span>
          <h3>Your Applications Will Appear Here</h3>
          <p>Once you apply to jobs through HIREON, all your applications and their live status updates will be tracked here automatically in real time.</p>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>📋</span><h4>All Applications</h4><p>See every job you applied to in a clean organised list with company name, role and date applied.</p></div>
          <div className={styles.infoCard}><span>🔄</span><h4>Live Status Updates</h4><p>Track real time stages: Submitted, In Review, Shortlisted, Interview Scheduled or Rejected.</p></div>
          <div className={styles.infoCard}><span>🗓️</span><h4>Interview Dates</h4><p>View your scheduled interview dates and times directly inside your application tracker.</p></div>
          <div className={styles.infoCard}><span>🗑️</span><h4>Withdraw Anytime</h4><p>Withdraw any application you no longer wish to pursue with a single click from your dashboard.</p></div>
        </div>
      </div>
    </div>
  );
};
