import React, { useState, useEffect } from "react";
import styles from "./RecruiterProfile.module.css";

const empty = {
  name: "", email: "", phone: "", designation: "", experience: "",
  linkedin: "", bio: "", education: "", certifications: "", specializations: "",
};

export const RecruiterProfile = ({ onClose }) => {
  const [recruiter, setRecruiter] = useState(empty);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recruiter")) || {};
    setRecruiter(prev => ({ ...prev, ...stored }));
  }, []);

  const initial = (recruiter.name || "R").charAt(0).toUpperCase();
  const handleChange = (e) => setRecruiter({ ...recruiter, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("recruiter")) || {};
    localStorage.setItem("recruiter", JSON.stringify({ ...existing, ...recruiter }));
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Recruiter Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* preview strip */}
        <div className={styles.profileTop}>
          <div className={styles.profileAvatarLg}>{initial}</div>
          <div>
            <p className={styles.profileName}>{recruiter.name || "Your Name"}</p>
            <p className={styles.profileSub}>
              {recruiter.designation || "Recruiter"}
              {recruiter.email ? ` · ${recruiter.email}` : ""}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.formSection}>Personal Info</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input className={styles.input} type="text" name="name" value={recruiter.name} onChange={handleChange} placeholder="Your full name" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Designation</label>
              <input className={styles.input} type="text" name="designation" value={recruiter.designation} onChange={handleChange} placeholder="e.g. Senior HR Manager" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" name="email" value={recruiter.email} onChange={handleChange} placeholder="you@company.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input className={styles.input} type="text" name="phone" value={recruiter.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <p className={styles.formSection}>Professional Details</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Years of Experience</label>
              <input className={styles.input} type="text" name="experience" value={recruiter.experience} onChange={handleChange} placeholder="e.g. 7 years" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Profile</label>
              <input className={styles.input} type="url" name="linkedin" value={recruiter.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Specializations</label>
            <input className={styles.input} type="text" name="specializations" value={recruiter.specializations} onChange={handleChange} placeholder="e.g. Tech Hiring, Campus Recruitment, Executive Search" />
          </div>

          <p className={styles.formSection}>Qualifications</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Education</label>
            <input className={styles.input} type="text" name="education" value={recruiter.education} onChange={handleChange} placeholder="e.g. MBA – HR, Delhi University, 2018" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Certifications</label>
            <input className={styles.input} type="text" name="certifications" value={recruiter.certifications} onChange={handleChange} placeholder="e.g. SHRM-CP, LinkedIn Certified Recruiter" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio</label>
            <textarea className={styles.textarea} name="bio" value={recruiter.bio} onChange={handleChange} placeholder="Tell candidates about yourself and your hiring philosophy..." rows={3} />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};