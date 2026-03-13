import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./06_MainRec.module.css";

import { Navbar }                    from "./components/Navbar/Navbar";
import { ServiceCards, GridCanvas }  from "./components/ServiceCards/ServiceCards";
import { JobListings }               from "./components/JobListings/JobListings";
import { PostJob }                   from "./components/PostJob/PostJob";
import { CompanyProfile }            from "./components/CompanyProfile/CompanyProfile";
import { RecruiterProfile }          from "./components/RecruiterProfile/RecruiterProfile";
import { HiringStats }               from "./components/HiringStats/HiringStats";
import { AtsScreening }              from "./components/AtsScreening/AtsScreening";

/* ── Profile required prompt ── */
function ProfilePrompt({ isFirstLogin, onFillNow, onSkip }) {
  return (
    <div className={styles.promptOverlay}>
      <div className={styles.promptBox}>
        <div className={styles.promptIcon}>{isFirstLogin ? "👋" : "⚠️"}</div>
        <h2 className={styles.promptTitle}>
          {isFirstLogin ? "Welcome to HIREON!" : "Profile Incomplete"}
        </h2>
        <p className={styles.promptMsg}>
          {isFirstLogin
            ? "To maintain the quality and credibility of job listings on HIREON, we require all recruiters to complete their professional profile before posting. This helps candidates make informed decisions and increases the trust and response rate for your roles."
            : "Posting a job requires your Recruiter Profile and Company Profile to be complete. Please fill in all mandatory fields before proceeding — this ensures candidates have the information they need to apply with confidence."
          }
        </p>
        {isFirstLogin && (
          <p className={styles.promptSub}>It only takes a couple of minutes and is a one-time setup.</p>
        )}
        {!isFirstLogin && (
          <div className={styles.promptChecklist}>
            <p className={styles.promptCheckItem}>👤 Recruiter Profile — Name, Designation, Phone</p>
            <p className={styles.promptCheckItem}>🏢 Company Profile — Company Name, Industry, Headquarters</p>
          </div>
        )}
        <div className={styles.promptActions}>
          <button className={styles.promptFill} onClick={onFillNow}>
            Fill Profile Now →
          </button>
          {isFirstLogin && (
            <button className={styles.promptSkip} onClick={onSkip}>
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const RecruiterMain = () => {
  const navigate = useNavigate();
  const [modal,        setModal]        = useState(null);
  const [recruiter,    setRecruiter]    = useState({});
  const [showPrompt,   setShowPrompt]   = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  /* ── helpers ── */
  const getAuth     = () => JSON.parse(localStorage.getItem("recruiter")) || {};
  const getEmail    = ()  => getAuth().email || "default";
  const jobsKey     = ()  => `hireon_jobs_${getEmail()}`;
  const promptKey   = ()  => `hireon_rec_prompted_${getEmail()}`;

  const isProfileComplete = (r) => {
    const auth = r || getAuth();
    const email = auth.email || "";
    const profile = JSON.parse(localStorage.getItem(`recruiterProfile_${email}`)) || {};
    const company = JSON.parse(localStorage.getItem(`recruiterCompany_${email}`)) || {};
    const recOk  = !!(profile.name?.trim() || auth.name?.trim())
                && !!(profile.designation?.trim())
                && !!(profile.phone?.trim());
    const compOk = !!(company.name?.trim())
                && !!(company.industry?.trim())
                && !!(company.headquarters?.trim());
    return recOk && compOk;
  };

  /* ── jobs — scoped per recruiter ── */
  const [jobs, setJobs] = useState(() => {
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "default";
    return JSON.parse(localStorage.getItem(`hireon_jobs_${email}`)) || [];
  });

  useEffect(() => {
    // Save this recruiter's jobs under their own key
    localStorage.setItem(jobsKey(), JSON.stringify(jobs));
    // Merge into global hireon_jobs so candidates can see all jobs
    const recEmail  = getEmail();
    const allJobs   = JSON.parse(localStorage.getItem("hireon_jobs")) || [];
    const otherJobs = allJobs.filter(j => j.recruiterEmail !== recEmail);
    localStorage.setItem("hireon_jobs", JSON.stringify([...otherJobs, ...jobs]));
  }, [jobs]);

  /* ── load recruiter + prompt check ── */
  useEffect(() => {
    const r = getAuth();
    setRecruiter(r);
    const prompted   = localStorage.getItem(promptKey());
    const hasProfile = isProfileComplete(r);
    if (!prompted && !hasProfile) {
      setIsFirstLogin(true);
      setShowPrompt(true);
    }
  }, [modal]);

  const setPrompted = () => localStorage.setItem(promptKey(), "1");

  const handlePromptFill = () => { setPrompted(); setShowPrompt(false); setModal("recruiterProfile"); };
  const handlePromptSkip = () => { setPrompted(); setShowPrompt(false); };

  /* ── intercept Post a Job ── */
  const handleOpenModal = (action) => {
    if (action === "postJob" && !isProfileComplete()) {
      setIsFirstLogin(false);
      setShowPrompt(true);
      return;
    }
    setModal(action);
  };

  const handleSignOut = () => navigate("/Recruiter/02_LoginRec");

  const handleAddJob = (newJob) => {
    const auth = getAuth();
    setJobs(prev => [...prev, {
      id: Date.now(),
      applicants: 0, accepted: 0, rejected: 0,
      recruiterEmail: auth.email || "",
      recruiterName:  auth.name  || "",
      company: auth.company || newJob.company || "",
      ...newJob,
    }]);
  };

  return (
    <div className={styles.page}>
      <GridCanvas />

      {showPrompt && (
        <ProfilePrompt
          isFirstLogin={isFirstLogin}
          onFillNow={handlePromptFill}
          onSkip={handlePromptSkip}
        />
      )}

      <Navbar
        recruiter={recruiter}
        onSignOut={handleSignOut}
        onOpenModal={setModal}
      />

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot} />
          Recruiter Dashboard
        </div>
        <h1 className={styles.heroTitle}>
          Hire the Best.<br />
          <span className={styles.heroItalic}>Build Great Teams.</span>
        </h1>
        <p className={styles.heroSub}>
          Every tool below is powered by AI to help you find the right talent, screen smarter, and close roles faster.
        </p>
        <div className={styles.statsRow}>
          {[
            { val: String(jobs.length),                                     label: "Active Jobs"      },
            { val: String(jobs.reduce((a,j) => a + (j.applicants||0), 0)), label: "Total Applicants" },
            { val: "AI",                                                     label: "Powered"          },
          ].map(({ val, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statVal}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <ServiceCards jobs={jobs} onOpen={handleOpenModal} />
      <JobListings  jobs={jobs} />

      {modal === "postJob"          && <PostJob          onClose={() => setModal(null)} onAdd={handleAddJob} />}
      {modal === "companyProfile"   && <CompanyProfile   onClose={() => setModal(null)} />}
      {modal === "recruiterProfile" && <RecruiterProfile onClose={() => setModal(null)} />}
      {modal === "hiringStats"      && <HiringStats      jobs={jobs} onClose={() => setModal(null)} />}
      {modal === "ats"              && <AtsScreening     jobs={jobs} onClose={() => setModal(null)} />}
    </div>
  );
};