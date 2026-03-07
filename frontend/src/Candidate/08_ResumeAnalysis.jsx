import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const ResumeAnalysis = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>AI Powered</div>
        <h1 className={styles.heroTitle}>AI Resume <span className={styles.grad}>Analysis</span></h1>
        <p className={styles.heroSub}>Upload your resume and our AI will analyze it instantly, giving you a detailed score and personalized improvement suggestions.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadIcon}>🧠</span>
          <h3>Upload Your Resume</h3>
          <p>Supported formats: PDF, DOCX. Max size 5MB. Get your full analysis report in seconds.</p>
          <button className={styles.uploadBtn}>Choose File to Analyze</button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>✅</span><h4>Instant Scoring</h4><p>Get a score out of 100 based on content, formatting, keywords and overall readability.</p></div>
          <div className={styles.infoCard}><span>🔍</span><h4>Keyword Analysis</h4><p>See which important keywords are missing from your resume for your target role.</p></div>
          <div className={styles.infoCard}><span>💡</span><h4>Smart Suggestions</h4><p>Receive specific actionable suggestions to improve every single section of your resume.</p></div>
          <div className={styles.infoCard}><span>📈</span><h4>Industry Benchmarking</h4><p>Compare your resume against top candidates in your industry and see exactly where you stand.</p></div>
        </div>
      </div>
    </div>
  );
};
