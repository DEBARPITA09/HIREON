import React from "react";
import { Link } from "react-router-dom";
import styles from "./02_Footer.module.css";

const HIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkArrow = () => (
  <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const MARQUEE_ITEMS = [
  "AI-Powered Hiring", "Smart Resume Analysis", "ATS Score Optimisation",
  "Candidate Matching", "Recruiter Dashboard", "Built for India",
  "Fast. Fair. Frictionless.", "Your Career Starts Here",
];

export const Footer = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // duplicate for seamless loop

  return (
    <footer className={styles.footer}>

      {/* ── SCROLLING MARQUEE ── */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {items.map((text, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeText}>{text}</span>
              <span className={styles.marqueeSep}/>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.body}>

        {/* BRAND */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoSq}><HIcon/></div>
            <span className={styles.logoWord}>HIRE<span>ON</span></span>
          </Link>

          <p className={styles.tagline}>
            AI-powered hiring for candidates and recruiters. Smarter resumes. Better matches. Faster decisions.
          </p>

          <div className={styles.locationPill}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Bhubaneswar, Odisha, India</span>
          </div>

          <div className={styles.socials}>
            {/* LinkedIn */}
            <a href="#" className={styles.socialBtn} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className={styles.socialBtn} aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M4 20L20 4"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className={styles.socialBtn} aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" className={styles.socialBtn} aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
          </div>
        </div>

        {/* PLATFORM */}
        <div className={styles.linkCol}>
          <div className={styles.colHead}>Platform</div>
          <Link to="/"><span>Home</span><LinkArrow/></Link>
          <Link to="/about"><span>About Us</span><LinkArrow/></Link>
          <Link to="/contact"><span>Contact</span><LinkArrow/></Link>
          <Link to="/help"><span>Help Center</span><LinkArrow/></Link>
        </div>

        {/* PORTALS */}
        <div className={styles.linkCol}>
          <div className={styles.colHead}>Portals</div>
          <Link to="/Candidate/01_Candidate"><span>Candidate Portal</span><LinkArrow/></Link>
          <Link to="/Recruiter/01_Recruiter"><span>Recruiter Portal</span><LinkArrow/></Link>
          <Link to="/help"><span>FAQs</span><LinkArrow/></Link>
          <Link to="/contact"><span>Support</span><LinkArrow/></Link>
        </div>

        {/* CONTACT */}
        <div className={styles.linkCol}>
          <div className={styles.colHead}>Get in Touch</div>
          <div className={styles.contactItem}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            support@hireon.com
          </div>
          <div className={styles.contactItem}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.31h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.77-1.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +91 98765 43210
          </div>
          <div className={styles.contactItem}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Mon–Fri, 9am–6pm IST
          </div>
        </div>

      </div>

      {/* ── DIVIDER ── */}
      <div className={styles.divider}/>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} <strong>HIREON</strong>. All rights reserved.
        </p>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
        <div className={styles.madeBadge}>
          Made with <span className={styles.heartPulse}>♥</span> in India
        </div>
      </div>

      {/* ── STATUS STRIP ── */}
      <div className={styles.statusStrip}>
        <div className={styles.statusDot}/>
        <span className={styles.statusText}>
          All systems operational — <strong>hireon.com</strong> is live and running
        </span>
      </div>

    </footer>
  );
};