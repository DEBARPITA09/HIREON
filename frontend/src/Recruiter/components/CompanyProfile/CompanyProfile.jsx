import React, { useState, useEffect } from "react";
import styles from "./CompanyProfile.module.css";

const empty = {
  name: "", industry: "", size: "", founded: "", website: "",
  headquarters: "", description: "", mission: "", linkedin: "", email: "", phone: "",
};

// Required fields for posting a job
const REQUIRED = ["name", "industry", "headquarters"];

export const CompanyProfile = ({ onClose }) => {
  const [company, setCompany] = useState(empty);
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const key = email ? `recruiterCompany_${email}` : "recruiterCompany_default";
    const stored = JSON.parse(localStorage.getItem(key)) || {};
    setCompany(prev => ({ ...prev, ...stored }));
  }, []);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(f => { if (!company[f]?.trim()) errs[f] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const auth = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const key = email ? `recruiterCompany_${email}` : "recruiterCompany_default";
    localStorage.setItem(key, JSON.stringify(company));
    localStorage.setItem("recruiter", JSON.stringify({ ...auth, company: company.name }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const req = (field) => REQUIRED.includes(field);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Company Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p className={styles.requiredNote}><span className={styles.star}>*</span> Required fields must be filled to post a job.</p>

        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.formSection}>Identity</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name {req("name") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`} type="text" name="name" value={company.name} onChange={handleChange} placeholder="e.g. Acme Technologies" />
              {errors.name && <span className={styles.errorMsg}>Required</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Industry {req("industry") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.industry ? styles.inputError : ""}`} type="text" name="industry" value={company.industry} onChange={handleChange} placeholder="e.g. Software / FinTech" />
              {errors.industry && <span className={styles.errorMsg}>Required</span>}
            </div>
          </div>
          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Size</label>
              <select className={styles.input} name="size" value={company.size} onChange={handleChange}>
                <option value="">Select</option>
                <option>1–10</option><option>11–50</option><option>51–200</option>
                <option>201–500</option><option>500–1000</option><option>1000+</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Founded Year</label>
              <input className={styles.input} type="text" name="founded" value={company.founded} onChange={handleChange} placeholder="e.g. 2015" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Headquarters {req("headquarters") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.headquarters ? styles.inputError : ""}`} type="text" name="headquarters" value={company.headquarters} onChange={handleChange} placeholder="e.g. Mumbai, India" />
              {errors.headquarters && <span className={styles.errorMsg}>Required</span>}
            </div>
          </div>

          <p className={styles.formSection}>About</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Description</label>
            <textarea className={styles.textarea} name="description" value={company.description} onChange={handleChange} placeholder="What does your company do?" rows={3} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mission Statement</label>
            <textarea className={styles.textarea} name="mission" value={company.mission} onChange={handleChange} placeholder="Your company's mission and values..." rows={2} />
          </div>

          <p className={styles.formSection}>Contact & Links</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <input className={styles.input} type="url" name="website" value={company.website} onChange={handleChange} placeholder="https://yourcompany.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Page</label>
              <input className={styles.input} type="url" name="linkedin" value={company.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/..." />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Email</label>
              <input className={styles.input} type="email" name="email" value={company.email} onChange={handleChange} placeholder="hr@company.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Phone</label>
              <input className={styles.input} type="text" name="phone" value={company.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>
              {saved ? "✓ Saved!" : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};