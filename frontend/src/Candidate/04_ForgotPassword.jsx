import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./04_ForgotPassword.module.css";

export const ForgotPasswordCandidate = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser || loggedUser.email !== email) {
      setError("No account found with this email address.");
      return;
    }
    localStorage.setItem("resetEmail", email);
    setSent(true);
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
        {!sent ? (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>🔑</span>
            </div>
            <h1 className={styles.title}>Forgot Password?</h1>
            <p className={styles.sub}>Enter your registered email address and we will send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.group}>
                <label htmlFor="forgot-email">Registered Email Address</label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="e.g. you@example.com"
                  className={styles.input}
                  required
                />
              </div>
              {error && <p className={styles.errorMsg}>{error}</p>}
              <button type="submit" className={styles.btnPrimary}>Next</button>
            </form>
            <div className={styles.backLink}>
              <Link to="/Candidate/02_LoginCand" className={styles.hlink}>Back to Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>📬</span>
            </div>
            <h1 className={styles.title}>Check your inbox</h1>
            
            <button className={styles.resetBtn} onClick={() => navigate("/Candidate/ResetPassword")}>
              Reset Password
            </button>
            <div className={styles.backLink}>
              <Link to="/Candidate/02_LoginCand" className={styles.hlink}>Back to Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
