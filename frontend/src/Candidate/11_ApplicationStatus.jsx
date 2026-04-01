import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./11_ApplicationStatus.module.css";

/* ── Status palette — HIREON tokens ── */
const STATUS_CONFIG = {
  Pending:  { color:"#fbbf24", bg:"rgba(251,191,36,0.08)",  border:"rgba(251,191,36,0.25)",  label:"Under Review"  },
  Accepted: { color:"#81e6a0", bg:"rgba(129,230,160,0.08)", border:"rgba(129,230,160,0.28)", label:"Accepted 🎉"   },
  Rejected: { color:"#f87171", bg:"rgba(248,113,113,0.08)", border:"rgba(248,113,113,0.25)", label:"Not Selected"  },
};

/* ── Particle background ── */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .00015, vy: (Math.random() - .5) * .00015,
      r: .5 + Math.random() * 1.2, a: .08 + Math.random() * .22, ph: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const pulse = .82 + .18 * Math.sin(t * .016 + p.ph);
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a * pulse})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < .07) {
          ctx.beginPath(); ctx.moveTo(pts[i].x * W, pts[i].y * H); ctx.lineTo(pts[j].x * W, pts[j].y * H);
          ctx.strokeStyle = `rgba(255,255,255,${.04 * (1 - d / .07)})`; ctx.lineWidth = .4; ctx.stroke();
        }
      }
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

