import React from "react";
import { Link } from "react-router-dom";
import styles from "./01_Candidate.module.css";

export const CandidateHomePage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>

        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Candidate Portal
        </div>

        <h1 className={styles.title}>Welcome Back,<br /><span className={styles.grad}>Candidate</span></h1>
        <p className={styles.sub}>Your next opportunity is waiting. Sign in to continue your journey or create a new account to get started.</p>

        <div className={styles.btnGroup}>
          <Link to="/Candidate/02_LoginCand" className={styles.btnPrimary}>Sign In</Link>
          <Link to="/Candidate/03_SignupCand" className={styles.btnSecondary}>Create Account</Link>
        </div>

        <p className={styles.footer}>
          Are you a recruiter?
          <Link to="/Recruiter/01_Recruiter" className={styles.switchLink}>Switch to Recruiter</Link>
        </p>
      </div>
    </div>
  );
};
