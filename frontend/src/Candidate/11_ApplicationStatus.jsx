import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./11_ApplicationStatus.module.css";

const STATUS_CONFIG = {
  Pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  label: "Under Review"   },
  Accepted: { color: "#00d4aa", bg: "rgba(0,212,170,0.08)",   border: "rgba(0,212,170,0.2)",   label: "Accepted 🎉"    },
  Rejected: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", label: "Not Selected"   },
};

export const ApplicationTracker = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter]             = useState("All");

  useEffect(() => {
    const cand = JSON.parse(localStorage.getItem("hireon_candidate")) || {};
    const user = JSON.parse(localStorage.getItem("user"))             || {};
    const email = cand.email || user.email || "";

    const allApps = JSON.parse(localStorage.getItem("hireon_applications")) || [];

    // enrich each application with recruiter's decision
    const myApps = allApps
      .filter(a => a.candidateId === email)
      .map(app => {
        // check recruiter decision in hireon_decisions_{jobId}
        const decisions = JSON.parse(localStorage.getItem(`hireon_decisions_${app.jobId}`)) || {};
        // find this candidate's id in decisions — we stored by candidate array index
        // Since recruiter uses ALL_CANDIDATES array, match by name
        const RECRUITER_CANDIDATES = [
          { id: 1, name: "Rahul Sharma" },
          { id: 2, name: "Priya Singh"  },
          { id: 3, name: "Arjun Mehta"  },
          { id: 4, name: "Sneha Reddy"  },
          { id: 5, name: "Karan Verma"  },
        ];
        const match = RECRUITER_CANDIDATES.find(c => c.name === app.candidateName);
        const decision = match ? decisions[String(match.id)] : null;

        // also check hireon_applications for status updates
        const status = decision || app.status || "Pending";
        return { ...app, status };
      });

    setApplications(myApps);
  }, []);

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
      <nav className={styles.topBar}>
        <div className={styles.topLogo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.topRight}>
          <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back</button>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}><span className={styles.dot} />Application Tracker</div>
          <h1 className={styles.heroTitle}>Your <span className={styles.heroItalic}>Applications</span></h1>
          <p className={styles.heroSub}>Track every job you've applied to and see real-time decisions from recruiters.</p>

          {/* stat row */}
          <div className={styles.statsRow}>
            {[
              { label: "Total",    val: counts.All,      color: "#4f8ef7"  },
              { label: "Pending",  val: counts.Pending,  color: "#fbbf24"  },
              { label: "Accepted", val: counts.Accepted, color: "#00d4aa"  },
              { label: "Rejected", val: counts.Rejected, color: "#f87171"  },
            ].map(({ label, val, color }) => (
              <div key={label} className={styles.statItem}>
                <span className={styles.statVal} style={{ color }}>{val}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* filter tabs */}
        <div className={styles.filterTabs}>
          {["All", "Pending", "Accepted", "Rejected"].map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f} <span className={styles.filterCount}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* applications list */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📬</div>
            <p className={styles.emptyTitle}>
              {applications.length === 0
                ? "No applications yet"
                : `No ${filter.toLowerCase()} applications`}
            </p>
            <p className={styles.emptySub}>
              {applications.length === 0
                ? "Browse HIREON Jobs in Job Recommendations and apply to get started."
                : "Check another filter tab above."}
            </p>
            {applications.length === 0 && (
              <button className={styles.browseBtn} onClick={() => navigate("/Candidate/services/job-matching")}>
                Browse Jobs →
              </button>
            )}
          </div>
        ) : (
          <div className={styles.appList}>
            {filtered.map((app) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
              return (
                <div key={app.id} className={styles.appCard}>
                  <div className={styles.appLeft}>
                    <div className={styles.appInitial}>{app.company?.[0]?.toUpperCase()}</div>
                    <div className={styles.appInfo}>
                      <p className={styles.appRole}>{app.jobRole}</p>
                      <p className={styles.appCompany}>{app.company}</p>
                      <div className={styles.appTags}>
                        {app.location && <span className={styles.appTag}>📍 {app.location}</span>}
                        {app.mode     && <span className={styles.appTag}>{app.mode}</span>}
                        {app.salary   && <span className={styles.appTagGreen}>{app.salary}</span>}
                      </div>
                      <p className={styles.appDate}>Applied {formatDate(app.appliedAt)}</p>
                    </div>
                  </div>

                  <div className={styles.appRight}>
                    <span
                      className={styles.statusBadge}
                      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>

                    {app.status === "Accepted" && (
                      <p className={styles.acceptedMsg}>
                        🎉 Congratulations! The recruiter has accepted your application. Expect to hear from them soon.
                      </p>
                    )}
                    {app.status === "Rejected" && (
                      <p className={styles.rejectedMsg}>
                        Thank you for applying. Keep going — the right opportunity is ahead.
                      </p>
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