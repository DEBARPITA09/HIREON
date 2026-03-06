import React from "react";
import { Link } from "react-router-dom";
import styles from "./01_Recruiter.module.css";

export const RecruiterHomePage = () => {
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
          Recruiter Portal
        </div>

        <h1 className={styles.title}>Welcome Back,<br /><span className={styles.grad}>Recruiter</span></h1>
        <p className={styles.sub}>Find the best talent for your team. Sign in to manage your job postings or create a new account to get started.</p>

        <div className={styles.btnGroup}>
          <Link to="/Recruiter/02_LoginRec" className={styles.btnPrimary}>Sign In</Link>
          <Link to="/Recruiter/03_SignupRec" className={styles.btnSecondary}>Create Account</Link>
        </div>

        <p className={styles.footer}>
          Are you a candidate?
          <Link to="/Candidate/01_Candidate" className={styles.switchLink}>Switch to Candidate</Link>
        </p>
      </div>
    </div>
  );
};
