import React, { useState, useEffect } from "react";
import styles from "./AtsScreening.module.css";

/* ── Claude API ATS scorer ──
   Uses candidate profile data (skills, domain, bio) instead of PDF parsing
   to avoid CORS and beta-header issues with direct browser → Anthropic calls.
   The resume filename is shown for reference; scoring uses structured profile data.
*/
async function scoreResume(app, jobRole, requiredSkills) {
  const profileSummary = [
    `Name: ${app.candidateName}`,
    `Email: ${app.candidateEmail}`,
    `Domain: ${app.candidateDomain || "Not specified"}`,
    `Skills: ${(app.candidateSkills || []).join(", ") || "Not specified"}`,
    `Resume file: ${app.resumeName || "Uploaded"}`,
    app.coverNote ? `Cover Note: ${app.coverNote}` : "",
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an ATS (Applicant Tracking System) evaluator. Analyse this candidate profile for the job below and respond ONLY with a valid JSON object — no markdown, no backticks, no explanation.

JOB ROLE: ${jobRole}
REQUIRED SKILLS: ${requiredSkills}

CANDIDATE PROFILE:
${profileSummary}

Return exactly this JSON:
{
  "atsScore": <number 0-100 based on skill match>,
  "matchedSkills": [<skills from required list found in candidate profile>],
  "missingSkills": [<skills from required list NOT found in candidate profile>],
  "experienceLevel": "<Fresher | Junior | Mid-level | Senior>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "recommendation": "<Strongly Recommend | Recommend | Maybe | Not Recommended>",
  "summary": "<2 sentence summary of candidate fit for this role>"
}`,
        }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("API response:", response.status, errBody);
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.map(b => b.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("ATS API error:", err);
    return null;
  }
}

const RECOMMENDATION_CONFIG = {
  "Strongly Recommend": { color: "#00d4aa", bg: "rgba(0,212,170,0.08)",   border: "rgba(0,212,170,0.2)"   },
  "Recommend":          { color: "#4f8ef7", bg: "rgba(79,142,247,0.08)",  border: "rgba(79,142,247,0.2)"  },
  "Maybe":              { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"  },
  "Not Recommended":    { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
};

function ScoreRing({ score }) {
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color = score >= 75 ? "#00d4aa" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className={styles.scoreRing}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          transform="rotate(-90 44 44)" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className={styles.scoreRingInner}>
        <span className={styles.scoreNum} style={{ color }}>{score}</span>
        <span className={styles.scoreLabel}>/ 100</span>
      </div>
    </div>
  );
}

function ApplicationRow({ app, jobRole, requiredSkills, onScore }) {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const runAts = async () => {
    setLoading(true); setError("");
    const res = await scoreResume(app, jobRole, requiredSkills);
    if (res) { setResult(res); onScore(app.id, res.atsScore); }
    else setError("Could not analyse. Check console for details.");
    setLoading(false);
  };

  const recCfg = result
    ? (RECOMMENDATION_CONFIG[result.recommendation] || RECOMMENDATION_CONFIG["Maybe"])
    : null;

  return (
    <div className={styles.appRow}>
      {/* candidate header */}
      <div className={styles.appHeader}>
        <div className={styles.appAvatar}>
          {app.candidateName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div className={styles.appInfo}>
          <p className={styles.appName}>{app.candidateName}</p>
          <p className={styles.appMeta}>
            {app.candidateEmail} · Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
          {app.candidateSkills?.length > 0 && (
            <div className={styles.appSkills}>
              {app.candidateSkills.slice(0, 6).map(s => (
                <span key={s} className={styles.skillChip}>{s}</span>
              ))}
            </div>
          )}
        </div>
        {app.resumeName && <span className={styles.resumeTag}>📄 {app.resumeName}</span>}
        <button
          className={`${styles.runBtn} ${loading ? styles.runBtnLoading : ""}`}
          onClick={runAts} disabled={loading}
        >
          {loading ? "Analysing..." : result ? "Re-run ATS" : "Run ATS →"}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {result && (
        <div className={styles.resultWrap}>
          {/* Score + recommendation */}
          <div className={styles.resultTop}>
            <ScoreRing score={result.atsScore} />
            <div className={styles.resultMid}>
              <span className={styles.recBadge}
                style={{ background: recCfg.bg, borderColor: recCfg.border, color: recCfg.color }}>
                {result.recommendation}
              </span>
              <span className={styles.expBadge}>{result.experienceLevel}</span>
              <p className={styles.resultSummary}>{result.summary}</p>
            </div>
          </div>

          {/* Matched / Missing skills */}
          <div className={styles.skillsRow}>
            {result.matchedSkills?.length > 0 && (
              <div className={styles.skillGroup}>
                <p className={styles.skillGroupTitle} style={{ color: "#00d4aa" }}>✓ Matched Skills</p>
                <div className={styles.skillTags}>
                  {result.matchedSkills.map(s => <span key={s} className={styles.matchedSkill}>{s}</span>)}
                </div>
              </div>
            )}
            {result.missingSkills?.length > 0 && (
              <div className={styles.skillGroup}>
                <p className={styles.skillGroupTitle} style={{ color: "#f87171" }}>✕ Missing Skills</p>
                <div className={styles.skillTags}>
                  {result.missingSkills.map(s => <span key={s} className={styles.missingSkill}>{s}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Strengths */}
          {result.topStrengths?.length > 0 && (
            <div className={styles.strengthsList}>
              <p className={styles.skillGroupTitle} style={{ color: "#a78bfa" }}>⚡ Top Strengths</p>
              {result.topStrengths.map((s, i) => (
                <div key={i} className={styles.strengthItem}>
                  <span className={styles.strengthDot} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const AtsScreening = ({ jobs, onClose }) => {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || null);
  const [applications,  setApplications]  = useState([]);
  const [scores,        setScores]        = useState({});

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  useEffect(() => {
    const allApps = JSON.parse(localStorage.getItem("hireon_applications")) || [];
    const filtered = allApps.filter(a => String(a.jobId) === String(selectedJobId));
    setApplications(filtered);
    setScores({});
  }, [selectedJobId]);

  const handleScore = (appId, score) => setScores(prev => ({ ...prev, [appId]: score }));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>ATS Screening</h2>
            <p className={styles.modalSub}>AI-powered resume analysis against your job requirements</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* JOB SELECTOR */}
        <div className={styles.jobSelector}>
          <p className={styles.selectorLabel}>Select Job</p>
          <div className={styles.jobTabs}>
            {jobs.map(j => (
              <button key={j.id}
                className={`${styles.jobTab} ${String(selectedJobId) === String(j.id) ? styles.jobTabActive : ""}`}
                onClick={() => setSelectedJobId(j.id)}>
                <span className={styles.jobTabRole}>{j.role}</span>
                <span className={styles.jobTabCompany}>{j.company}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SELECTED JOB INFO */}
        {selectedJob && (
          <div className={styles.jobInfo}>
            <div className={styles.jobInfoRow}>
              <span className={styles.jobInfoLabel}>Role</span>
              <span className={styles.jobInfoVal}>{selectedJob.role}</span>
            </div>
            <div className={styles.jobInfoRow}>
              <span className={styles.jobInfoLabel}>Required Skills</span>
              <span className={styles.jobInfoVal}>{selectedJob.skills || "Not specified"}</span>
            </div>
            <div className={styles.jobInfoRow}>
              <span className={styles.jobInfoLabel}>Applicants</span>
              <span className={styles.jobInfoVal} style={{ color: "#4f8ef7", fontWeight: 700 }}>{applications.length}</span>
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        <div className={styles.appsList}>
          {applications.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>📭</p>
              <p className={styles.emptyText}>No applications for this job yet.</p>
              <p className={styles.emptySub}>
                Candidates who apply through HIREON will appear here ready for ATS analysis.
              </p>
            </div>
          ) : (
            applications.map(app => (
              <ApplicationRow
                key={app.id}
                app={app}
                jobRole={selectedJob?.role || ""}
                requiredSkills={selectedJob?.skills || ""}
                onScore={handleScore}
              />
            ))
          )}
        </div>

        {/* LEADERBOARD */}
        {Object.keys(scores).length > 1 && (
          <div className={styles.leaderboard}>
            <p className={styles.leaderboardTitle}>ATS Leaderboard — {selectedJob?.role}</p>
            {applications
              .filter(a => scores[a.id] !== undefined)
              .sort((a, b) => scores[b.id] - scores[a.id])
              .map((app, i) => {
                const score = scores[app.id];
                const color = score >= 75 ? "#00d4aa" : score >= 50 ? "#fbbf24" : "#f87171";
                return (
                  <div key={app.id} className={styles.lbRow}>
                    <span className={styles.lbRank} style={{ color: i === 0 ? "#fbbf24" : "#334155" }}>#{i + 1}</span>
                    <span className={styles.lbName}>{app.candidateName}</span>
                    <div className={styles.lbBar}>
                      <div className={styles.lbBarFill} style={{ width: `${score}%`, background: color }} />
                    </div>
                    <span className={styles.lbScore} style={{ color }}>{score}</span>
                  </div>
                );
              })}
          </div>
        )}

      </div>
    </div>
  );
};