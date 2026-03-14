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
          <div className={styles.logoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </div>

        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.sub}>Join HIREON and start hiring smarter.</p>

        <form onSubmit={handleStep2} className={styles.form}>

          <p className={styles.formSection}>Account</p>
          {STEP1_FIELDS.map(f => (
            <div key={f.name} className={styles.group}>
              <label htmlFor={`s1-${f.name}`}>{f.label}</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>{f.icon}</span>
                <input
                  id={`s1-${f.name}`}
                  name={f.name}
                  type={f.name === "password" || f.name === "confirm" ? (showPass ? "text" : "password") : f.type}
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

          <p className={styles.formSection}>Your Details <span className={styles.star}>*</span></p>
          {STEP2_FIELDS.map(f => (
            <div key={f.name} className={styles.group}>
              <label htmlFor={`s2-${f.name}`}>{f.label}</label>
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
          <button type="submit" className={styles.btnPrimary}>Create Account</button>
        </form>

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