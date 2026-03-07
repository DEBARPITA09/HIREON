import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./06_MainCand.module.css";

const services = [
  { icon: "📝", title: "Resume Builder", desc: "Build a clean, professional and ATS-friendly resume from scratch using our guided step-by-step builder.", tag: "Easy Build", color: "blue", path: "/Candidate/services/resume-builder" },
  { icon: "🧠", title: "AI Resume Analysis", desc: "Upload your resume and get a detailed AI breakdown of strengths, gaps, keyword matches and improvement tips.", tag: "AI Powered", color: "teal", path: "/Candidate/services/resume-analysis" },
  { icon: "📊", title: "ATS Score and Insights", desc: "See how Applicant Tracking Systems score your resume and get suggestions to increase your shortlisting chances.", tag: "Smart Score", color: "blue", path: "/Candidate/services/ats-checker" },
  { icon: "🎯", title: "Job Recommendations", desc: "Our algorithm matches your profile against live listings and surfaces the most relevant roles for your skills.", tag: "Recommended", color: "teal", path: "/Candidate/services/job-matching" },
  { icon: "📬", title: "Application Status", desc: "Track every job from submitted to shortlisted to rejected, all in one clean real-time dashboard view.", tag: "Stay Updated", color: "blue", path: "/Candidate/services/application-tracker" },
  { icon: "👤", title: "Profile Management", desc: "Build a compelling professional profile. Recruiters discover you directly based on your skills and experience.", tag: "My Profile", color: "teal", path: "/Candidate/services/profile-management" },
];

export const CandidateMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user ? user.name : "Candidate";

  const handleLogout = () => {
    navigate("/Candidate/02_LoginCand");
  };

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <div className={styles.topLogo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.topRight}>
          <span className={styles.welcomeText}>Welcome, {name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          Candidate Dashboard
        </div>
        <h1 className={styles.heroTitle}>
          Your Career <span className={styles.grad}>Services</span>
        </h1>
        <p className={styles.heroSub}>
          Pick any service below to get started. Each tool is powered by AI to help you land your dream job faster.
        </p>
      </div>

      <div className={styles.grid}>
        {services.map(function(s) {
          return (
            <div
              key={s.title}
              className={s.color === "blue" ? styles.cardBlue : styles.cardTeal}
              onClick={() => navigate(s.path)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{s.icon}</span>
                <span className={s.color === "blue" ? styles.tagBlue : styles.tagTeal}>{s.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <div className={styles.cardAction}>
                <span>Get Started</span>
                <span className={styles.arrow}>→</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
