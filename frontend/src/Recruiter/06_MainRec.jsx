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
import { ProfileWizard }             from "./components/ProfileWizard/ProfileWizard";



export const RecruiterMain = () => {
  const navigate = useNavigate();
  const [modal,        setModal]        = useState(null);
  const [recruiter,    setRecruiter]    = useState({});
  const [showWizard, setShowWizard] = useState(false);

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
    // Profile is always complete after signup (enforced in 03_SignupRec)
    // Wizard only shows if "Post a Job" is clicked without complete profile
  }, [modal]);

  const setPrompted = () => localStorage.setItem(promptKey(), "1");



  /* ── intercept Post a Job ── */
  const handleOpenModal = (action) => {
    if (action === "postJob" && !isProfileComplete()) {
      setPrompted();
      setShowWizard(true);
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

      {showWizard && (
        <ProfileWizard
          onClose={() => setShowWizard(false)}
          onReadyToPost={() => setModal("postJob")}
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