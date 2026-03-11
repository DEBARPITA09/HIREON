import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./06_MainCand.module.css";

const services = [
  { icon: "📝", title: "Resume Builder",         desc: "Build a clean, professional and ATS-friendly resume from scratch using our guided step-by-step builder.", tag: "Easy Build",   color: "blue", path: "/Candidate/services/resume-builder"    },
  { icon: "🧠", title: "AI Resume Analysis",      desc: "Upload your resume and get a detailed AI breakdown of strengths, gaps, keyword matches and improvement tips.", tag: "AI Powered",  color: "teal", path: "/Candidate/services/resume-analysis"   },
  { icon: "📊", title: "ATS Score and Insights",  desc: "See how Applicant Tracking Systems score your resume and get suggestions to increase your shortlisting chances.", tag: "Smart Score", color: "blue", path: "/Candidate/services/ats-checker"       },
  { icon: "🎯", title: "Job Recommendations",     desc: "Our algorithm matches your profile against live listings and surfaces the most relevant roles for your skills.", tag: "Recommended", color: "teal", path: "/Candidate/services/job-matching"      },
  { icon: "📬", title: "Application Status",      desc: "Track every job from submitted to shortlisted to rejected, all in one clean real-time dashboard view.", tag: "Stay Updated", color: "blue", path: "/Candidate/services/application-tracker" },
  { icon: "💡", title: "DSA + Aptitude",          desc: "Company-wise DSA problem sheets and previous year aptitude questions with quiz mode. Crack every placement round.", tag: "Prep Mode",  color: "teal", path: "/Candidate/services/dsa-aptitude"       },
];

/* subtle animated grid background */
function GridCanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const size = 60;
      ctx.strokeStyle = "rgba(255,255,255,0.028)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += size) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += size) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const cx = W / 2, cy = 220;
      const r = 280 + Math.sin(t) * 30;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, "rgba(79,142,247,0.06)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className={styles.gridCanvas} />;
}

export const CandidateMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user ? user.name : "Candidate";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <GridCanvas />

      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <div className={styles.topLogo}>
          <span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.topRight}>
          <div className={styles.userPill}>
            <div className={styles.avatar}>{initial}</div>
            <span className={styles.welcomeText}>{name}</span>
          </div>
          <button className={styles.logoutBtn} onClick={() => navigate("/Candidate/02_LoginCand")}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot} />
          Candidate Dashboard
        </div>

        <h1 className={styles.heroTitle}>
          One Profile.<br />
          <span className={styles.heroItalic}>Endless Opportunities.</span>
        </h1>

        <p className={styles.heroSub}>
          Every tool below is powered by AI to help you craft the perfect resume, beat ATS filters, and land your dream role faster.
        </p>

        {/* stats row */}
        <div className={styles.statsRow}>
          {[
            { val: "6",    label: "AI Tools"       },
            { val: "100%", label: "Free Forever"   },
            { val: "ATS",  label: "Optimised"      },
          ].map(({ val, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statVal}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className={styles.sectionLabel}>
        <span>— Services —</span>
      </div>

      {/* ── GRID ── */}
      <div className={styles.grid}>
        {services.map((s, i) => (
          <div
            key={s.title}
            className={`${styles.card} ${s.color === "teal" ? styles.cardTeal : styles.cardBlue}`}
            onClick={() => navigate(s.path)}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className={styles.cardTop}>
              <span className={`${styles.tag} ${s.color === "teal" ? styles.tagTeal : styles.tagBlue}`}>{s.tag}</span>
            </div>
            <h3 className={styles.cardTitle}>{s.title}</h3>
            <p className={styles.cardDesc}>{s.desc}</p>
            <div className={styles.cardAction}>
              <span>Get Started</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};