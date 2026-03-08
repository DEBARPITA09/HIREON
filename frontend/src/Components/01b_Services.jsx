import React from "react";
import styles from "./01b_Services.module.css";

const cData = [
  { icon: "📝", title: "Resume Builder", desc: "Build a clean, professional and ATS-friendly resume from scratch using our guided step-by-step builder.", tag: "Easy Build", tc: "blue" },
  { icon: "🧠", title: "AI Resume Analysis", desc: "Upload your resume and get a detailed AI breakdown of strengths, gaps, keyword matches and improvement tips.", tag: "AI Powered", tc: "blue" },
  { icon: "📊", title: "ATS Score and Insights", desc: "See how Applicant Tracking Systems score your resume and get suggestions to increase your shortlisting chances.", tag: "Smart Score", tc: "blue" },
  { icon: "🎯", title: "Job Recommendations", desc: "Our algorithm matches your profile against live listings and surfaces the most relevant roles for your skills.", tag: "Recommended", tc: "blue" },
  { icon: "📬", title: "Application Status", desc: "Track every job from submitted to shortlisted to rejected, all in one clean real-time dashboard view.", tag: "Stay Updated", tc: "blue" },
  { icon: "👤", title: "Profile Management", desc: "Build a compelling professional profile. Recruiters discover you directly based on your skills and experience.", tag: null, tc: "blue" },
];

const rData = [
  { icon: "📢", title: "Post Job Listings", desc: "Create detailed job posts with role requirements, skills needed and salary details. Reach the right candidates faster.", tag: "Quick Setup", tc: "green" },
  { icon: "📋", title: "Application Management", desc: "View all applicants for each listing in one place. Access resumes, review profiles and take action efficiently.", tag: null, tc: "green" },
  { icon: "📄", title: "Resume Viewer", desc: "Access candidate resumes directly within the platform. No back and forth emails, everything at your fingertips.", tag: "In Platform", tc: "green" },
  { icon: "⭐", title: "Shortlist and Select", desc: "Mark candidates as shortlisted, move them forward or reject applications with a few clicks from your dashboard.", tag: null, tc: "green" },
  { icon: "📈", title: "Recruitment Dashboard", desc: "Get a birds eye view of active listings, total applicants, shortlisted candidates and hiring progress in real time.", tag: null, tc: "green" },
  { icon: "🏢", title: "Company Profile", desc: "Build a strong employer brand. Candidates explore your profile before applying, attracting more quality applications.", tag: null, tc: "green" },
];

export const Services = () => {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          What We Offer
        </div>
        <h1 className={styles.heroTitle}>
          Powerful Tools for <span className={styles.grad}>Every Side</span> of Hiring
        </h1>
        <p className={styles.heroSub}>
          HIREON equips candidates with AI-driven career tools and gives recruiters
          everything they need to find, evaluate and hire the best talent,
          all within one unified platform.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTagBlue}>For Candidates</div>
        <h2 className={styles.sectionTitle}>Your AI-Powered Career Assistant</h2>
        <p className={styles.sectionSub}>Everything you need to land your next role, from resume to offer letter.</p>
        <div className={styles.grid}>
          {cData.map(function(item) {
            return (
              <div key={item.title} className={styles.card}>
                <span className={styles.cardIcon}>{item.icon}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                {item.tag && <span className={styles.tagBlue}>{item.tag}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTagGreen}>For Recruiters</div>
        <h2 className={styles.sectionTitle}>Your Complete Hiring Dashboard</h2>
        <p className={styles.sectionSub}>Streamline your entire recruitment pipeline from one powerful platform.</p>
        <div className={styles.grid}>
          {rData.map(function(item) {
            return (
              <div key={item.title} className={styles.card}>
                <span className={styles.cardIcon}>{item.icon}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                {item.tag && <span className={styles.tagGreen}>{item.tag}</span>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
