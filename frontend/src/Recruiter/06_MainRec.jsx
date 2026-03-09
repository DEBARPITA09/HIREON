import React, { useEffect, useState } from "react";
import styles from "./06_MainRec.module.css";

import { Navbar }                    from "./components/Navbar/Navbar";
import { ServiceCards, GridCanvas }  from "./components/ServiceCards/ServiceCards";
import { JobListings }               from "./components/JobListings/JobListings";
import { PostJob }                   from "./components/PostJob/PostJob";
import { CompanyProfile }            from "./components/CompanyProfile/CompanyProfile";
import { RecruiterProfile }          from "./components/RecruiterProfile/RecruiterProfile";
import { HiringStats }               from "./components/HiringStats/HiringStats";

export const RecruiterMain = () => {
  const [modal, setModal] = useState(null);

  const [jobs, setJobs] = useState([
    {
      id: 1, company: "Microsoft", role: "Project Manager",
      applicants: 8,  accepted: 2, rejected: 3,
      deadline: "2025-08-01", salary: "$120,000",
      location: "Bangalore, India", mode: "Hybrid",
      type: "Full-time", experience: "3-5 years",
      skills: "Leadership, Agile, JIRA",
    },
    {
      id: 2, company: "Amazon", role: "SDE II",
      applicants: 12, accepted: 4, rejected: 5,
      deadline: "2025-07-15", salary: "$140,000",
      location: "Hyderabad, India", mode: "Remote",
      type: "Full-time", experience: "2-4 years",
      skills: "Java, AWS, DSA",
    },
  ]);

  const [recruiterName, setRecruiterName] = useState("");
  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("recruiter")) || {};
    setRecruiterName(r.name || "");
  }, [modal]);

  const handleAddJob = (newJob) => {
    setJobs(prev => [...prev, { id: prev.length + 1, ...newJob }]);
  };

  return (
    <div className={styles.page}>
      <GridCanvas />

      <Navbar
        recruiterName={recruiterName}
        onProfileClick={() => setModal("recruiterProfile")}
      />

      {/* ── HERO ── */}
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
            { val: String(jobs.length),                                label: "Active Jobs"      },
            { val: String(jobs.reduce((a,j) => a + j.applicants, 0)), label: "Total Applicants" },
            { val: "AI",                                               label: "Powered"          },
          ].map(({ val, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statVal}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES + JOB LISTINGS ── */}
      <ServiceCards jobs={jobs} onOpen={setModal} />
      <JobListings  jobs={jobs} />

      {/* ── MODALS ── */}
      {modal === "postJob"          && <PostJob          onClose={() => setModal(null)} onAdd={handleAddJob} />}
      {modal === "companyProfile"   && <CompanyProfile   onClose={() => setModal(null)} />}
      {modal === "recruiterProfile" && <RecruiterProfile onClose={() => setModal(null)} />}
      {modal === "hiringStats"      && <HiringStats      jobs={jobs} onClose={() => setModal(null)} />}
    </div>
  );
};