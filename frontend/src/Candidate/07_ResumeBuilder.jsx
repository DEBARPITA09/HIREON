import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const ResumeBuilder = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/04_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>Easy Build</div>
        <h1 className={styles.heroTitle}>Resume <span className={styles.grad}>Builder</span></h1>
        <p className={styles.heroSub}>Build a clean, professional and ATS-friendly resume from scratch using our guided step-by-step builder.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadIcon}>📝</span>
          <h3>Start Building Your Resume</h3>
          <p>Follow our guided steps to fill in your details and we will generate a polished, professional resume for you.</p>
          <button className={styles.uploadBtn}>Start Building Now</button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>🗂️</span><h4>Multiple Templates</h4><p>Choose from a variety of clean professional resume templates designed to impress recruiters.</p></div>
          <div className={styles.infoCard}><span>🧩</span><h4>Guided Sections</h4><p>Fill in each section step by step including education, experience, skills and projects.</p></div>
          <div className={styles.infoCard}><span>📄</span><h4>PDF Export</h4><p>Download your completed resume as a perfectly formatted PDF file ready to submit anywhere.</p></div>
          <div className={styles.infoCard}><span>🎨</span><h4>ATS Friendly Design</h4><p>All templates are tested against ATS systems to ensure maximum compatibility and readability.</p></div>
        </div>
      </div>
    </div>
  );
};
