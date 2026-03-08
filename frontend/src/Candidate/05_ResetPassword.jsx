import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./05_ResetPassword.module.css";

export const ResetPasswordCandidate = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (input.newPassword !== input.confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }
    const resetEmail = localStorage.getItem("resetEmail");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email === resetEmail) {
      userData.password = input.newPassword;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("resetEmail");
    }
    setSuccess(true);
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

        {!success ? (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>🔒</span>
            </div>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.sub}>Enter your new password below. Make sure it's at least 6 characters long.</p>

            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.group}>
                <label htmlFor="new-password">New Password</label>
                <div className={styles.inputWrap}>
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    value={input.newPassword}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className={styles.input}
                    required
                  />
                  <span className={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                    {showNew ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <div className={styles.group}>
                <label htmlFor="confirm-password">Confirm New Password</label>
                <div className={styles.inputWrap}>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={input.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your new password"
                    className={styles.input}
                    required
                  />
                  <span className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button type="submit" className={styles.btnPrimary}>Update Password</button>
            </form>
          </>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>✅</span>
            </div>
            <h1 className={styles.title}>Password Updated!</h1>
            <p className={styles.sub}>Your password has been successfully reset. You can now sign in with your new password.</p>
            <button className={styles.btnPrimary} onClick={() => navigate("/Candidate/02_LoginCand")}>
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};
