import React, { useState, useEffect } from "react";
import styles from "./RecruiterProfile.module.css";

const empty = {
  name: "", email: "", phone: "", designation: "", experience: "",
  linkedin: "", bio: "", education: "", certifications: "", specializations: "",
};

// Required fields for posting a job
const REQUIRED = ["name", "designation", "phone"];

export const RecruiterProfile = ({ onClose }) => {
  const [recruiter, setRecruiter] = useState(empty);
  const [errors, setErrors]       = useState({});
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const profileKey = email ? `recruiterProfile_${email}` : "recruiterProfile_default";
    const stored = JSON.parse(localStorage.getItem(profileKey)) || {};
    setRecruiter({ ...empty, name: auth.name || "", email: auth.email || "", ...stored });
  }, []);

  const initial = (recruiter.name || "R").charAt(0).toUpperCase();
  const handleChange = (e) => {
    setRecruiter({ ...recruiter, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(f => { if (!recruiter[f]?.trim()) errs[f] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const auth = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const profileKey = email ? `recruiterProfile_${email}` : "recruiterProfile_default";
    localStorage.setItem(profileKey, JSON.stringify(recruiter));
    localStorage.setItem("recruiter", JSON.stringify({
      ...auth,
      name: recruiter.name,
      designation: recruiter.designation,
      company: recruiter.company,
    }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const req = (field) => REQUIRED.includes(field);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Recruiter Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.profileTop}>
          <div className={styles.profileAvatarLg}>{initial}</div>
          <div>
            <p className={styles.profileName}>{recruiter.name || "Your Name"}</p>
            <p className={styles.profileSub}>{recruiter.designation || "Recruiter"}{recruiter.email ? ` · ${recruiter.email}` : ""}</p>
          </div>
        </div>

        <p className={styles.requiredNote}><span className={styles.star}>*</span> Required fields must be filled to post a job.</p>

        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.formSection}>Personal Info</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name {req("name") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`} type="text" name="name" value={recruiter.name} onChange={handleChange} placeholder="Your full name" />
              {errors.name && <span className={styles.errorMsg}>Required</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Designation {req("designation") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.designation ? styles.inputError : ""}`} type="text" name="designation" value={recruiter.designation} onChange={handleChange} placeholder="e.g. Senior HR Manager" />
              {errors.designation && <span className={styles.errorMsg}>Required</span>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" name="email" value={recruiter.email} onChange={handleChange} placeholder="you@company.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone {req("phone") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.phone ? styles.inputError : ""}`} type="text" name="phone" value={recruiter.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              {errors.phone && <span className={styles.errorMsg}>Required</span>}
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
            <input className={styles.input} type="text" name="specializations" value={recruiter.specializations} onChange={handleChange} placeholder="e.g. Tech Hiring, Campus Recruitment" />
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
            <button type="submit" className={styles.btnSubmit}>
              {saved ? "✓ Saved!" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};