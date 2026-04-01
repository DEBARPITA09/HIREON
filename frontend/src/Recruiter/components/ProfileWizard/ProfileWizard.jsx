import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfileWizard.module.css";

const getAuth    = () => JSON.parse(localStorage.getItem("recruiter")) || {};
const profileKey = (email) => `recruiterProfile_${email || "default"}`;
const companyKey = (email) => `recruiterCompany_${email || "default"}`;

const REC_REQUIRED = [
  { field: "name",        label: "Full Name",   type: "text", placeholder: "Your full name" },
  { field: "designation", label: "Designation", type: "text", placeholder: "e.g. Senior HR Manager" },
  { field: "phone",       label: "Phone",       type: "text", placeholder: "+91 XXXXX XXXXX" },
];
const COMP_REQUIRED = [
  { field: "name",         label: "Company Name",  type: "text", placeholder: "e.g. Acme Technologies" },
  { field: "industry",     label: "Industry",      type: "text", placeholder: "e.g. Software / FinTech" },
  { field: "headquarters", label: "Headquarters",  type: "text", placeholder: "e.g. Mumbai, India" },
];

function getMissingRec(profile, auth) {
  return REC_REQUIRED.filter(f => !((profile[f.field] || auth[f.field] || "").trim()));
}
function getMissingComp(company) {
  return COMP_REQUIRED.filter(f => !(company[f.field] || "").trim());
}

function StepRecruiter({ onNext, onClose }) {
  const auth    = getAuth();
  const email   = auth.email || "";
  const stored  = JSON.parse(localStorage.getItem(profileKey(email))) || {};
  const missing = getMissingRec(stored, auth);

  const [vals, setVals]     = useState(() => {
    const init = {};
    missing.forEach(f => { init[f.field] = stored[f.field] || auth[f.field] || ""; });
    return init;
  });
  const [errors, setErrors] = useState({});
  const firstRef = useRef();

  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 150); }, []);

  if (!missing.length) { useEffect(() => { onNext(); }, []); return null; }

  const handleSave = () => {
    const errs = {};
    missing.forEach(f => { if (!vals[f.field]?.trim()) errs[f.field] = true; });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const updated = { ...stored, ...vals };
    localStorage.setItem(profileKey(email), JSON.stringify(updated));
    localStorage.setItem("recruiter", JSON.stringify({ ...auth, name: updated.name, designation: updated.designation }));
    onNext();
  };

  return (
    <div className={styles.step}>
      <div className={styles.stepIcon}>👤</div>
      <h2 className={styles.stepTitle}>Complete Your Recruiter Profile</h2>
      <p className={styles.stepSub}>The following required fields are missing. Please fill them to proceed.</p>
      <div className={styles.fields}>
        {missing.map((f, i) => (
          <div key={f.field} className={styles.fieldGroup}>
            <label className={styles.label}>{f.label} <span className={styles.star}>*</span></label>
            <input
              ref={i === 0 ? firstRef : null}
              className={`${styles.input} ${errors[f.field] ? styles.inputError : ""}`}
              type={f.type} placeholder={f.placeholder}
              value={vals[f.field] || ""}
              onChange={e => { setVals(v => ({ ...v, [f.field]: e.target.value })); setErrors(err => ({ ...err, [f.field]: false })); }}
            />
            {errors[f.field] && <span className={styles.errorMsg}>This field is required</span>}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnNext} onClick={handleSave}>Next — Company Details →</button>
      </div>
    </div>
  );
}

function StepCompany({ onDone, onClose }) {
  const auth    = getAuth();
  const email   = auth.email || "";
  const stored  = JSON.parse(localStorage.getItem(companyKey(email))) || {};
  const missing = getMissingComp(stored);

  const [vals, setVals]     = useState(() => {
    const init = {};
    missing.forEach(f => { init[f.field] = stored[f.field] || ""; });
    return init;
  });
  const [errors, setErrors] = useState({});
  const firstRef = useRef();

  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 150); }, []);

  if (!missing.length) { useEffect(() => { onDone(); }, []); return null; }

  const handleSave = () => {
    const errs = {};
    missing.forEach(f => { if (!vals[f.field]?.trim()) errs[f.field] = true; });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const updated = { ...stored, ...vals };
    localStorage.setItem(companyKey(email), JSON.stringify(updated));
    localStorage.setItem("recruiter", JSON.stringify({ ...auth, company: updated.name }));
    onDone();
  };

  return (
    <div className={styles.step}>
      <div className={styles.stepIcon}>🏢</div>
      <h2 className={styles.stepTitle}>Complete Your Company Profile</h2>
      <p className={styles.stepSub}>Almost there — fill in your company details to post a job.</p>
      <div className={styles.fields}>
        {missing.map((f, i) => (
          <div key={f.field} className={styles.fieldGroup}>
            <label className={styles.label}>{f.label} <span className={styles.star}>*</span></label>
            <input
              ref={i === 0 ? firstRef : null}
              className={`${styles.input} ${errors[f.field] ? styles.inputError : ""}`}
              type={f.type} placeholder={f.placeholder}
              value={vals[f.field] || ""}
              onChange={e => { setVals(v => ({ ...v, [f.field]: e.target.value })); setErrors(err => ({ ...err, [f.field]: false })); }}
            />
            {errors[f.field] && <span className={styles.errorMsg}>This field is required</span>}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnNext} onClick={handleSave}>Save &amp; Continue →</button>
      </div>
    </div>
  );
}

function StepDone({ onPost, onClose }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepIcon}>✅</div>
      <h2 className={styles.stepTitle}>Profile Complete!</h2>
      <p className={styles.stepSub}>Your recruiter and company profiles are all set. You can now post your first job.</p>
      <div className={styles.actions}>
        <button className={styles.btnCancel} onClick={onClose}>Not now</button>
        <button className={styles.btnNext} onClick={onPost}>Post a Job Now →</button>
      </div>
    </div>
  );
}

function Progress({ step, total }) {
  const labels = ["Recruiter Profile", "Company Profile", "Ready to Post"];
  return (
    <div className={styles.progress}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={styles.progressStep}>
            <div className={`${styles.progressDot} ${i < step ? styles.done : i === step ? styles.active : ""}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`${styles.progressLabel} ${i === step ? styles.progressLabelActive : ""}`}>{labels[i]}</span>
          </div>
          {i < total - 1 && <div className={`${styles.progressLine} ${i < step ? styles.progressLineDone : ""}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ProfileWizard({ onClose, onReadyToPost }) {
  const [step, setStep] = useState(0);

  // Skip steps if already filled
  const auth    = getAuth();
  const email   = auth.email || "";
  const profile = JSON.parse(localStorage.getItem(profileKey(email))) || {};
  const company = JSON.parse(localStorage.getItem(companyKey(email))) || {};
  const recMissing  = getMissingRec(profile, auth).length > 0;
  const compMissing = getMissingComp(company).length > 0;

  useEffect(() => {
    if (!recMissing && !compMissing) { setStep(2); return; }
    if (!recMissing && compMissing)  { setStep(1); return; }
    setStep(0);
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <Progress step={step} total={3} />
        {step === 0 && <StepRecruiter onNext={() => setStep(1)} onClose={onClose} />}
        {step === 1 && <StepCompany   onDone={() => setStep(2)} onClose={onClose} />}
        {step === 2 && <StepDone onPost={() => { onClose(); onReadyToPost(); }} onClose={onClose} />}
      </div>
    </div>
  );
}