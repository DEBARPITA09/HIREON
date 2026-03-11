import React from "react";
import { Link } from "react-router-dom";
import styles from "./02_Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoSq}>H</div>
            <span className={styles.logoWord}>HIRE<span>ON</span></span>
          </Link>
          <p>AI-powered hiring for candidates and recruiters. Smarter resumes. Better matches. Faster decisions.</p>
          <div className={styles.tagline}>
            <span className={styles.dot}></span>
            Built in Odisha, India
          </div>
        </div>

        <div className={styles.linksGroup}>

          <div className={styles.col}>
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help Center</Link>
          </div>

          <div className={styles.col}>
            <h4>Portals</h4>
            <Link to="/Candidate/01_Candidate">Candidate Portal</Link>
            <Link to="/Recruiter/01_Recruiter">Recruiter Portal</Link>
          </div>

          <div className={styles.col}>
            <h4>Contact</h4>
            <span>support@hireon.com</span>
            <span>+91 98765 43210</span>
            <span>Bhubaneswar, Odisha</span>
          </div>

        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} HIREON. All rights reserved.</p>
        <p>Made with care for smarter hiring.</p>
      </div>
    </footer>
  );
};
