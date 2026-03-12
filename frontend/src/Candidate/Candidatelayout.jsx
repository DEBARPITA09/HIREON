import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./CandidateLayout.module.css";

const NAV_ITEMS = [
  { id:"dashboard",           label:"Dashboard",          icon:"⊞", path:"/Candidate/06_MainCand" },
  { id:"profile-management",  label:"My Profile",         icon:"◯", path:"/Candidate/services/profile-management" },
];

const SERVICE_ITEMS = [
  { id:"resume-builder",      label:"Resume Builder",     icon:"📄", path:"/Candidate/services/resume-builder" },
  { id:"resume-analysis",     label:"Resume Analysis",    icon:"🔍", path:"/Candidate/services/resume-analysis" },
  { id:"ats-checker",         label:"ATS Checker",        icon:"⚡", path:"/Candidate/services/ats-checker" },
  { id:"job-matching",        label:"Job Matching",       icon:"🎯", path:"/Candidate/services/job-matching" },
  { id:"application-tracker", label:"Application Tracker",icon:"📊", path:"/Candidate/services/application-tracker" },
  { id:"dsa-aptitude",        label:"DSA & Aptitude",     icon:"💻", path:"/Candidate/services/dsa-aptitude" },
  { id:"ai-interview",        label:"AI Interview",       icon:"🎤", path:"/Candidate/services/ai-interview" },
];

export const CandidateLayout = ({ children, title }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Replace with: const { user } = useAuth(); when Firebase is wired
  const displayName = "Candidate";
  const initials    = "C";

  const handleSignOut = () => {
    // signOut(auth).then(() => navigate("/"));
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.page}>

      {/* TOPBAR */}
      <header className={styles.topbar}>
        <Link to="/" className={styles.topbarLogo}>
          <div className={styles.topbarLogoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </Link>
        {title && <span className={styles.topbarTitle}>{title}</span>}
        <div className={styles.topbarRight}>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>{initials}</div>
            <span className={styles.userName}>{displayName}</span>
          </div>
          <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {/* BODY */}
      <div className={styles.layout}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <span className={styles.sideLabel}>Navigation</span>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.sideLink} ${isActive(item.path) ? styles.sideLinkActive : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.sideLinkIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <span className={styles.sideLabel} style={{marginTop:"1rem"}}>Services</span>
          {SERVICE_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.sideLink} ${isActive(item.path) ? styles.sideLinkActive : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.sideLinkIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* CONTENT */}
        <main className={styles.main}>
          {children}
        </main>

      </div>
    </div>
  );
};