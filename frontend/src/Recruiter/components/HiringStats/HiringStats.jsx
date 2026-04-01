import React, { useState, useEffect } from "react";
import styles from "./HiringStats.module.css";

/* ──────────────────────────────────────────
   Read decisions from hireon_applications + hireon_decisions_*
   Also reads ATS score from hireon_applications (persisted by ATS scorer)
   and falls back to hireon_candidate profile if emails match.
────────────────────────────────────────── */
function loadDecisions(jobs) {
  const apps        = JSON.parse(localStorage.getItem("hireon_applications")) || [];
  const candProfile = JSON.parse(localStorage.getItem("hireon_candidate"))    || {};
  const myJobIds    = new Set(jobs.map(j => String(j.id)));
  const myApps      = apps.filter(a => myJobIds.has(String(a.jobId)));

  const accepted = [], rejected = [];

  myApps.forEach(app => {
    const dec     = JSON.parse(localStorage.getItem(`hireon_decisions_${app.jobId}`)) || {};
    const verdict = dec[String(app.id)] || app.status || "";
    const job     = jobs.find(j => String(j.id) === String(app.jobId)) || {};

    // ── ATS score: prefer value stored on the application itself (set by ATS scorer),
    //    fall back to the candidate's profile atsScore if emails match.
    let atsScore = app.atsScore || 0;
    if (!atsScore && candProfile.email === app.candidateEmail && candProfile.atsScore) {
      atsScore = candProfile.atsScore;
    }

    // ── Resume b64: read from hireon_candidate when emails match
    let resumeB64 = app.resumeB64 || null;
    if (!resumeB64 && candProfile.email === app.candidateEmail && candProfile.resumeB64) {
      resumeB64 = candProfile.resumeB64;
    }

    const entry = {
      id:             app.id,
      name:           app.candidateName  || "Unknown",
      role:           app.jobRole        || job.role    || "",
      company:        app.company        || job.company || "",
      score:          atsScore,
      email:          app.candidateEmail || "",
      candidateEmail: app.candidateEmail || "",
      skills:         app.candidateSkills || [],
      appliedAt:      app.appliedAt      || "",
      jobId:          app.jobId,
      resumeName:     app.resumeName     || "",
      resumeB64,                          // ← carry b64 into table rows
    };

    if      (verdict === "Accepted") accepted.push(entry);
    else if (verdict === "Rejected") rejected.push(entry);
  });

  return { accepted, rejected };
}

