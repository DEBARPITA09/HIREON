import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./06_MainCand.module.css";

const SERVICES = [
  {
    id: "resume-builder",
    icon: "📄",
    title: "Resume Builder",
    desc: "Build an ATS-optimised resume with AI assistance. Tailored to your target role.",
    tag: "AI Powered",
    tagColor: "#8ab4f8",
    path: "/Candidate/services/resume-builder",
  },
  {
    id: "resume-analysis",
    icon: "🔍",
    title: "Resume Analysis",
    desc: "Deep AI analysis of your resume — get a detailed breakdown of strengths and gaps.",
    tag: "Instant Results",
    tagColor: "#81e6a0",
    path: "/Candidate/services/resume-analysis",
  },
  {
    id: "ats-checker",
    icon: "⚡",
    title: "ATS Checker",
    desc: "Score your resume against any job description. Beat the bots before the humans see it.",
    tag: "Score Your CV",
    tagColor: "#fbbf24",
    path: "/Candidate/services/ats-checker",
  },
  {
    id: "job-matching",
    icon: "🎯",
    title: "Job Matching",
    desc: "AI matches you to roles that fit your profile. No more cold applying.",
    tag: "94% Accuracy",
    tagColor: "#c084fc",
    path: "/Candidate/services/job-matching",
  },
  {
    id: "application-tracker",
    icon: "📊",
    title: "Application Tracker",
    desc: "Track every application from applied to offer. Never lose track of an opportunity.",
    tag: "Real-Time",
    tagColor: "#8ab4f8",
    path: "/Candidate/services/application-tracker",
  },
  {
    id: "dsa-aptitude",
    icon: "💻",
    title: "DSA & Aptitude",
    desc: "Practice data structures, algorithms, and aptitude questions for top tech interviews.",
    tag: "500+ Problems",
    tagColor: "#81e6a0",
    path: "/Candidate/services/dsa-aptitude",
  },
  {
    id: "ai-interview",
    icon: "🎤",
    title: "AI Interview",
    desc: "Simulate real interviews with AI. Get instant feedback on your answers and delivery.",
    tag: "Live Feedback",
    tagColor: "#fbbf24",
    path: "/Candidate/services/ai-interview",
  },
  {
    id: "profile-management",
    icon: "👤",
    title: "Profile Management",
    desc: "Keep your profile updated. A complete profile gets 3× more recruiter views.",
    tag: "Visibility Boost",
    tagColor: "#c084fc",
    path: "/Candidate/services/profile-management",
  },
];

const STATS = [
  { value: "7",    label: "AI Tools" },
  { value: "100%", label: "Free Forever" },
  { value: "ATS",  label: "Optimised" },
];

export const CandidateMain = () => {
  const navigate  = useNavigate();
  const [active, setActive] = useState("dashboard");

  // Pull name from Firebase auth if available, fallback gracefully
  const user = null; // replace with: const { user } = useAuth();
  const displayName = user?.displayName || "Candidate";
  const initials    = displayName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  const handleSignOut = () => {
    // signOut(auth).then(() => navigate("/"));
    navigate("/");
  };

  return (
    <div className={styles.page}>

      {/* ── TOPBAR ── */}
      <header className={styles.topbar}>
        <Link to="/" className={styles.topbarLogo}>
          <div className={styles.topbarLogoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </Link>
        <div className={styles.topbarRight}>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>{initials}</div>
            <span className={styles.userName}>{displayName}</span>
          </div>
          <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className={styles.layout}>

        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <span className={styles.sideLabel}>Menu</span>
          {[
            { id:"dashboard", label:"Dashboard",    icon:"⊞" },
            { id:"profile",   label:"My Profile",   icon:"◯" },
          ].map(s => (
            <button
              key={s.id}
              className={`${styles.sideLink} ${active===s.id ? styles.sideLinkActive : ""}`}
              onClick={() => {
                setActive(s.id);
                if(s.id==="profile") navigate("/Candidate/services/profile-management");
              }}
            >
              <span className={styles.sideLinkIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}

          <span className={styles.sideLabel} style={{marginTop:"1rem"}}>Services</span>
          {SERVICES.map(s => (
            <button
              key={s.id}
              className={`${styles.sideLink} ${active===s.id ? styles.sideLinkActive : ""}`}
              onClick={() => { setActive(s.id); navigate(s.path); }}
            >
              <span className={styles.sideLinkIcon}>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </aside>

        {/* ── MAIN ── */}
        <main className={styles.main}>

          {/* Page header */}
          <div className={styles.pageHeader}>
            <div className={styles.pageBadge}>
              <span className={styles.pageBadgeDot}/>
              Candidate Dashboard
            </div>
            <h1 className={styles.pageTitle}>
              One Profile.<br/>
              <em>Endless Opportunities.</em>
            </h1>
            <p className={styles.pageSub}>
              Every tool below is powered by AI to help you craft the perfect
              resume, beat ATS filters, and land your dream role faster.
            </p>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Services section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.cardsGrid}>
              {SERVICES.map(s => (
                <div
                  key={s.id}
                  className={styles.card}
                  onClick={() => navigate(s.path)}
                >
                  <div className={styles.cardIcon}
                    style={{ background: `${s.tagColor}18`, border: `1px solid ${s.tagColor}30` }}>
                    <span style={{fontSize:"1.15rem"}}>{s.icon}</span>
                  </div>
                  <div className={styles.cardTitle}>{s.title}</div>
                  <div className={styles.cardDesc}>{s.desc}</div>
                  <span className={styles.cardTag}
                    style={{ color: s.tagColor, borderColor: `${s.tagColor}40`, background: `${s.tagColor}12` }}>
                    {s.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};