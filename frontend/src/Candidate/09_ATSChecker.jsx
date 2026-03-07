import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const ATSChecker = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>Smart Score</div>
        <h1 className={styles.heroTitle}>ATS Score <span className={styles.grad}>and Insights</span></h1>
        <p className={styles.heroSub}>Find out how well your resume passes the Applicant Tracking Systems used by top companies before a human ever sees it.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadIcon}>📊</span>
          <h3>Check Your ATS Score</h3>
          <p>Upload your resume and paste the job description to get a full ATS compatibility score.</p>
          <button className={styles.uploadBtn}>Upload Resume</button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>🤖</span><h4>ATS Simulation</h4><p>We simulate how real ATS software reads your resume and flag anything that gets filtered out.</p></div>
          <div className={styles.infoCard}><span>🔑</span><h4>Keyword Match</h4><p>Paste any job description and see how many key terms from it appear in your resume.</p></div>
          <div className={styles.infoCard}><span>🚫</span><h4>Format Issues</h4><p>Detect tables, graphics and fonts that confuse ATS scanners and get specific fix suggestions.</p></div>
          <div className={styles.infoCard}><span>📋</span><h4>Section Check</h4><p>Ensure all required resume sections are present and correctly labeled for ATS parsing.</p></div>
        </div>
      </div>
    </div>
  );
};
