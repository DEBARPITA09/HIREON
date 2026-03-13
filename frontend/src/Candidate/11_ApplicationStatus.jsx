import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./11_ApplicationStatus.module.css";

const STATUS_CONFIG = {
  Pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  label: "Under Review"  },
  Accepted: { color: "#00d4aa", bg: "rgba(0,212,170,0.08)",   border: "rgba(0,212,170,0.2)",   label: "Accepted 🎉"   },
  Rejected: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", label: "Not Selected"  },
};

/* ── Decision Popup ── */
function DecisionPopup({ app, onClose }) {
  const isAccepted = app.status === "Accepted";
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={`${styles.popup} ${isAccepted ? styles.popupGreen : styles.popupRed}`} onClick={e => e.stopPropagation()}>
        <div className={styles.popupIcon}>{isAccepted ? "🎉" : "💼"}</div>
        {isAccepted ? (
          <>
            <h2 className={styles.popupTitle}>Congratulations!</h2>
            <p className={styles.popupRole}>{app.jobRole} at {app.company}</p>
            <p className={styles.popupMsg}>
              You have been <strong style={{color:"#00d4aa"}}>selected</strong> for this role!
              {app.recruiterName
                ? <> <strong>{app.recruiterName}</strong>{app.recruiterCompany ? ` from ${app.recruiterCompany}` : ""} will contact you soon for further procedures regarding your selection.</>
                : <> The recruiter will contact you soon for further procedures regarding your selection.</>
              }
            </p>
            <p className={styles.popupTip}>📧 Keep an eye on your registered email for next steps.</p>
          </>
        ) : (
          <>
            <h2 className={styles.popupTitle}>Application Update</h2>
            <p className={styles.popupRole}>{app.jobRole} at {app.company}</p>
            <p className={styles.popupMsg}>
              Unfortunately, you were <strong style={{color:"#f87171"}}>not selected</strong> for this role at this time.
              Don't be discouraged — keep applying and building your profile!
            </p>
            <p className={styles.popupTip}>💡 Use AI Mock Interview and Resume Analysis to improve your profile.</p>
          </>
        )}
        <button className={styles.popupClose} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

export const ApplicationTracker = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter]             = useState("All");
  const [popupApp, setPopupApp]         = useState(null);
  const [seenIds, setSeenIds]           = useState(() => {
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

    // auto-popup for newly decided apps the candidate hasn't seen yet
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

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1} /><div className={styles.blob2} />

      {/* Decision popup */}
      {popupApp && <DecisionPopup app={popupApp} onClose={handlePopupClose} />}

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}><span className={styles.logoHire}>HIRE</span><span className={styles.logoOn}>ON</span></div>
        <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Dashboard</button>
      </nav>

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Applications</h1>
          <p className={styles.pageSub}>Track every job you've applied to in real-time.</p>
        </div>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {["All","Pending","Accepted","Rejected"].map(key => (
            <button
              key={key}
              className={`${styles.filterTab} ${filter === key ? styles.filterTabActive : ""}`}
              onClick={() => setFilter(key)}
            >
              {key} <span className={styles.filterCount}>{counts[key]}</span>
            </button>
          ))}
        </div>

        {/* Applications list */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📬</div>
            <p className={styles.emptyTitle}>{filter === "All" ? "No applications yet" : `No ${filter.toLowerCase()} applications`}</p>
            <p className={styles.emptySub}>
              {filter === "All" ? "Apply to jobs from the Job Recommendations page." : "Applications with this status will appear here."}
            </p>
          </div>
        ) : (
          <div className={styles.appList}>
            {filtered.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
              const isDecided = app.status === "Accepted" || app.status === "Rejected";
              return (
                <div key={app.id} className={styles.appCard} style={{ borderColor: cfg.border }}>
                  <div className={styles.appCardLeft}>
                    <div className={styles.appInitial}>{(app.company||"?")[0].toUpperCase()}</div>
                    <div className={styles.appInfo}>
                      <p className={styles.appRole}>{app.jobRole}</p>
                      <p className={styles.appCompany}>{app.company}</p>
                      <div className={styles.appTags}>
                        {app.location && <span className={styles.appTag}>📍 {app.location}</span>}
                        {app.mode     && <span className={styles.appTag}>{app.mode}</span>}
                        {app.salary   && <span className={styles.appTagGreen}>{app.salary}</span>}
                      </div>
                      <p className={styles.appDate}>Applied {formatDate(app.appliedAt)}</p>

                      {/* Accepted message */}
                      {app.status === "Accepted" && (
                        <div className={styles.acceptedMsg}>
                          🎉 {app.recruiterName
                            ? <><strong>{app.recruiterName}</strong>{app.recruiterCompany ? ` (${app.recruiterCompany})` : ""} will contact you for further procedures.</>
                            : <>The recruiter will contact you for further procedures regarding your selection.</>
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
                    <span className={styles.statusBadge} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                    {isDecided && !seenIds.has(app.id) && (
                      <button className={styles.viewDecisionBtn} onClick={() => setPopupApp(app)}>View Update</button>
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