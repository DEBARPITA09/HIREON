import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./03_SignupCand.module.css";

export const SignupCandidate = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.password !== input.confirm) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }
    if (input.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    const userData = { name: input.name, email: input.email, password: input.password };
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/Candidate/02_LoginCand");
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>

        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Create Account
        </div>

        <h1 className={styles.title}>Start your <span className={styles.grad}>journey</span></h1>
        <p className={styles.sub}>Create your candidate account and get matched with the right opportunities using AI.</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.group}>
            <label htmlFor="signup-name">Full Name</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>👤</span>
              <input
                id="signup-name"
                name="name"
                type="text"
                value={input.name}
                onChange={handleChange}
                placeholder="e.g. Debarpita Das"
                required
              />
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="signup-email">Email Address</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>📧</span>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={input.email}
                onChange={handleChange}
                placeholder="e.g. you@example.com"
                required
              />
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="signup-password">Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="signup-password"
                name="password"
                type={showPass ? "text" : "password"}
                value={input.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
              <span className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="signup-confirm">Confirm Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>🔐</span>
              <input
                id="signup-confirm"
                name="confirm"
                type="password"
                value={input.confirm}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.btnPrimary}>Create Account</button>
        </form>

        <div className={styles.links}>
          <Link to="/Candidate/02_LoginCand" className={styles.link}>Already have an account? Sign In</Link>
        </div>

        <p className={styles.footer}>
          Are you a recruiter?
          <Link to="/Recruiter/03_SignupRec" className={styles.switchLink}>Recruiter Signup</Link>
        </p>
      </div>
    </div>
  );
};
