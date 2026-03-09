import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JobListings.module.css";

export const JobListings = ({ jobs }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionLabel}><span>— Your Postings —</span></div>
      <div className={styles.jobsGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={styles.jobCard}>
            <div className={styles.jobCardTop}>
              <div className={styles.jobInitial}>{job.company[0]}</div>
              <div className={styles.jobInfo}>
                <p className={styles.jobRole}>{job.role}</p>
                <p className={styles.jobCompany}>{job.company}</p>
              </div>
              <span className={styles.jobAppliedTag}>{job.applicants} Applied</span>
            </div>
            <div className={styles.jobTags}>
              {job.mode       && <span className={styles.jobMeta}>{job.mode}</span>}
              {job.type       && <span className={styles.jobMeta}>{job.type}</span>}
              {job.location   && <span className={styles.jobMeta}>📍 {job.location}</span>}
              {job.salary     && <span className={styles.jobMeta}>{job.salary}</span>}
              {job.experience && <span className={styles.jobMeta}>{job.experience}</span>}
            </div>
            <button className={styles.viewBtn} onClick={() => navigate(`/job/${job.id}`)}>
              View Applications →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};