/* ── FULL-WIDTH FUNNEL ── */
function Funnel({ total, accepted, rejected, pending }) {
  const stages = [
    { label: "Applied",     value: total,              color: "#4f8ef7" },
    { label: "Reviewed",    value: accepted + rejected, color: "#a78bfa" },
    { label: "Shortlisted", value: accepted + pending,  color: "#fbbf24" },
    { label: "Accepted",    value: accepted,            color: "#00d4aa" },
  ];
  const max = stages[0].value || 1;

  return (
    <div className={styles.funnelWrap}>
      {stages.map((s, i) => {
        const pct  = Math.round((s.value / max) * 100);
        const drop = i < stages.length - 1
          ? Math.round(((stages[i].value - stages[i + 1].value) / max) * 100)
          : null;
        return (
          <React.Fragment key={s.label}>
            <div className={styles.funnelRow}>
              <div className={styles.funnelMeta}>
                <span className={styles.funnelLabel}>{s.label}</span>
                <span className={styles.funnelCount} style={{ color: s.color }}>{s.value} candidates</span>
              </div>
              <div className={styles.funnelTrack}>
                <div className={styles.funnelFill} style={{ width: `${pct}%`, background: s.color }} />
                <span className={styles.funnelPct}>{pct}%</span>
              </div>
            </div>
            {drop !== null && (
              <div className={styles.funnelConnector}>
                <div className={styles.connectorLine} />
                <span className={styles.connectorDrop}>↓ {drop}% drop-off</span>
                <div className={styles.connectorLine} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── RESUME VIEWER (inline in HiringStats) ── */
function ResumeViewer({ resume, onClose }) {
  if (!resume) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, width: "100%", maxWidth: 820, height: "88vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>
            📄 {resume.name}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", width: 28, height: 28, borderRadius: 7,
              cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
        {resume.b64
          ? <iframe
              src={`data:application/pdf;base64,${resume.b64}`}
              style={{ flex: 1, width: "100%", border: "none", background: "#fff" }}
              title="Resume"
            />
          : <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", color: "rgba(255,255,255,0.35)",
            }}>
              No resume PDF available for this candidate.
            </div>
        }
      </div>
    </div>
  );
}

/* ── CANDIDATE TABLE ── */
function CandidateTable({ candidates, type, onViewResume }) {
  const isAccepted  = type === "Accepted";
  const accentColor = isAccepted ? "#00d4aa" : "#f87171";
  const accentBg    = isAccepted ? "rgba(0,212,170,0.06)"   : "rgba(248,113,113,0.06)";
  const accentBdr   = isAccepted ? "rgba(0,212,170,0.14)"   : "rgba(248,113,113,0.14)";

  if (candidates.length === 0) {
    return (
      <div className={styles.tableEmpty}>
        No {type.toLowerCase()} candidates yet — decisions made in <strong>View Applicants</strong> will appear here.
      </div>
    );
  }

  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const scoreColor = (s) => s >= 70 ? "#00d4aa" : s >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className={styles.tableWrap} style={{ borderColor: accentBdr }}>
      <table className={styles.table}>
        <thead>
          <tr>
            {["#", "Candidate", "Applied For", "Company", "ATS Score", "Resume"].map(h => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={`${c.id}-${c.jobId}`} className={styles.tr}>
              <td className={styles.td} style={{ color: "#334155", width: 32 }}>{i + 1}</td>

              {/* Candidate name */}
              <td className={styles.td}>
                <div className={styles.nameCell}>
                  <div
                    className={styles.tableAvatar}
                    style={{ background: accentBg, borderColor: accentBdr, color: accentColor }}
                  >
                    {initials(c.name)}
                  </div>
                  <span className={styles.candidateName}>{c.name}</span>
                </div>
              </td>

              <td className={styles.td} style={{ color: "#64748b" }}>{c.role}</td>
              <td className={styles.td} style={{ color: "#64748b" }}>{c.company}</td>

              {/* ── ATS Score — shows real value, not 0 ── */}
              <td className={styles.td}>
                {c.score > 0 ? (
                  <div className={styles.scoreCell}>
                    <div className={styles.scoreMiniTrack}>
                      <div
                        className={styles.scoreMiniBar}
                        style={{ width: `${c.score}%`, background: scoreColor(c.score) }}
                      />
                    </div>
                    <span style={{ color: scoreColor(c.score), fontSize: 12, fontWeight: 700 }}>{c.score}%</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                    Not run yet
                  </span>
                )}
              </td>

              {/* ── Resume — always clickable, shows PDF or "not available" ── */}
              <td className={styles.td}>
                <button
                  className={styles.resumeLink}
                  style={{
                    color: accentColor, borderColor: accentBdr,
                    cursor: "pointer", background: "transparent",
                    opacity: 1,
                  }}
                  onClick={() => onViewResume({ name: c.resumeName || `${c.name} Resume`, b64: c.resumeB64 || null })}
                >
                  {c.resumeB64 ? "📄 View" : "View →"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── MAIN MODAL ── */
export const HiringStats = ({ jobs, onClose }) => {
  const [activeTable,   setActiveTable]   = useState(null);
  const [decided,       setDecided]       = useState({ accepted: [], rejected: [] });
  const [resumeViewer,  setResumeViewer]  = useState(null); // { name, b64 }

  useEffect(() => {
    setDecided(loadDecisions(jobs));
    const onStorage = () => setDecided(loadDecisions(jobs));
    window.addEventListener("storage", onStorage);
    // Also poll every 2s so updates from ATS scorer in View Applicants reflect here
    const interval = setInterval(() => setDecided(loadDecisions(jobs)), 2000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, [jobs]);

  const myJobIds        = new Set(jobs.map(j => String(j.id)));
  const allRealApps     = JSON.parse(localStorage.getItem("hireon_applications")) || [];
  const totalApplicants = allRealApps.filter(a => myJobIds.has(String(a.jobId))).length;
  const totalAccepted   = decided.accepted.length;
  const totalRejected   = decided.rejected.length;
  const totalPending    = Math.max(0, totalApplicants - totalAccepted - totalRejected);
  const acceptRate      = totalApplicants > 0 ? Math.round((totalAccepted / totalApplicants) * 100) : 0;

  const overviewItems = [
    { label: "Total Applicants", val: totalApplicants, color: "#4f8ef7",  bg: "rgba(79,142,247,0.08)",  bdr: "rgba(79,142,247,0.18)"  },
    { label: "Accepted",         val: totalAccepted,   color: "#00d4aa",  bg: "rgba(0,212,170,0.08)",   bdr: "rgba(0,212,170,0.18)"   },
    { label: "Rejected",         val: totalRejected,   color: "#f87171",  bg: "rgba(248,113,113,0.08)", bdr: "rgba(248,113,113,0.18)" },
    { label: "Pending Review",   val: totalPending,    color: "#fbbf24",  bg: "rgba(251,191,36,0.08)",  bdr: "rgba(251,191,36,0.18)"  },
    { label: "Acceptance Rate",  val: `${acceptRate}%`,color: "#a78bfa",  bg: "rgba(167,139,250,0.08)", bdr: "rgba(167,139,250,0.18)" },
  ];

  const toggle = (type) => setActiveTable(prev => prev === type ? null : type);

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>

          {/* HEADER */}
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>Hiring Statistics</h2>
              <p className={styles.modalSub}>Live pipeline analytics across all your job postings</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* NUMBER STATS */}
          <div className={styles.overviewGrid}>
            {overviewItems.map(({ label, val, color, bg, bdr }) => (
              <div key={label} className={styles.overviewCard} style={{ background: bg, borderColor: bdr }}>
                <span className={styles.overviewVal} style={{ color }}>{val}</span>
                <span className={styles.overviewLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* FUNNEL */}
          <div className={styles.funnelSection}>
            <p className={styles.sectionTitle}>
              <span className={styles.sectionDash}>—</span>
              Hiring Funnel
              <span className={styles.sectionDash}>—</span>
            </p>
            <Funnel
              total={totalApplicants}
              accepted={totalAccepted}
              rejected={totalRejected}
              pending={totalPending}
            />
          </div>

          {/* TOGGLE BUTTONS */}
          <div className={styles.tableToggles}>
            <button
              className={`${styles.toggleBtn} ${activeTable === "Accepted" ? styles.toggleTeal : ""}`}
              onClick={() => toggle("Accepted")}
            >
              <span className={styles.toggleDot} style={{ background: "#00d4aa" }} />
              Accepted Candidates
              <span className={`${styles.toggleBadge} ${styles.badgeTeal}`}>{totalAccepted}</span>
              <span className={styles.toggleCaret}>{activeTable === "Accepted" ? "▲" : "▼"}</span>
            </button>

            <button
              className={`${styles.toggleBtn} ${activeTable === "Rejected" ? styles.toggleRed : ""}`}
              onClick={() => toggle("Rejected")}
            >
              <span className={styles.toggleDot} style={{ background: "#f87171" }} />
              Rejected Candidates
              <span className={`${styles.toggleBadge} ${styles.badgeRed}`}>{totalRejected}</span>
              <span className={styles.toggleCaret}>{activeTable === "Rejected" ? "▲" : "▼"}</span>
            </button>
          </div>

          {/* ACCEPTED TABLE */}
          {activeTable === "Accepted" && (
            <div className={styles.tableSection}>
              <CandidateTable
                candidates={decided.accepted}
                type="Accepted"
                onViewResume={setResumeViewer}
              />
            </div>
          )}

          {/* REJECTED TABLE */}
          {activeTable === "Rejected" && (
            <div className={styles.tableSection}>
              <CandidateTable
                candidates={decided.rejected}
                type="Rejected"
                onViewResume={setResumeViewer}
              />
            </div>
          )}

        </div>
      </div>

      {/* RESUME VIEWER — rendered outside modal so z-index stacks correctly */}
      {resumeViewer && (
        <ResumeViewer resume={resumeViewer} onClose={() => setResumeViewer(null)} />
      )}
    </>
  );
};