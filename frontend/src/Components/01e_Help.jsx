import React, { useState } from "react";
import styles from "./01e_Help.module.css";

const faqs = [
  {
    q: "How do I create an account on HIREON?",
    a: "Click Sign Up in the top navigation, choose your role as Candidate or Recruiter, and complete the registration form with your details."
  },
  {
    q: "How does the AI resume analysis work?",
    a: "Once you upload your resume, our AI engine parses it, evaluates your skills and experience, checks it against ATS criteria, and gives you a detailed score with specific improvement suggestions."
  },
  {
    q: "What is an ATS score and why does it matter?",
    a: "ATS stands for Applicant Tracking System. It is software used by companies to filter resumes before a human ever sees them. A higher ATS score means your resume is more likely to reach a real recruiter."
  },
  {
    q: "How do job recommendations work?",
    a: "Our algorithm compares your profile, uploaded resume and skills against active job listings on HIREON and surfaces the most relevant roles for you automatically."
  },
  {
    q: "How do I post a job as a recruiter?",
    a: "Log in as a Recruiter, go to your dashboard and click Post a Job. Fill in the role details, requirements and salary range. Your listing will be visible to candidates immediately."
  },
  {
    q: "How can recruiters view candidate resumes?",
    a: "Recruiters can access the resumes of all candidates who applied to their listings directly from the Applications section of their dashboard. No email exchange is needed."
  },
  {
    q: "Can I apply to multiple jobs at the same time?",
    a: "Yes, you can apply to as many jobs as you like. Each application is tracked separately in your dashboard so you always know the current status of every role you applied for."
  },
  {
    q: "How do I track my job applications?",
    a: "In your Candidate dashboard, the My Applications section shows real time status updates for every job you applied to, from submitted to in review to shortlisted or rejected."
  },
  {
    q: "What should I do if my ATS score is low?",
    a: "Review the suggestions in your analysis report. Common fixes include adding relevant keywords, improving formatting, and making sure your skills section is detailed and up to date."
  },
  {
    q: "Is HIREON free to use?",
    a: "Yes, HIREON is completely free for candidates. Recruiters have access to all core features at no cost as well."
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={open ? styles.faqItemOpen : styles.faqItem}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.faqQ}>
        <span>{q}</span>
        <span className={styles.chevron}>{open ? "-" : "+"}</span>
      </div>
      {open && <p className={styles.faqA}>{a}</p>}
    </div>
  );
};

export const Help = () => {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          Help Center
        </div>
        <h1 className={styles.heroTitle}>
          How Can We <span className={styles.grad}>Help You?</span>
        </h1>
        <p className={styles.heroSub}>
          Find answers to common questions about HIREON for both candidates and recruiters.
          If you still need help, our team is always ready to assist you.
        </p>
      </div>

      <div className={styles.layout}>

        <div className={styles.sidebar}>
          <h3 className={styles.sideHeading}>Browse Topics</h3>

          <div className={styles.sideLink}>
            <span>🎓</span>
            <span>Candidate Guide</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideLink}>
            <span>🏢</span>
            <span>Recruiter Guide</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideLink}>
            <span>🤖</span>
            <span>AI Resume Analysis</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideLink}>
            <span>📊</span>
            <span>ATS Score Guide</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideLink}>
            <span>🔐</span>
            <span>Account and Security</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideLink}>
            <span>📧</span>
            <span>Contact Support</span>
            <span className={styles.arrow}>›</span>
          </div>

          <div className={styles.sideNote}>
            <span>📬</span>
            <div>
              <p className={styles.sideNoteTitle}>Still need help?</p>
              <p className={styles.sideNoteText}>support@hireon.com</p>
            </div>
          </div>
        </div>

        <div className={styles.faqCol}>
          <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map(function(faq) {
              return <FAQItem key={faq.q} q={faq.q} a={faq.a} />;
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
