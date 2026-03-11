import React, { useState } from "react";
import styles from "./01d_Contact.module.css";

export const Contact = () => {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => { setForm({...form,[e.target.name]:e.target.value}); setErrors({...errors,[e.target.name]:""}); };
  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = "Name is required.";
    if (!form.email.trim())   errs.email   = "Email is required.";
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (!form.message.trim()) errs.message = "Message cannot be empty.";
    return errs;
  };
  const handleSubmit = () => { const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return; } setSent(true); };

  const infoItems = [
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:"Email",    value:"support@hireon.com" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.77-1.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label:"Phone",    value:"+91 98765 43210" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label:"Location", value:"Bhubaneswar, Odisha, India" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:"Hours",    value:"Mon–Fri, 9am–6pm IST" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}/> Contact Us</div>
        <h1 className={styles.heroTitle}>We'd Love to <span className={styles.italic}>Hear From You</span></h1>
        <p className={styles.heroSub}>Whether you have a question, want to report an issue, or just want to say hello — our team is here.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.infoCol}>
          <h3 className={styles.infoHeading}>Reach Us Directly</h3>
          {infoItems.map(item=>(
            <div key={item.label} className={styles.infoCard}>
              <div className={styles.infoIcon}>{item.icon}</div>
              <div>
                <p className={styles.infoLabel}>{item.label}</p>
                <p className={styles.infoValue}>{item.value}</p>
              </div>
            </div>
          ))}
          <div className={styles.infoNote}>
            <p>For faster responses, mention whether you are a Candidate or Recruiter in your message.</p>
          </div>
          <div className={styles.faqBox}>
            <div className={styles.faqTitle}>Common Questions</div>
            {["How do I reset my password?","How do I delete my account?","Why is my ATS score low?","How do I update my resume?","Can I apply to multiple jobs?"].map(q=>(
              <div key={q} className={styles.faqItem}>
                <span className={styles.faqDot}/>
                <p>{q}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <div className={styles.successBox}>
              <div className={styles.successCheck}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3>Message Sent</h3>
              <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button className={styles.btnPrimary} onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"",message:""});}}>Send Another</button>
            </div>
          ) : (
            <div className={styles.form}>
              <h3 className={styles.formTitle}>Send a Message</h3>
              <div className={styles.row}>
                <div className={styles.group}>
                  <label>Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={errors.name?styles.inputError:""}/>
                  {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                </div>
                <div className={styles.group}>
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={errors.email?styles.inputError:""}/>
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>
              </div>
              <div className={styles.group}>
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className={errors.subject?styles.inputError:""}/>
                {errors.subject && <span className={styles.errorMsg}>{errors.subject}</span>}
              </div>
              <div className={styles.group}>
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your question in detail..." rows={5} className={errors.message?styles.inputError:""}/>
                {errors.message && <span className={styles.errorMsg}>{errors.message}</span>}
              </div>
              <button className={styles.btnPrimary} onClick={handleSubmit}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};