import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./03_SignupRec.module.css";

const STEP1_FIELDS = [
  { name: "name",        label: "Full Name",        icon: "👤", type: "text",     placeholder: "e.g. Debarpita Das"    },
  { name: "email",       label: "Email Address",    icon: "📧", type: "email",    placeholder: "e.g. you@company.com"  },
  { name: "password",    label: "Password",         icon: "🔒", type: "password", placeholder: "At least 6 characters" },
  { name: "confirm",     label: "Confirm Password", icon: "🔐", type: "password", placeholder: "Re-enter your password" },
];

const STEP2_FIELDS = [
  { name: "designation",  label: "Your Designation",  icon: "🎯", type: "text", placeholder: "e.g. Senior HR Manager",   required: true  },
  { name: "phone",        label: "Phone Number",      icon: "📱", type: "text", placeholder: "+91 XXXXX XXXXX",          required: true  },
  { name: "companyName",  label: "Company Name",      icon: "🏢", type: "text", placeholder: "e.g. Acme Technologies",   required: true  },
  { name: "industry",     label: "Industry",          icon: "💼", type: "text", placeholder: "e.g. Software / FinTech",  required: true  },
  { name: "headquarters", label: "Headquarters",      icon: "📍", type: "text", placeholder: "e.g. Mumbai, India",       required: true  },
];

export const SignupRecruiter = () => {
  const navigate  = useNavigate();
  const [step,     setStep]     = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [input,    setInput]    = useState({
    name: "", email: "", password: "", confirm: "",
    designation: "", phone: "", companyName: "", industry: "", headquarters: "",
  });

  const handleChange = (e) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  /* ── Step 1 validation ── */
  const handleStep1 = (e) => {
    e.preventDefault();
    if (input.password !== input.confirm) { setError("Passwords do not match."); return; }
    if (input.password.length < 6)        { setError("Password must be at least 6 characters."); return; }

    // Check duplicate email
    const allRec = JSON.parse(localStorage.getItem("hireon_recruiters")) || [];
    if (allRec.find(r => r.email === input.email.trim())) {
      setError("This email is already registered. Please sign in.");
      return;
    }
    setError("");
    setStep(2);
  };

  /* ── Step 2 — save everything ── */
  const handleStep2 = (e) => {
    e.preventDefault();
    const missing = STEP2_FIELDS.filter(f => f.required && !input[f.name]?.trim());
    if (missing.length) { setError(`Please fill: ${missing.map(f => f.label).join(", ")}`); return; }

    const email = input.email.trim();

    // Auth record
    const authRecord = {
      name:        input.name.trim(),
      email,
      password:    input.password,
      company:     input.companyName.trim(),
      designation: input.designation.trim(),
    };

    // Save to multi-account array
    const allRec = JSON.parse(localStorage.getItem("hireon_recruiters")) || [];
    allRec.push(authRecord);
    localStorage.setItem("hireon_recruiters", JSON.stringify(allRec));

    // Set active session
    localStorage.setItem("recruiter", JSON.stringify(authRecord));

    // Save scoped recruiter profile (already complete)
    localStorage.setItem(`recruiterProfile_${email}`, JSON.stringify({
      name:        input.name.trim(),
      email,
      phone:       input.phone.trim(),
      designation: input.designation.trim(),
      experience:  "", linkedin: "", bio: "", education: "", certifications: "", specializations: "",
    }));

    // Save scoped company profile (already complete)
    localStorage.setItem(`recruiterCompany_${email}`, JSON.stringify({
      name:         input.companyName.trim(),
      industry:     input.industry.trim(),
      headquarters: input.headquarters.trim(),
      size: "", founded: "", website: "", description: "", mission: "", linkedin: "", email: "", phone: "",
    }));

    // Mark as prompted so wizard never shows for this account
    localStorage.setItem(`hireon_rec_prompted_${email}`, "1");

    navigate("/Recruiter/02_LoginRec");
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>

        {/* Step indicator */}
        <div className={styles.stepRow}>
          <div className={`${styles.stepPill} ${step === 1 ? styles.stepPillActive : styles.stepPillDone}`}>
            {step > 1 ? "✓" : "1"} Account
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepPill} ${step === 2 ? styles.stepPillActive : step > 2 ? styles.stepPillDone : styles.stepPillIdle}`}>
            2 Profile
          </div>
        </div>

        {step === 1 && <>
          <h1 className={styles.title}>Start <span className={styles.grad}>hiring</span> smarter</h1>
          <p className={styles.sub}>Create your account to get started.</p>

          <form onSubmit={handleStep1} className={styles.form}>
            {STEP1_FIELDS.map(f => (
              <div key={f.name} className={styles.group}>
                <label htmlFor={`s1-${f.name}`}>{f.label}</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>{f.icon}</span>
                  <input
                    id={`s1-${f.name}`}
                    name={f.name}
                    type={f.name === "password" ? (showPass ? "text" : "password") : f.type}
                    value={input[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required
                  />
                  {f.name === "password" && (
                    <span className={styles.eyeBtn} onClick={() => setShowPass(v => !v)}>
                      {showPass ? "🙈" : "👁️"}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && <p className={styles.errorMsg}>{error}</p>}
            <button type="submit" className={styles.btnPrimary}>Next — Complete Profile →</button>
          </form>
        </>}

        {step === 2 && <>
          <h1 className={styles.title}>Complete your <span className={styles.grad}>profile</span></h1>
          <p className={styles.sub}>These details help candidates trust your job listings. All fields are required.</p>

          <form onSubmit={handleStep2} className={styles.form}>
            {STEP2_FIELDS.map(f => (
              <div key={f.name} className={styles.group}>
                <label htmlFor={`s2-${f.name}`}>
                  {f.label} <span className={styles.star}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>{f.icon}</span>
                  <input
                    id={`s2-${f.name}`}
                    name={f.name}
                    type={f.type}
                    value={input[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            {error && <p className={styles.errorMsg}>{error}</p>}

            <div className={styles.btnRow}>
              <button type="button" className={styles.btnBack} onClick={() => { setStep(1); setError(""); }}>
                ← Back
              </button>
              <button type="submit" className={styles.btnPrimary}>Create Account</button>
            </div>
          </form>
        </>}

        <div className={styles.links}>
          <Link to="/Recruiter/02_LoginRec" className={styles.link}>Already have an account? Sign In</Link>
        </div>
        <p className={styles.footer}>
          Are you a candidate?{" "}
          <Link to="/Candidate/03_SignupCand" className={styles.switchLink}>Candidate Signup</Link>
        </p>
      </div>
    </div>
  );
};