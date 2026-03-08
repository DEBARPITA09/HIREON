import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CandService.module.css";

export const ProfileManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user ? user.name : "Candidate";
  const email = user ? user.email : "your@email.com";

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back to Dashboard</button>
        <div className={styles.topLogo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}></span>My Profile</div>
        <h1 className={styles.heroTitle}>Profile <span className={styles.grad}>Management</span></h1>
        <p className={styles.heroSub}>Build a compelling professional profile so recruiters can discover you directly based on your skills and experience.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadIcon}>👤</span>
          <h3>{name}</h3>
          <p>{email}</p>
          <button className={styles.uploadBtn}>Edit Profile</button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}><span>📸</span><h4>Profile Photo</h4><p>Add a professional photo to make your profile stand out to recruiters browsing candidates.</p></div>
          <div className={styles.infoCard}><span>🛠️</span><h4>Skills Section</h4><p>List your technical and soft skills so the AI can match you with the most relevant job listings.</p></div>
          <div className={styles.infoCard}><span>🎓</span><h4>Education Details</h4><p>Add your academic background, degrees and certifications to complete your professional profile.</p></div>
          <div className={styles.infoCard}><span>💼</span><h4>Work Experience</h4><p>Add your past work experience and internships to give recruiters a full picture of your background.</p></div>
        </div>
      </div>
    </div>
  );
};
