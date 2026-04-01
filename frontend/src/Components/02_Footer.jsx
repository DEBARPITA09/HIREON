import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./02_Footer.module.css";

/* ── SVG H ICON ── */
const HIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkArrow = () => (
  <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ══════════════════════════════════════
   POLICY CONTENT DATA
══════════════════════════════════════ */
const POLICIES = {
  privacy: {
    title: "Privacy Policy",
    sub: "How we collect, use and protect your personal data",
    updated: "Last updated: March 2026",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    sections: [
      {
        title: "Information We Collect",
        content: (
          <>
            <p>When you use HIREON, we collect information you provide directly and information generated through your use of the platform.</p>
            <ul>
              <li>Account information — name, email, phone number and password at registration</li>
              <li>Profile and resume data — education, work experience, skills and career preferences</li>
              <li>Job application data — applications submitted, recruiter interactions and hiring outcomes</li>
              <li>Device and usage data — IP address, browser type, pages visited and session duration</li>
              <li>Communication data — messages exchanged between candidates and recruiters on the platform</li>
            </ul>
            <p>We do not collect sensitive personal data such as biometric data, health records or government ID numbers unless explicitly required and consented to.</p>
          </>
        ),
      },
      {
        title: "How We Use Your Information",
        content: (
          <>
            <p>HIREON uses collected data to operate, improve and personalise your experience. Specifically we use it to:</p>
            <ul>
              <li>Create and manage your account and authenticate your identity securely</li>
              <li>Power our AI resume engine to generate your personalised ATS score and suggestions</li>
              <li>Match your profile with the most relevant job listings based on skills and experience</li>
              <li>Enable recruiters to discover and evaluate candidate profiles for their open roles</li>
              <li>Send you notifications about application status updates and new job matches</li>
            </ul>
            <div className={styles.modalBox}>
              <p><strong>We never sell your personal data.</strong> Your information is used solely to power your experience on HIREON and to improve the platform for all users.</p>
            </div>
          </>
        ),
      },
      {
        title: "Data Storage and Security",
        content: (
          <>
            <p>All data on HIREON is stored on secure, encrypted servers using TLS encryption for data in transit and AES-256 encryption for data at rest. We conduct regular security audits and penetration tests.</p>
            <p>Access to user data is restricted to authorised personnel only, all of whom are bound by strict confidentiality agreements. In the event of a data breach, we will notify affected users and relevant authorities within 72 hours.</p>
          </>
        ),
      },
      {
        title: "Sharing of Information",
        content: (
          <>
            <p>HIREON shares your information only in these limited circumstances:</p>
            <ul>
              <li><strong>With recruiters</strong> — when you apply to a job, your profile and resume are shared with that recruiter</li>
              <li><strong>With service providers</strong> — trusted vendors for hosting and analytics, all bound by data processing agreements</li>
              <li><strong>For legal compliance</strong> — when required by law, court order, or to protect user safety</li>
            </ul>
            <p>We do not share your data with advertisers, data brokers or any third party for commercial gain.</p>
          </>
        ),
      },
      {
        title: "Your Rights",
        content: (
          <>
            <p>As a HIREON user you have the right to access, correct, delete and export your personal data at any time. You may also opt out of marketing communications. To exercise any of these rights, contact <strong>privacy@hireon.com</strong> or use the account settings in your dashboard.</p>
          </>
        ),
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    sub: "The rules that govern your use of HIREON",
    updated: "Last updated: March 2026",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    sections: [
      {
        title: "Acceptance of Terms",
        content: (
          <>
            <p>By accessing or using HIREON — including our website, applications and all related services — you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
          </>
        ),
      },
      {
        title: "User Accounts and Eligibility",
        content: (
          <>
            <p>You must be at least 18 years of age to register. All information provided at registration must be accurate and up to date.</p>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You may not share or transfer your account to any other person</li>
              <li>Notify us immediately at <strong>support@hireon.com</strong> if you suspect unauthorised access</li>
              <li>HIREON reserves the right to suspend accounts that violate these terms</li>
            </ul>
          </>
        ),
      },
      {
        title: "Candidate Responsibilities",
        content: (
          <>
            <p>As a candidate on HIREON, you agree to provide truthful and accurate profile information — misrepresentation of qualifications is strictly prohibited. You must use the platform solely for legitimate job searching and must not use automated tools or bots to interact with the platform.</p>
          </>
        ),
      },
      {
        title: "Recruiter Responsibilities",
        content: (
          <>
            <p>As a recruiter, you agree to:</p>
            <ul>
              <li>Post only genuine, currently available job openings</li>
              <li>Not discriminate against candidates on any protected characteristic</li>
              <li>Use candidate data solely for the purpose of recruitment on HIREON</li>
              <li>Remove job listings promptly when positions are filled or withdrawn</li>
            </ul>
            <div className={styles.modalBox}>
              <p>Violation of recruiter responsibilities may result in immediate account suspension and potential legal action under applicable Indian employment laws.</p>
            </div>
          </>
        ),
      },
      {
        title: "Intellectual Property",
        content: (
          <>
            <p>All platform content — including design, code, logos, text and AI models — is owned by or licensed to HIREON. You retain ownership of content you upload (such as your resume), but grant HIREON a limited licence to process and display it to operate the platform.</p>
          </>
        ),
      },
      {
        title: "Prohibited Conduct",
        content: (
          <>
            <ul>
              <li>Posting fraudulent or misleading job listings</li>
              <li>Scraping or harvesting user data from the platform</li>
              <li>Attempting to reverse engineer or tamper with platform systems</li>
              <li>Uploading malware, viruses or any harmful code</li>
              <li>Harassing, threatening or abusing other users</li>
            </ul>
          </>
        ),
      },
      {
        title: "Limitation of Liability",
        content: (
          <>
            <p>HIREON is a technology intermediary and makes no guarantees regarding job placement, interview outcomes or employment results. To the maximum extent permitted by Indian law, HIREON's liability for any claim shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
            <p>For legal questions contact <strong>legal@hireon.com</strong>. These terms are governed by the laws of India and subject to the jurisdiction of courts in Bhubaneswar, Odisha.</p>
          </>
        ),
      },
    ],
  },

  cookies: {
    title: "Cookie Policy",
    sub: "How we use cookies and tracking technologies",
    updated: "Last updated: March 2026",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="8" cy="9" r="1" fill="currentColor"/>
        <circle cx="15" cy="8" r="1" fill="currentColor"/>
        <circle cx="9" cy="15" r="1" fill="currentColor"/>
        <circle cx="14.5" cy="14" r="1.5" fill="currentColor"/>
      </svg>
    ),
    sections: [
      {
        title: "What Are Cookies?",
        content: (
          <>
            <p>Cookies are small text files placed on your device when you visit HIREON. They allow the platform to remember your actions and preferences so you don't have to re-enter them each time you visit or navigate between pages.</p>
            <p>We also use similar technologies such as web beacons and local storage. In this policy, we refer to all such technologies collectively as "cookies."</p>
          </>
        ),
      },
      {
        title: "Types of Cookies We Use",
        content: (
          <>
            <ul>
              <li><strong>Strictly Necessary</strong> — Essential for the platform to function, including authentication and security cookies. These cannot be disabled.</li>
              <li><strong>Performance</strong> — Help us understand how visitors interact with HIREON — which pages are visited, where time is spent, and where errors occur. All data is aggregated and anonymised.</li>
              <li><strong>Functionality</strong> — Remember your preferences such as saved job searches and resume upload history to personalise your experience.</li>
              <li><strong>Analytics</strong> — Used with tools like Google Analytics to measure traffic and improve the product.</li>
            </ul>
            <div className={styles.modalBox}>
              <p>HIREON does <strong>not</strong> use advertising or tracking cookies, and does not allow third-party advertisers to set cookies on our platform.</p>
            </div>
          </>
        ),
      },
      {
        title: "Cookie Duration",
        content: (
          <>
            <ul>
              <li><strong>Session cookies</strong> — deleted automatically when you close your browser. Used to keep your session active while you navigate the platform.</li>
              <li><strong>Persistent cookies</strong> — remain on your device for up to 12 months to remember preferences and return visits.</li>
            </ul>
          </>
        ),
      },
      {
        title: "Managing Your Cookie Preferences",
        content: (
          <>
            <p>You have several options for managing cookies:</p>
            <ul>
              <li><strong>Browser settings</strong> — most browsers allow you to block or delete cookies through their settings menu</li>
              <li><strong>Account settings</strong> — logged-in users can manage analytics cookie preferences under Privacy Settings in the dashboard</li>
              <li><strong>Google Analytics opt-out</strong> — use the Google Analytics Opt-out Browser Add-on to disable analytics tracking</li>
            </ul>
            <p>Note that disabling strictly necessary cookies will affect platform functionality such as auto-login and saved searches.</p>
          </>
        ),
      },
      {
        title: "Questions?",
        content: (
          <>
            <p>For questions about our use of cookies, contact <strong>privacy@hireon.com</strong>. We aim to respond to all privacy-related queries within 5 business days.</p>
          </>
        ),
      },
    ],
  },
};

/* ══════════════════════════════════════
   MODAL COMPONENT
══════════════════════════════════════ */
const PolicyModal = ({ type, onClose }) => {
  const p = POLICIES[type];
  if (!p) return null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>

        {/* HEADER */}
        <div className={styles.modalHead}>
          <div className={styles.modalHeadLeft}>
            <div className={styles.modalIcon}>{p.icon}</div>
            <div>
              <div className={styles.modalTitle}>{p.title}</div>
              <div className={styles.modalSub}>{p.sub}</div>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          {p.sections.map((sec, i) => (
            <div key={i} className={styles.modalSection}>
              <div className={styles.modalSecTitle}>
                <span className={styles.modalSecNum}>{String(i + 1).padStart(2, "0")}</span>
                {sec.title}
              </div>
              <div className={styles.modalText}>
                {React.Children.map(sec.content.props.children, (child) => {
                  if (!child) return null;
                  if (child.type === "ul") {
                    return (
                      <ul className={styles.modalUl}>
                        {React.Children.map(child.props.children, (li) =>
                          li ? <li>{li.props.children}</li> : null
                        )}
                      </ul>
                    );
                  }
                  return child;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.modalFoot}>
          <span className={styles.modalUpdated}>{p.updated}</span>
          <button onClick={onClose}>Got it</button>
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   FAQ DATA
══════════════════════════════════════ */
const FAQ_CATEGORIES = [
  {
    cat: "Getting Started",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    items: [
      { q: "How do I create a HIREON account?", a: "Click the Candidate or Recruiter button in the top navigation, then choose Sign Up. Fill in your name, email and password — your account is ready instantly." },
      { q: "Is HIREON free to use?", a: "Yes. HIREON is completely free for candidates. Recruiters also have full access to all core features at no cost during our launch phase." },
      { q: "What is the difference between Candidate and Recruiter accounts?", a: "Candidates can upload resumes, get ATS scores, browse jobs and track applications. Recruiters can post jobs, search candidate profiles and manage their hiring pipeline." },
    ],
  },
  {
    cat: "Resume & ATS Score",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    items: [
      { q: "What is an ATS score?", a: "ATS stands for Applicant Tracking System — software recruiters use to filter resumes before a human ever sees them. Your ATS score on HIREON tells you how likely your resume is to pass these automated filters." },
      { q: "How does AI resume analysis work?", a: "Upload your resume and our AI engine parses your content, evaluates your skills and experience against industry benchmarks, checks formatting and keyword density, then gives you a detailed score with specific, actionable improvement suggestions." },
      { q: "What if my ATS score is low?", a: "Review the suggestions in your analysis report. Common fixes include adding relevant keywords from target job descriptions, improving formatting (avoid tables and graphics), and expanding your skills section. Small changes can make a significant difference." },
      { q: "Which resume formats does HIREON support?", a: "We support PDF and DOCX formats. We recommend PDF for the most accurate analysis as it preserves formatting reliably across different systems." },
    ],
  },
  {
    cat: "Jobs & Applications",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    items: [
      { q: "How do job recommendations work?", a: "Our algorithm compares your profile, resume skills and career preferences against active job listings and surfaces the most relevant roles for you automatically. The more complete your profile, the better your matches." },
      { q: "Can I apply to multiple jobs at once?", a: "Yes. You can apply to as many jobs as you like. Each application is tracked separately in your Candidate dashboard under My Applications." },
      { q: "How do I track my application status?", a: "In your dashboard, the My Applications section shows real-time status updates for every role — from Submitted through Shortlisted, Interview Scheduled or Rejected." },
    ],
  },
  {
    cat: "Account & Security",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    items: [
      { q: "How do I reset my password?", a: "On the login page, click Forgot Password and enter your registered email. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive." },
      { q: "How do I update my resume or profile?", a: "Log in and go to your Profile section. You can edit your personal details, work experience and skills at any time. To update your resume, go to Resume under your dashboard and upload a new file." },
      { q: "How do I delete my account?", a: "Go to Settings in your dashboard and select Delete Account. This action is permanent — all your data including applications, resume and profile will be removed immediately and cannot be recovered." },
      { q: "Is my data safe on HIREON?", a: "Yes. All data is encrypted at rest and in transit. We follow industry-standard security practices including regular audits and penetration testing. We never sell your data. See our Privacy Policy for full details." },
    ],
  },
];

/* ── FAQ MODAL ── */
const FaqModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} style={{ maxWidth: 740 }}>

        <div className={styles.modalHead}>
          <div className={styles.modalHeadLeft}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div className={styles.modalTitle}>Frequently Asked Questions</div>
              <div className={styles.modalSub}>Everything you need to know about HIREON</div>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* TABS */}
        <div className={styles.faqTabs}>
          {FAQ_CATEGORIES.map((cat, i) => (
            <button key={i} className={`${styles.faqTab} ${activeTab === i ? styles.faqTabActive : ""}`} onClick={() => { setActiveTab(i); setOpenItem(null); }}>
              <span className={styles.faqTabIcon}>{cat.icon}</span>
              {cat.cat}
            </button>
          ))}
        </div>

        <div className={styles.modalBody}>
          <div className={styles.faqList}>
            {FAQ_CATEGORIES[activeTab].items.map((item, i) => (
              <div key={i} className={`${styles.faqItem} ${openItem === i ? styles.faqItemOpen : ""}`}>
                <button className={styles.faqQ} onClick={() => setOpenItem(openItem === i ? null : i)}>
                  <span>{item.q}</span>
                  <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openItem === i && (
                  <div className={styles.faqA}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalFoot}>
          <span className={styles.modalUpdated}>Can't find your answer? Use the Support form →</span>
          <button onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

/* ── SUPPORT MODAL ── */
const SupportModal = ({ onClose }) => {
  const [form, setForm] = useState({ name:"", email:"", type:"General Enquiry", message:"" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim())   e.email   = "Required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };
  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} style={{ maxWidth: 580 }}>

        <div className={styles.modalHead}>
          <div className={styles.modalHeadLeft}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div className={styles.modalTitle}>Contact Support</div>
              <div className={styles.modalSub}>We typically respond within 24 hours</div>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {sent ? (
            <div className={styles.supportSuccess}>
              <div className={styles.supportSuccessIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. Our support team will get back to you at <strong>{form.email}</strong> within 24 hours.</p>
            </div>
          ) : (
            <div className={styles.supportForm}>

              {/* Quick contact info */}
              <div className={styles.supportInfo}>
                {[
                  { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:"Email us", val:"support@hireon.com" },
                  { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:"Hours", val:"Mon–Fri, 9am–6pm IST" },
                ].map((item, i) => (
                  <div key={i} className={styles.supportInfoItem}>
                    <div className={styles.supportInfoIcon}>{item.icon}</div>
                    <div>
                      <div className={styles.supportInfoLabel}>{item.label}</div>
                      <div className={styles.supportInfoVal}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className={styles.supportRow}>
                <div className={styles.supportGroup}>
                  <label>Your Name</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe" className={errors.name ? styles.inputErr : ""}/>
                  {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>
                <div className={styles.supportGroup}>
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" className={errors.email ? styles.inputErr : ""}/>
                  {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.supportGroup}>
                <label>Topic</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  {["General Enquiry","Resume / ATS Issue","Job Application Issue","Account & Login","Recruiter Support","Bug Report","Other"].map(t=>(
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.supportGroup}>
                <label>Message</label>
                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe your issue or question in detail..." rows={4} className={errors.message ? styles.inputErr : ""}/>
                {errors.message && <span className={styles.errMsg}>{errors.message}</span>}
              </div>

            </div>
          )}
        </div>

        <div className={styles.modalFoot}>
          {sent
            ? <span className={styles.modalUpdated}>support@hireon.com</span>
            : <span className={styles.modalUpdated}>All fields marked are required</span>
          }
          {sent
            ? <button onClick={onClose}>Close</button>
            : <button onClick={submit}>Send Message</button>
          }
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   FOOTER COMPONENT
══════════════════════════════════════ */
export const Footer = () => {
  const [modal, setModal] = useState(null); // 'privacy' | 'terms' | 'cookies' | 'faq' | 'support'

  return (
    <>
      {modal && ["privacy","terms","cookies"].includes(modal) && <PolicyModal type={modal} onClose={() => setModal(null)} />}
      {modal === "faq"     && <FaqModal     onClose={() => setModal(null)} />}
      {modal === "support" && <SupportModal onClose={() => setModal(null)} />}

      <footer className={styles.footer}>

        {/* ── MAIN GRID ── */}
        <div className={styles.body}>

          {/* BRAND */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoSq}><HIcon /></div>
              <span className={styles.logoWord}>HIRE<span>ON</span></span>
            </Link>

            <p className={styles.tagline}>
              AI-powered hiring for candidates and recruiters. Smarter resumes. Better matches. Faster decisions.
            </p>

            <div className={styles.locationPill}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Bhubaneswar, Odisha, India</span>
            </div>

            <div className={styles.socials}>
              {[
                { label: "LinkedIn", path: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></> },
                { label: "X", path: <path d="M4 4l16 16M4 20L20 4"/> },
                { label: "Instagram", path: <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></> },
                { label: "GitHub", path: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/> },
              ].map(s => (
                <a key={s.label} href="#" className={styles.socialBtn} aria-label={s.label}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.path}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* PLATFORM */}
          <div className={styles.linkCol}>
            <div className={styles.colHead}>Platform</div>
            {[["/" ,"Home"],[ "/about","About Us"],["/contact","Contact"],["/help","Help Center"]].map(([to,label]) => (
              <Link key={to} to={to}><span>{label}</span><LinkArrow /></Link>
            ))}
          </div>

          {/* PORTALS */}
          <div className={styles.linkCol}>
            <div className={styles.colHead}>Portals</div>
            <Link to="/Candidate/01_Candidate"><span>Candidate Portal</span><LinkArrow /></Link>
            <Link to="/Recruiter/01_Recruiter"><span>Recruiter Portal</span><LinkArrow /></Link>
            <button className={styles.colBtn} onClick={() => setModal("faq")}><span>FAQs</span><LinkArrow /></button>
            <button className={styles.colBtn} onClick={() => setModal("support")}><span>Support</span><LinkArrow /></button>
          </div>

          {/* CONTACT */}
          <div className={styles.linkCol}>
            <div className={styles.colHead}>Get in Touch</div>
            {[
              { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, text:"support@hireon.com" },
              { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.31h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.77-1.77a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, text:"+91 98765 43210" },
              { icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text:"Mon–Fri, 9am–6pm IST" },
            ].map((item, i) => (
              <div key={i} className={styles.contactItem}>{item.icon}{item.text}</div>
            ))}
          </div>

        </div>

        {/* ── DIVIDER ── */}
        <div className={styles.divider} />

        {/* ── BOTTOM BAR ── */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} <strong>HIREON</strong>. All rights reserved.</p>

          <div className={styles.bottomLinks}>
            <button className={styles.policyLink} onClick={() => setModal("privacy")}>Privacy Policy</button>
            <button className={styles.policyLink} onClick={() => setModal("terms")}>Terms of Service</button>
            <button className={styles.policyLink} onClick={() => setModal("cookies")}>Cookie Policy</button>
          </div>

          <div className={styles.madeBadge}>
            Made with <span className={styles.heartPulse}>♥</span> in India
          </div>
        </div>

        {/* ── STATUS STRIP ── */}
        <div className={styles.statusStrip}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>All systems operational — <strong>hireon.com</strong> is live</span>
        </div>

      </footer>
    </>
  );
};