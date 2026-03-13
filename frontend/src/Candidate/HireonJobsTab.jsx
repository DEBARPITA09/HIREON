import React, { useState, useEffect, useRef } from "react";
import styles from "./HireonJobsTab.module.css";

/* ── Apply Modal ── */
function ApplyModal({ job, candidate, onClose, onApplied }) {
  const [useProfileResume, setUseProfileResume] = useState(!!candidate.resumeName);
  const [coverNote, setCoverNote]               = useState("");
  const [uploading, setUploading]               = useState(false);
  const [customResumeName, setCustomResumeName] = useState("");
  const [customResumeB64, setCustomResumeB64]   = useState("");
  const [showDetails, setShowDetails]           = useState(false);
  const [applied, setApplied]                   = useState(false);
  const fileRef = useRef();

  // check recruiter/company profile for "More Details"
  const recruiterCompany = JSON.parse(localStorage.getItem("recruiterCompany")) || {};
  const recruiter        = JSON.parse(localStorage.getItem("recruiter"))        || {};

  const handleCustomResume = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomResumeB64(ev.target.result.split(",")[1]);
      setCustomResumeName(file.name);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const [submitError, setSubmitError] = useState("");

  const submit = () => {
    setSubmitError("");
    const resumeB64  = useProfileResume ? candidate.resumeB64  : customResumeB64;
    const resumeName = useProfileResume ? candidate.resumeName : customResumeName;

    if (!resumeB64) {
      setSubmitError("Please upload a resume before applying.");
      return;
    }

    // build application object — NO resumeB64 stored (too large for localStorage)
    // resumeB64 is already in hireon_candidate and can be read from there
    const application = {
      id:             `app_${Date.now()}`,
      jobId:          String(job.id),
      jobRole:        job.role,
      company:        job.company,
      salary:         job.salary,
      location:       job.location,
      mode:           job.mode,
      deadline:       job.deadline,
      skills:         job.skills,
      appliedAt:      new Date().toISOString(),
      status:         "Pending",
      candidateId:    candidate.email,
      candidateName:  candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone   || "",
      candidateSkills:candidate.skills  || [],
      candidateDomain:candidate.domain  || "",
      resumeName,
      coverNote,
    };

    // save to applications list
    const existing = JSON.parse(localStorage.getItem("hireon_applications")) || [];
    // prevent duplicate
    const alreadyApplied = existing.some(
      a => String(a.jobId) === String(job.id) && a.candidateId === candidate.email
    );
    if (alreadyApplied) { setSubmitError("You have already applied to this job."); return; }

    localStorage.setItem("hireon_applications", JSON.stringify([...existing, application]));
    setApplied(true);
    setTimeout(() => { onApplied(); onClose(); }, 1400);
  };

  if (showDetails) return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Job Details</h2>
          <div className={styles.modalHeaderBtns}>
            <button className={styles.backLinkBtn} onClick={() => setShowDetails(false)}>← Back</button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailsSection}>
            <p className={styles.detailsLabel}>Job Info</p>
            <div className={styles.detailsCard}>
              <p className={styles.detailsRole}>{job.role}</p>
              <p className={styles.detailsCompany}>{job.company}</p>
              <div className={styles.detailsTags}>
                {job.mode       && <span className={styles.dTag}>{job.mode}</span>}
                {job.type       && <span className={styles.dTag}>{job.type}</span>}
                {job.experience && <span className={styles.dTag}>{job.experience}</span>}
                {job.location   && <span className={styles.dTag}>📍 {job.location}</span>}
                {job.salary     && <span className={styles.dTagGreen}>{job.salary}</span>}
                {job.deadline   && <span className={styles.dTagYellow}>Deadline: {job.deadline}</span>}
              </div>
              {job.description && <p className={styles.detailsDesc}>{job.description}</p>}
              {job.skills      && <div className={styles.skillsList}><span className={styles.skillsHead}>Required Skills:</span> {job.skills}</div>}
            </div>
          </div>

          {/* Company Profile */}
          {recruiterCompany.name && (
            <div className={styles.detailsSection}>
              <p className={styles.detailsLabel}>Company Profile</p>
              <div className={styles.detailsCard}>
                <p className={styles.detailsRole}>{recruiterCompany.name}</p>
                {recruiterCompany.industry    && <p className={styles.detailsMeta}>{recruiterCompany.industry} · {recruiterCompany.size} employees</p>}
                {recruiterCompany.description && <p className={styles.detailsDesc}>{recruiterCompany.description}</p>}
                {recruiterCompany.website     && <a href={recruiterCompany.website} target="_blank" rel="noreferrer" className={styles.detailsLink}>{recruiterCompany.website}</a>}
              </div>
            </div>
          )}

          {/* Recruiter Profile */}
          {recruiter.name && (
            <div className={styles.detailsSection}>
              <p className={styles.detailsLabel}>Posted By</p>
              <div className={styles.detailsCard}>
                <p className={styles.detailsRole}>{recruiter.name}</p>
                {recruiter.designation && <p className={styles.detailsMeta}>{recruiter.designation}</p>}
                {recruiter.email       && <p className={styles.detailsMeta}>{recruiter.email}</p>}
                {recruiter.linkedin    && <a href={recruiter.linkedin} target="_blank" rel="noreferrer" className={styles.detailsLink}>LinkedIn Profile</a>}
              </div>
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button className={styles.btnCancel} onClick={() => setShowDetails(false)}>Close</button>
          <button className={styles.btnSubmit} onClick={() => setShowDetails(false)}>Apply Now →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Apply — {job.role}</h2>
            <p className={styles.modalSub}>{job.company} · {job.location}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {applied ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successText}>Application Submitted!</p>
            <p className={styles.successSub}>The recruiter will review your profile and resume.</p>
          </div>
        ) : (
          <>
            {/* Candidate summary */}
            <div className={styles.candidateSummary}>
              <div className={styles.summaryAvatar}>{(candidate.name||"C").charAt(0).toUpperCase()}</div>
              <div>
                <p className={styles.summaryName}>{candidate.name}</p>
                <p className={styles.summaryMeta}>{candidate.email} {candidate.domain ? `· ${candidate.domain}` : ""}</p>
              </div>
            </div>

            {/* Resume choice */}
            <div className={styles.formSection}>Resume</div>
            {candidate.resumeName && (
              <div className={styles.resumeChoice}>
                <button
                  className={`${styles.choiceBtn} ${useProfileResume ? styles.choiceActive : ""}`}
                  onClick={() => setUseProfileResume(true)}
                >
                  <span>📄</span> Use profile resume <span className={styles.resumeFilename}>({candidate.resumeName})</span>
                </button>
                <button
                  className={`${styles.choiceBtn} ${!useProfileResume ? styles.choiceActive : ""}`}
                  onClick={() => setUseProfileResume(false)}
                >
                  <span>📎</span> Upload a different resume
                </button>
              </div>
            )}

            {(!candidate.resumeName || !useProfileResume) && (
              <div className={styles.uploadZone} onClick={() => fileRef.current.click()}>
                {customResumeName
                  ? <><span>📄</span> <span className={styles.uploadedName}>{customResumeName}</span></>
                  : <><span>📎</span> <span>Click to upload PDF resume</span></>
                }
                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={handleCustomResume} />
              </div>
            )}

            {/* Cover note */}
            <div className={styles.formSection}>Cover Note (optional)</div>
            <textarea
              className={styles.textarea}
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder="Briefly explain why you're a great fit for this role..."
              rows={3}
            />

            {submitError && (
              <p className={styles.submitError}>⚠️ {submitError}</p>
            )}
            <div className={styles.formActions}>
              <button className={styles.btnDetails} onClick={() => setShowDetails(true)}>More Details</button>
              <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
              <button className={styles.btnSubmit} onClick={submit} disabled={uploading}>
                {uploading ? "Uploading..." : "Apply Now →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Tab Component ── */
export const HireonJobsTab = () => {
  const [jobs, setJobs]             = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyJob, setApplyJob]     = useState(null);
  const [candidate, setCandidate]   = useState({});

  const loadData = () => {
    const posted      = JSON.parse(localStorage.getItem("hireon_jobs"))         || [];
    const cand        = JSON.parse(localStorage.getItem("hireon_candidate"))    || {};
    const applications= JSON.parse(localStorage.getItem("hireon_applications")) || [];
    setCandidate(cand);
    const applied = new Set(applications.filter(a => a.candidateId === cand.email).map(a => a.jobId));
    setAppliedIds(applied);

    // Match: ALL job-required skills must exist in candidate's skills/domain
    const candSkills  = (cand.skills || []).map(s => s.toLowerCase().trim());
    const candDomain  = (cand.domain || "").toLowerCase();
    // treat domain keywords as additional skills candidate has
    const domainWords = candDomain.split(/[\s,\/]+/).filter(w => w.length > 1);
    const candAll     = [...new Set([...candSkills, ...domainWords])];

    const matched = posted.filter(job => {
      if (!candAll.length) return true; // no profile data = show all
      // parse job required skills (comma/space separated)
      const jobSkills = (job.skills || "")
        .split(/[,]+/)
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      if (!jobSkills.length) return true; // job has no skill requirement = show it
      // ALL job skills must be covered by candidate's skills/domain
      return jobSkills.every(js => candAll.some(cs => cs.includes(js) || js.includes(cs)));
    });
        setJobs(matched);
  };

  useEffect(() => { loadData(); }, []);

  const onApplied = () => {
    loadData();
  };

  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (jobs.length === 0) {
    const cand = JSON.parse(localStorage.getItem("hireon_candidate")) || {};
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎯</div>
        <p className={styles.emptyTitle}>No matching HIREON jobs yet</p>
        <p className={styles.emptySub}>
          {!cand.skills?.length
            ? "Add your skills in Profile Management so we can match you with recruiter-posted jobs."
            : "Recruiters haven't posted jobs matching your skills yet. Check back soon."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <p className={styles.matchCount}><span>{jobs.length}</span> job{jobs.length !== 1 ? "s" : ""} matched to your skills</p>
      </div>

      <div className={styles.jobsList}>
        {jobs.map((job) => {
          const expired  = isExpired(job.deadline);
          const hasApplied = appliedIds.has(job.id);

          return (
            <div key={job.id} className={`${styles.jobCard} ${expired ? styles.jobExpired : ""}`}>
              <div className={styles.jobCardLeft}>
                <div className={styles.jobInitial}>{job.company?.[0]?.toUpperCase()}</div>
                <div>
                  <p className={styles.jobRole}>{job.role}</p>
                  <p className={styles.jobCompany}>{job.company}</p>
                  <div className={styles.jobTags}>
                    {job.mode       && <span className={styles.tag}>{job.mode}</span>}
                    {job.type       && <span className={styles.tag}>{job.type}</span>}
                    {job.location   && <span className={styles.tag}>📍 {job.location}</span>}
                    {job.salary     && <span className={styles.tagGreen}>{job.salary}</span>}
                    {job.experience && <span className={styles.tag}>{job.experience}</span>}
                    {job.deadline   && <span className={expired ? styles.tagRed : styles.tagYellow}>
                      {expired ? "Expired" : `Deadline: ${job.deadline}`}
                    </span>}
                  </div>
                  {job.skills && (
                    <p className={styles.jobSkills}>
                      <span className={styles.skillsHead}>Skills: </span>{job.skills}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.jobCardActions}>
                {hasApplied ? (
                  <span className={styles.appliedBadge}>✓ Applied</span>
                ) : expired ? (
                  <span className={styles.expiredBadge}>Expired</span>
                ) : (
                  <button className={styles.applyBtn} onClick={() => setApplyJob(job)}>Apply Now →</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          candidate={candidate}
          onClose={() => setApplyJob(null)}
          onApplied={onApplied}
        />
      )}
    </div>
  );
};