import React, { useState } from "react";
import styles from "./01d_Contact.module.css";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot}></span>
          Contact Us
        </div>
        <h1 className={styles.heroTitle}>
          We would Love to <span className={styles.grad}>Hear From You</span>
        </h1>
        <p className={styles.heroSub}>
          Whether you have a question about our platform, want to report an issue,
          or just want to say hello, our team is here and happy to help.
        </p>
      </div>

      <div className={styles.layout}>

        <div className={styles.infoCol}>
          <h3 className={styles.infoHeading}>Reach Us Directly</h3>

          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📧</span>
            <div>
              <p className={styles.infoLabel}>Email</p>
              <p className={styles.infoValue}>support@hireon.com</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📞</span>
            <div>
              <p className={styles.infoLabel}>Phone</p>
              <p className={styles.infoValue}>+91 98765 43210</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📍</span>
            <div>
              <p className={styles.infoLabel}>Location</p>
              <p className={styles.infoValue}>Bhubaneswar, Odisha, India</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🕐</span>
            <div>
              <p className={styles.infoLabel}>Hours</p>
              <p className={styles.infoValue}>Mon to Fri, 9am to 6pm IST</p>
            </div>
          </div>

          <div className={styles.infoNote}>
            <span>💡</span>
            <p>For faster responses, mention whether you are a Candidate or Recruiter in your message.</p>
          </div>

          <div className={styles.faqBox}>
            <h4 className={styles.faqTitle}>Common Questions</h4>
            <div className={styles.faqItem}>
              <span className={styles.faqDot}></span>
              <p>How do I reset my password?</p>
            </div>
            <div className={styles.faqItem}>
              <span className={styles.faqDot}></span>
              <p>How do I delete my account?</p>
            </div>
            <div className={styles.faqItem}>
              <span className={styles.faqDot}></span>
              <p>Why is my ATS score low?</p>
            </div>
            <div className={styles.faqItem}>
              <span className={styles.faqDot}></span>
              <p>How do I update my resume?</p>
            </div>
            <div className={styles.faqItem}>
              <span className={styles.faqDot}></span>
              <p>Can I apply to multiple jobs?</p>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>✅</span>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. We will get back to you within 24 hours.</p>
              <button className={styles.btnPrimary} onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <div className={styles.form}>
              <h3 className={styles.formTitle}>Send a Message</h3>

              <div className={styles.row}>
                <div className={styles.group}>
                  <label>Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className={styles.group}>
                  <label>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className={styles.group}>
                <label>Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>

              <div className={styles.group}>
                <label>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your question or issue in detail..."
                  rows={5}
                />
              </div>

              <button className={styles.btnPrimary} onClick={handleSubmit}>
                Send Message
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
