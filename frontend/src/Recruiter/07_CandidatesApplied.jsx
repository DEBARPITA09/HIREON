import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./07_CandidatesApplied.module.css";

const DECISIONS_KEY = (jobId) => `hireon_decisions_${jobId}`;

/* ── Score bar color ── */
const scoreColor = (s) => s >= 70 ? "#00d4aa" : s >= 50 ? "#fbbf24" : "#f87171";

/* ── Resume Viewer Modal ── */
function ResumeModal({ candidate, onClose }) {
  const b64 = candidate?.resumeB64;
  const src = b64 ? `data:application/pdf;base64,${b64}` : null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.resumeBox} onClick={e => e.stopPropagation()}>
        <div className={styles.resumeHeader}>
          <span>📄 {candidate?.candidateName} — {candidate?.resumeName || "Resume"}</span>
          <button className={styles.resumeClose} onClick={onClose}>✕</button>
        </div>
        {src
          ? <iframe src={src} className={styles.resumeFrame} title="Resume" />
          : <div className={styles.noResume}>No resume PDF available for this candidate.</div>
        }
      </div>
    </div>
  );
}

/* ── Single Candidate Card ── */
function CandidateCard({ app, decision, onDecide, onViewResume }) {
  const initials = (n = "?") => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`${styles.card} ${decision === "Accepted" ? styles.cardAccepted : decision === "Rejected" ? styles.cardRejected : ""}`}>

      {/* Top row */}
      <div className={styles.cardTop}>
        <div className={styles.avatar}>{initials(app.candidateName)}</div>
        <div className={styles.info}>
          <p className={styles.name}>{app.candidateName}</p>
          <p className={styles.email}>{app.candidateEmail}</p>
          {app.candidateDomain && <p className={styles.domain}>{app.candidateDomain}</p>}
        </div>
        <span className={`${styles.badge} ${decision === "Accepted" ? styles.badgeGreen : decision === "Rejected" ? styles.badgeRed : styles.badgeYellow}`}>
          {decision || "Pending"}
        </span>
      </div>

      {/* Skills */}
      {app.candidateSkills?.length > 0 && (
        <div className={styles.skills}>
          {app.candidateSkills.slice(0, 5).map(s => <span key={s} className={styles.skillChip}>{s}</span>)}
          {app.candidateSkills.length > 5 && <span className={styles.skillChip}>+{app.candidateSkills.length - 5}</span>}
        </div>
      )}

      {/* ATS score */}
      {app.atsScore > 0 && (
        <div className={styles.scoreRow}>
          <div className={styles.scoreTop}>
            <span className={styles.scoreLabel}>ATS Score</span>
            <span className={styles.scoreNum} style={{ color: scoreColor(app.atsScore) }}>{app.atsScore}%</span>
          </div>
          <div className={styles.scoreTrack}>
            <div className={styles.scoreFill} style={{ width: `${app.atsScore}%`, background: scoreColor(app.atsScore) }} />
          </div>
        </div>
      )}

      {/* Cover note */}
      {app.coverNote && (
        <p className={styles.coverNote}><span className={styles.coverLabel}>Note: </span>{app.coverNote}</p>
      )}

      <p className={styles.appliedDate}>
        Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.resumeBtn} onClick={() => onViewResume(app)}>📄 View Resume</button>
        {!decision
          ? <div className={styles.decisionBtns}>
              <button className={styles.acceptBtn} onClick={() => onDecide(app, "Accepted")}>✓ Accept</button>
              <button className={styles.rejectBtn} onClick={() => onDecide(app, "Rejected")}>✕ Reject</button>
            </div>
          : <span className={styles.decidedTag} style={{ color: decision === "Accepted" ? "#00d4aa" : "#f87171" }}>
              {decision === "Accepted" ? "✓ Accepted" : "✕ Rejected"}
            </span>
        }
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export const CandidatesApplied = () => {
  const navigate  = useNavigate();
  const { jobId } = useParams();          // from /job/:jobId

  const recruiter = JSON.parse(localStorage.getItem("recruiter")) || {};

  const [jobs,      setJobs]      = useState([]);
  const [allApps,   setAllApps]   = useState([]);
  const [decisions, setDecisions] = useState({});
  const [activeJob, setActiveJob] = useState(null);
  const [resumeApp, setResumeApp] = useState(null);
  const [toast,     setToast]     = useState(null);

  /* ── Load data ── */
  useEffect(() => {
    // Load ONLY this recruiter's jobs
    const auth      = JSON.parse(localStorage.getItem("recruiter"))            || {};
    const recEmail  = auth.email || "";
    const recJobKey = recEmail ? `hireon_jobs_${recEmail}` : "hireon_jobs";
    const postedJobs= JSON.parse(localStorage.getItem(recJobKey))              || [];
    const apps      = JSON.parse(localStorage.getItem("hireon_applications"))  || [];
    const candProfile= JSON.parse(localStorage.getItem("hireon_candidate"))    || {};

    // Filter applications to only those for THIS recruiter's jobs
    const myJobIds = new Set(postedJobs.map(j => String(j.id)));
    const myApps   = apps.filter(a => myJobIds.has(String(a.jobId)));

    // Attach resumeB64 from profile when email matches
    const enriched = myApps.map(a => ({
      ...a,
      resumeB64: a.candidateEmail === candProfile.email ? candProfile.resumeB64 : null,
    }));

    setJobs(postedJobs);
    setAllApps(enriched);

    // Load all decisions keyed by jobId
    const dec = {};
    postedJobs.forEach(j => {
      try { dec[String(j.id)] = JSON.parse(localStorage.getItem(DECISIONS_KEY(j.id))) || {}; }
      catch { dec[String(j.id)] = {}; }
    });
    setDecisions(dec);

    // Set active job: prefer URL param, else first job
    const preferred = jobId
      ? String(jobId)
      : postedJobs.length > 0 ? String(postedJobs[0].id) : null;
    setActiveJob(preferred);
  }, [jobId]);

  const appsForJob    = (jid) => allApps.filter(a => String(a.jobId) === String(jid));
  const getDecision   = (jid, aid) => decisions[String(jid)]?.[String(aid)];

  /* ── Accept / Reject ── */
  const handleDecide = (app, verdict) => {
    const jid = String(app.jobId);
    const aid = String(app.id);

    const updated = { ...decisions, [jid]: { ...(decisions[jid] || {}), [aid]: verdict } };
    setDecisions(updated);
    localStorage.setItem(DECISIONS_KEY(jid), JSON.stringify(updated[jid]));

    // Write status back to hireon_applications so candidate can read it
    const saved = JSON.parse(localStorage.getItem("hireon_applications")) || [];
    const newSaved = saved.map(a =>
      a.id === app.id
        ? { ...a, status: verdict, recruiterName: recruiter.name || "", recruiterCompany: recruiter.company || recruiter.companyName || "" }
        : a
    );
    localStorage.setItem("hireon_applications", JSON.stringify(newSaved));

    setToast({ verdict, name: app.candidateName });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Derived counts for active job ── */
  const activeApps    = activeJob ? appsForJob(activeJob) : [];
  const pendingApps   = activeApps.filter(a => !getDecision(activeJob, a.id));
  const acceptedApps  = activeApps.filter(a => getDecision(activeJob, a.id) === "Accepted");
  const rejectedApps  = activeApps.filter(a => getDecision(activeJob, a.id) === "Rejected");
  const activeJobData = jobs.find(j => String(j.id) === String(activeJob));

  const initials = (n = "R") => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={styles.page}>
      <div className={styles.blob1} /><div className={styles.blob2} />

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <span>HIRE<span style={{color:"#fff", opacity:0.55}}>ON</span></span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.backBtn} onClick={() => navigate("/Recruiter/06_MainRec")}>← Dashboard</button>
          <span className={styles.navName}>{recruiter.name || "Recruiter"}</span>
          <button className={styles.signOutBtn} onClick={() => navigate("/Recruiter/02_LoginRec")}>Sign out</button>
        </div>
      </nav>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`${styles.toast} ${toast.verdict === "Accepted" ? styles.toastGreen : styles.toastRed}`}>
          {toast.verdict === "Accepted" ? `✓ ${toast.name} accepted!` : `✕ ${toast.name} rejected.`}
        </div>
      )}

      <div className={styles.layout}>

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <p className={styles.sectionTitle}>YOUR JOB POSTS</p>
            <p className={styles.sidebarCount}>{jobs.length} active {jobs.length === 1 ? "listing" : "listings"}</p>
          </div>
          <div className={styles.jobList}>
          {jobs.length === 0
            ? <p className={styles.sidebarEmpty}>No jobs posted yet.</p>
            : jobs.map(job => {
                const count    = appsForJob(job.id).length;
                const isActive = String(job.id) === String(activeJob);
                return (
                  <div key={job.id}
                    className={`${styles.jobTab} ${isActive ? styles.jobTabActive : ""}`}
                    onClick={() => setActiveJob(String(job.id))}
                  >
                    <div className={styles.jobTabRow}>
                      <span className={styles.jobTabRole}>{job.role}</span>
                      <span className={styles.jobTabCount}>{count}</span>
                    </div>
                    <span className={styles.jobTabSub}>{job.company} · {job.location}</span>
                    <div className={styles.jobTabTags}>
                      {job.mode   && <span className={styles.jTag}>{job.mode}</span>}
                      {job.salary && <span className={styles.jTagGreen}>{job.salary}</span>}
                    </div>
                  </div>
                );
              })
          }
          </div>
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <main className={styles.main}>

          {/* No jobs at all */}
          {jobs.length === 0 && (
            <div className={styles.emptyFull}>
              <span className={styles.emptyIcon}>📋</span>
              <p className={styles.emptyTitle}>No job posts yet</p>
              <p className={styles.emptySub}>Go to the dashboard and post a job first.</p>
            </div>
          )}

          {/* Job selected */}
          {activeJobData && (
            <>
              {/* Job header card */}
              <div className={styles.jobHeader}>
                <div className={styles.jobHeaderLeft}>
                  <div className={styles.jobHeaderInitial}>{(activeJobData.company||"?")[0].toUpperCase()}</div>
                  <div>
                    <h2 className={styles.jobHeaderRole}>{activeJobData.role}</h2>
                    <p className={styles.jobHeaderMeta}>{activeJobData.company} · {activeJobData.location} · {activeJobData.mode}</p>
                    {activeJobData.skills && <p className={styles.jobHeaderSkills}>Required skills: {activeJobData.skills}</p>}
                  </div>
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.stat}><span className={styles.statNum}>{activeApps.length}</span><span className={styles.statLabel}>Total</span></div>
                  <div className={styles.stat}><span className={styles.statNum} style={{color:"#fbbf24"}}>{pendingApps.length}</span><span className={styles.statLabel}>Pending</span></div>
                  <div className={styles.stat}><span className={styles.statNum} style={{color:"#00d4aa"}}>{acceptedApps.length}</span><span className={styles.statLabel}>Accepted</span></div>
                  <div className={styles.stat}><span className={styles.statNum} style={{color:"#f87171"}}>{rejectedApps.length}</span><span className={styles.statLabel}>Rejected</span></div>
                </div>
              </div>

              {/* No applicants */}
              {activeApps.length === 0 && (
                <div className={styles.emptyFull}>
                  <span className={styles.emptyIcon}>👥</span>
                  <p className={styles.emptyTitle}>No applications yet</p>
                  <p className={styles.emptySub}>When candidates apply to this role, they'll appear here.</p>
                </div>
              )}

              {/* Pending */}
              {pendingApps.length > 0 && (
                <section className={styles.section}>
                  <p className={styles.sectionTitle}>— Pending Review —</p>
                  <div className={styles.grid}>
                    {pendingApps.map(app => (
                      <CandidateCard key={app.id} app={app} decision={null}
                        onDecide={handleDecide} onViewResume={setResumeApp} />
                    ))}
                  </div>
                </section>
              )}

              {/* Accepted */}
              {acceptedApps.length > 0 && (
                <section className={styles.section}>
                  <p className={styles.sectionTitle} style={{color:"#00d4aa"}}>— Accepted —</p>
                  <div className={styles.grid}>
                    {acceptedApps.map(app => (
                      <CandidateCard key={app.id} app={app} decision="Accepted"
                        onDecide={handleDecide} onViewResume={setResumeApp} />
                    ))}
                  </div>
                </section>
              )}

              {/* Rejected */}
              {rejectedApps.length > 0 && (
                <section className={styles.section}>
                  <p className={styles.sectionTitle} style={{color:"#f87171"}}>— Rejected —</p>
                  <div className={styles.grid}>
                    {rejectedApps.map(app => (
                      <CandidateCard key={app.id} app={app} decision="Rejected"
                        onDecide={handleDecide} onViewResume={setResumeApp} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {/* Resume modal */}
      {resumeApp && <ResumeModal candidate={resumeApp} onClose={() => setResumeApp(null)} />}
    </div>
  );
};