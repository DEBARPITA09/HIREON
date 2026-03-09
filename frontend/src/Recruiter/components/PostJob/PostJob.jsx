import React, { useState } from "react";
import styles from "./PostJob.module.css";

const empty = {
  company: "", role: "", description: "", salary: "",
  deadline: "", location: "", mode: "Remote",
  type: "Full-time", experience: "", skills: "", openings: "1",
};

export const PostJob = ({ onClose, onAdd }) => {
  const [jobData, setJobData] = useState(empty);
  const handleChange = (e) => setJobData({ ...jobData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...jobData, applicants: 0, accepted: 0, rejected: 0 });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Post a Job</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>

          <p className={styles.formSection}>Basic Info</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input className={styles.input} type="text" name="company" value={jobData.company} onChange={handleChange} placeholder="e.g. Google" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title / Role</label>
              <input className={styles.input} type="text" name="role" value={jobData.role} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Job Description</label>
            <textarea className={styles.textarea} name="description" value={jobData.description} onChange={handleChange} placeholder="Describe responsibilities, expectations, team culture..." rows={3} />
          </div>

          <p className={styles.formSection}>Work Details</p>
          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Work Mode</label>
              <select className={styles.input} name="mode" value={jobData.mode} onChange={handleChange}>
                <option>Remote</option><option>On-site</option><option>Hybrid</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type</label>
              <select className={styles.input} name="type" value={jobData.type} onChange={handleChange}>
                <option>Full-time</option><option>Part-time</option>
                <option>Contract</option><option>Internship</option><option>Freelance</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>No. of Openings</label>
              <input className={styles.input} type="number" name="openings" min="1" value={jobData.openings} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input className={styles.input} type="text" name="location" value={jobData.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Experience Required</label>
              <input className={styles.input} type="text" name="experience" value={jobData.experience} onChange={handleChange} placeholder="e.g. 2-4 years" />
            </div>
          </div>

          <p className={styles.formSection}>Compensation & Deadline</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Salary / CTC</label>
              <input className={styles.input} type="text" name="salary" value={jobData.salary} onChange={handleChange} placeholder="e.g. ₹12–18 LPA" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Application Deadline</label>
              <input className={styles.input} type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Required Skills</label>
            <input className={styles.input} type="text" name="skills" value={jobData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>Post Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};