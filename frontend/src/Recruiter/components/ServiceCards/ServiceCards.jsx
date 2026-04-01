import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceCards.module.css";

const SERVICES = [
  {
    title: "Post a Job",
    desc:  "Create a detailed job listing with role, location, salary, work mode and deadlines to attract the right candidates.",
    tag:   "QUICK POST",   tagColor: "#8ab4f8",
    action: "postJob",
  },
  {
    title: "View Applicants",
    desc:  "Browse all candidates who applied to your roles. Review their profiles, resumes and make accept/reject decisions.",
    tag:   "LIVE",         tagColor: "#81e6a0",
    action: "viewApplicants",
  },
  {
    title: "ATS Screening",
    desc:  "Automatically rank applicants by ATS compatibility scores so you spend time only on the most relevant profiles.",
    tag:   "SMART SCORE",  tagColor: "#fbbf24",
    action: "ats",
  },
  {
    title: "Hiring Statistics",
    desc:  "Visualise your pipeline — accepted, rejected, pending counts, per-job breakdowns and funnel analytics.",
    tag:   "ANALYTICS",    tagColor: "#c084fc",
    action: "hiringStats",
  },
];

/* The GridCanvas is no longer needed — particle bg is handled in 06_MainRec.jsx */
export function GridCanvas() { return null; }

export const ServiceCards = ({ jobs, onOpen }) => {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === "viewApplicants") navigate(`/job/${jobs[0]?.id || 1}`);
    else onOpen(action);
  };

  return (
    <div className={styles.sectionWrap}>
      <h2 className={styles.sectionTitle}>SERVICES</h2>
      <div className={styles.cardsGrid}>
        {SERVICES.map((s) => (
          <div key={s.title} className={styles.card} onClick={() => handleClick(s.action)}>
            <div className={styles.cardArrowWrap}>
              <svg className={styles.cardArrow} width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            <div className={styles.cardTitle}>{s.title}</div>
            <div className={styles.cardDesc}>{s.desc}</div>
            <span
              className={styles.cardTag}
              style={{
                color: s.tagColor,
                borderColor: `${s.tagColor}35`,
                background: `${s.tagColor}10`,
              }}
            >
              {s.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};