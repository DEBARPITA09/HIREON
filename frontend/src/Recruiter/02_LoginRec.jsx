import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./02_LoginRec.module.css";

export const LoginRecruiter = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError]  = useState("");

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // All recruiter accounts are stored in hireon_recruiters array
    const allRecruiters = JSON.parse(localStorage.getItem("hireon_recruiters")) || [];

    // Fallback: legacy single-account support
    const legacy = JSON.parse(localStorage.getItem("recruiter")) || null;

    const found = allRecruiters.find(
      r => r.email === input.email.trim() && r.password === input.password
    ) || (
      legacy && legacy.email === input.email.trim() && legacy.password === input.password
        ? legacy : null
    );

    if (!found) {
      // Check if email exists but wrong password
      const emailExists = allRecruiters.some(r => r.email === input.email.trim())
        || (legacy?.email === input.email.trim());
      setError(emailExists
        ? "Incorrect password. Please try again."
        : "No account found with this email. Please sign up first."
      );
      return;
    }

    // Set active recruiter session
    localStorage.setItem("recruiter", JSON.stringify(found));

    // Clear the first-login prompt flag per-account so new accounts always get prompted
    // (flag is stored per email so it persists correctly)
    const promptKey = `hireon_rec_prompted_${found.email}`;
    // if never prompted for this account, don't set — MainRec will handle it

    navigate("/Recruiter/06_MainRec");
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

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.group}>
            <label htmlFor="login-email">Your email</label>
            <input
              id="login-email" name="email" type="email"
              value={input.email} onChange={handleChange}
              placeholder="e.g. you@example.com"
              className={styles.input} required
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="login-password">Your password</label>
            <input
              id="login-password" name="password" type="password"
              value={input.password} onChange={handleChange}
              placeholder="Enter your password"
              className={styles.input} required
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.btnPrimary}>Sign In</button>
        </form>

        <div className={styles.hyperlinks}>
          <Link to="/Recruiter/03_SignupRec" className={styles.hlink}>Don&#39;t have an account?</Link>
          <Link to="/Recruiter/ForgotPassword" className={styles.hlink}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};