/* ── Decision Popup ── */
function DecisionPopup({ app, onClose }) {
  const isAccepted = app.status === "Accepted";
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div
        className={`${styles.popup} ${isAccepted ? styles.popupGreen : styles.popupRed}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.popupIcon}>{isAccepted ? "🎉" : "💼"}</div>
        {isAccepted ? (
          <>
            <h2 className={styles.popupTitle}>Congratulations!</h2>
            <p className={styles.popupRole}>{app.jobRole} at {app.company}</p>
            <p className={styles.popupMsg}>
              You have been <strong style={{ color: "#81e6a0" }}>selected</strong> for this role!{" "}
              {app.recruiterName
                ? <><strong>{app.recruiterName}</strong>{app.recruiterCompany ? ` from ${app.recruiterCompany}` : ""} will contact you soon for further procedures.</>
                : <>The recruiter will contact you soon for further procedures regarding your selection.</>
              }
            </p>
            <p className={styles.popupTip}>📧 Keep an eye on your registered email for next steps.</p>
          </>
        ) : (
          <>
            <h2 className={styles.popupTitle}>Application Update</h2>
            <p className={styles.popupRole}>{app.jobRole} at {app.company}</p>
            <p className={styles.popupMsg}>
              Unfortunately, you were <strong style={{ color: "#f87171" }}>not selected</strong> for this role at this time.
              Don't be discouraged — keep applying and building your profile!
            </p>
            <p className={styles.popupTip}>💡 Use AI Mock Interview and Resume Analysis to strengthen your profile.</p>
          </>
        )}
        <button className={styles.popupClose} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export const ApplicationTracker = () => {
  const navigate   = useNavigate();
  const canvasRef  = useRef();
  useParticles(canvasRef);

  const [applications, setApplications] = useState([]);
  const [filter,       setFilter]       = useState("All");
  const [popupApp,     setPopupApp]     = useState(null);
  const [seenIds,      setSeenIds]      = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("hireon_seen_decisions")) || []); }
    catch { return new Set(); }
  });

  const loadApps = () => {
    const cand  = JSON.parse(localStorage.getItem("hireon_candidate")) || {};
    const user  = JSON.parse(localStorage.getItem("user"))             || {};
    const email = cand.email || user.email || "";
    const allApps = JSON.parse(localStorage.getItem("hireon_applications")) || [];

    const myApps = allApps
      .filter(a => a.candidateId === email || a.candidateEmail === email)
      .map(app => ({ ...app, status: app.status || "Pending" }))
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    setApplications(myApps);

    const newDecision = myApps.find(
      a => (a.status === "Accepted" || a.status === "Rejected") && !seenIds.has(a.id)
    );
    if (newDecision) setPopupApp(newDecision);
  };

  useEffect(() => { loadApps(); }, []);

  const handlePopupClose = () => {
    if (popupApp) {
      const updated = new Set([...seenIds, popupApp.id]);
      setSeenIds(updated);
      localStorage.setItem("hireon_seen_decisions", JSON.stringify([...updated]));
    }
    setPopupApp(null);
  };

  const counts = {
    All:      applications.length,
    Pending:  applications.filter(a => a.status === "Pending").length,
    Accepted: applications.filter(a => a.status === "Accepted").length,
    Rejected: applications.filter(a => a.status === "Rejected").length,
  };

  const displayed = filter === "All" ? applications : applications.filter(a => a.status === filter);

  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {popupApp && <DecisionPopup app={popupApp} onClose={handlePopupClose} />}

      {/* ── Topbar ── */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>
            ← Dashboard
          </button>
          <span className={styles.topSep}>/</span>
          <span className={styles.topCrumb}>My Applications</span>
        </div>
        <div className={styles.topRight}>
          <div className={styles.topLogo}>
            <div className={styles.topLogoSq}>
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <path d="M3 2V16M15 2V16M3 9H15" stroke="#080808" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            HIREON
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className={styles.container}>

        {/* Badge + title */}
        <div className={`${styles.pageHeader} ${styles.fade}`}>
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            Application Tracker
          </div>
          <h1 className={styles.pageTitle}>
            My Applications<span className={styles.pageTitleItalic}>.</span>
          </h1>
          <p className={styles.pageSub}>
            Track every job you've applied to — all statuses, all in one place.
          </p>
        </div>

        {/* Stats row */}
        <div className={`${styles.statsRow} ${styles.fade}`} style={{ animationDelay: "0.06s" }}>
          {[
            { key: "All",      label: "Total",    color: "#c8c8c8" },
            { key: "Pending",  label: "Reviewing",color: "#fbbf24" },
            { key: "Accepted", label: "Accepted", color: "#81e6a0" },
            { key: "Rejected", label: "Closed",   color: "#f87171" },
          ].map(({ key, label, color }) => (
            <div key={key} className={styles.statItem} onClick={() => setFilter(key)}>
              <span className={styles.statVal} style={{ color }}>{counts[key]}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {["All", "Pending", "Accepted", "Rejected"].map(key => (
            <button
              key={key}
              className={`${styles.filterTab} ${filter === key ? styles.filterTabActive : ""}`}
              onClick={() => setFilter(key)}
            >
              {key} <span className={styles.filterCount}>{counts[key]}</span>
            </button>
          ))}
        </div>

        {/* App list or empty */}
        {displayed.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📬</div>
            <p className={styles.emptyTitle}>
              {filter === "All" ? "No applications yet" : `No ${filter.toLowerCase()} applications`}
            </p>
            <p className={styles.emptySub}>
              {filter === "All"
                ? "Apply to jobs from the Job Recommendations page to track them here."
                : "Applications with this status will appear here once updated."}
            </p>
          </div>
        ) : (
          <div className={styles.appList}>
            {displayed.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
              const isDecided = app.status === "Accepted" || app.status === "Rejected";
              return (
                <div key={app.id} className={styles.appCard} style={{ borderColor: cfg.border }}>

                  {/* Left accent bar */}
                  <div
                    className={styles.accentBar}
                    style={{ background: `linear-gradient(180deg,${cfg.color},transparent)` }}
                  />

                  <div className={styles.appCardLeft}>
                    <div className={styles.appInitial}>
                      {(app.company || "?")[0].toUpperCase()}
                    </div>
                    <div className={styles.appInfo}>
                      <p className={styles.appRole}>{app.jobRole}</p>
                      <p className={styles.appCompany}>{app.company}</p>
                      <div className={styles.appTags}>
                        {app.location && <span className={styles.appTag}>📍 {app.location}</span>}
                        {app.mode     && <span className={styles.appTag}>{app.mode}</span>}
                        {app.salary   && <span className={styles.appTagGreen}>{app.salary}</span>}
                      </div>
                      <p className={styles.appDate}>Applied {formatDate(app.appliedAt)}</p>

                      {app.status === "Accepted" && (
                        <div className={styles.acceptedMsg}>
                          🎉{" "}
                          {app.recruiterName
                            ? <><strong>{app.recruiterName}</strong>{app.recruiterCompany ? ` (${app.recruiterCompany})` : ""} will contact you for further procedures.</>
                            : <>The recruiter will contact you regarding your selection.</>
                          }
                        </div>
                      )}
                      {app.status === "Rejected" && (
                        <div className={styles.rejectedMsg}>
                          Keep going! Use our AI tools to strengthen your profile for the next opportunity.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.appCardRight}>
                    <span
                      className={styles.statusBadge}
                      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                    {isDecided && !seenIds.has(app.id) && (
                      <button className={styles.viewDecisionBtn} onClick={() => setPopupApp(app)}>
                        View Update
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};