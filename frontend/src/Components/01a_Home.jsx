import React from "react";
import { Link } from "react-router-dom";
import styles from "./01a_Home.module.css";

export const Home = () => {
  return (
    <div className={styles.page}>

      {/* ── TOP HERO ── */}
      <section className={styles.hero}>

        <div className={styles.projectName}>
          HIRE<span>ON</span>
        </div>

        <div className={styles.badge}>
          <span className={styles.dot} /> AI-Powered Hiring Platform
        </div>

        <h1 className={styles.title}>
          Where Talent Meets <span className={styles.grad}>Opportunity</span>
        </h1>

        <p className={styles.sub}>
          HIREON is a smart recruitment platform built to eliminate the friction
          in hiring. Candidates get AI-driven resume analysis, ATS scoring, and
          personalised job recommendations. Recruiters get powerful tools to post
          jobs, browse resumes, and shortlist the best talent — all in one place.
        </p>

        {/* ── ROLE CARDS SIDE BY SIDE ── */}
        <div className={styles.roleRow}>

          <Link to="/Candidate/01_Candidate" className={styles.candidateCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎓</span>
              <div>
                <h3>I'm a Candidate</h3>
                <p>Your AI-powered career assistant</p>
              </div>
            </div>
            <ul className={styles.list}>
              <li><span className={styles.check}>✦</span> Upload Resume &amp; AI Analysis</li>
              <li><span className={styles.check}>✦</span> ATS Score &amp; Improvement Tips</li>
              <li><span className={styles.check}>✦</span> Smart Job Recommendations</li>
              <li><span className={styles.check}>✦</span> Real-time Application Tracking</li>
            </ul>
            <div className={styles.cta}>Get Started as Candidate →</div>
          </Link>

          <Link to="/Recruiter/01_Recruiter" className={styles.recruiterCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🏢</span>
              <div>
                <h3>I'm a Recruiter</h3>
                <p>Your complete hiring dashboard</p>
              </div>
            </div>
            <ul className={styles.list}>
              <li><span className={styles.checkG}>✦</span> Post &amp; Manage Job Listings</li>
              <li><span className={styles.checkG}>✦</span> View &amp; Review Applicant Resumes</li>
              <li><span className={styles.checkG}>✦</span> Shortlist &amp; Select Candidates</li>
              <li><span className={styles.checkG}>✦</span> Recruitment Analytics Dashboard</li>
            </ul>
            <div className={styles.ctaG}>Get Started as Recruiter →</div>
          </Link>

        </div>


        

      </section>
    </div>
  );
};
