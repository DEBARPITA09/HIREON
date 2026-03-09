import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./07_CandidatesApplied.module.css";

const ALL_CANDIDATES = [
  { id: 1, name: "Rahul Sharma", resume: "/resumes/resume2.pdf", role: "Frontend Dev",    score: 87 },
  { id: 2, name: "Priya Singh",  resume: "/resumes/resume1.pdf", role: "UI/UX Designer",  score: 92 },
  { id: 3, name: "Arjun Mehta",  resume: "/resumes/resume3.pdf", role: "Backend Dev",     score: 78 },
  { id: 4, name: "Sneha Reddy",  resume: "/resumes/resume4.pdf", role: "Data Analyst",    score: 84 },
  { id: 5, name: "Karan Verma",  resume: "/resumes/resume5.pdf", role: "DevOps Engineer", score: 76 },
];

const STORAGE_KEY = (jobId) => `hireon_decisions_${jobId}`;

export const CandidatesApplied = () => {
  const { jobId } = useParams();
  const navigate  = useNavigate();

  /* decisions: { [candidateId]: "Accepted" | "Rejected" } — persisted to localStorage */
  const [decisions, setDecisions] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY(jobId))) || {};
      // normalize: ensure all keys are strings (fixes any previously saved numeric keys)
      const normalized = {};
      Object.entries(raw).forEach(([k, v]) => { normalized[String(k)] = v; });
      return normalized;
    }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY(jobId), JSON.stringify(decisions));
  }, [decisions, jobId]);

  // always store/lookup with string keys so JSON round-trip never breaks matching
  const decide = (id, verdict) => setDecisions(prev => ({ ...prev, [String(id)]: verdict }));

  const pending  = ALL_CANDIDATES.filter(c => !decisions[String(c.id)]);
  const accepted = ALL_CANDIDATES.filter(c => decisions[String(c.id)] === "Accepted");
  const rejected = ALL_CANDIDATES.filter(c => decisions[String(c.id)] === "Rejected");

  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
          <button
            className={styles.resetBtn}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY(jobId));
              setDecisions({});
            }}
            title="Reset all decisions for this job (demo reset)"
          >
            ↺ Reset Demo
          </button>
          <div className={styles.avatar}>R</div>
          <button className={styles.signOut} onClick={() => navigate("/Recruiter/02_LoginRec")}>Sign out</button>
        </div>
      </nav>

      <div className={styles.container}>

        {/* ── HERO ── */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Job ID: {jobId}
          </div>
          <h1 className={styles.heroTitle}>
            Candidates<br />
            <span className={styles.grad}>Applied</span>
          </h1>
          <p className={styles.heroSub}>
            Review applicants, check their resumes, and make your hiring decisions below.
          </p>

          {/* live counts */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{ALL_CANDIDATES.length}</span>
              <span className={styles.statLabel}>TOTAL</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum} style={{ color: "#fbbf24" }}>{pending.length}</span>
              <span className={styles.statLabel}>PENDING</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum} style={{ color: "#00d4aa" }}>
                {accepted.length}
              </span>
              <span className={styles.statLabel}>ACCEPTED</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum} style={{ color: "#f87171" }}>
                {rejected.length}
              </span>
              <span className={styles.statLabel}>REJECTED</span>
            </div>
          </div>
        </div>

        {/* ── PENDING APPLICANTS ── */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>— PENDING REVIEW —</p>

          {pending.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✓</div>
              <p className={styles.emptyText}>All applicants have been reviewed.</p>
              <p className={styles.emptySub}>
                Open <strong>Hiring Statistics</strong> on the dashboard to see accepted &amp; rejected candidates.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {pending.map((c) => (
                <div key={c.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.candidateAvatar}>{initials(c.name)}</div>
                    <div className={styles.candidateInfo}>
                      <h3 className={styles.candidateName}>{c.name}</h3>
                      <p className={styles.candidateRole}>{c.role}</p>
                    </div>
                    <div className={styles.statusBadge}>Pending</div>
                  </div>

                  {c.score && (
                    <div className={styles.scoreBar}>
                      <div className={styles.scoreLabel}>
                        <span>ATS Score</span>
                        <span className={styles.scoreNum}>{c.score}%</span>
                      </div>
                      <div className={styles.scoreTrack}>
                        <div className={styles.scoreFill} style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <a href={c.resume} target="_blank" rel="noreferrer" className={styles.resumeBtn}>
                      📄 View Resume
                    </a>
                    <div className={styles.decisionBtns}>
                      <button className={styles.acceptBtn} onClick={() => decide(c.id, "Accepted")}>
                        ✓ Accept
                      </button>
                      <button className={styles.rejectBtn} onClick={() => decide(c.id, "Rejected")}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};