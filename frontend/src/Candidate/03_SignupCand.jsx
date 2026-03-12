import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./03_SignupCand.module.css";

export const SignupCandidate = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation first
    if (input.password !== input.confirm) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }
    if (input.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    if (input.name.length < 3 || input.name.length > 8) {
      setError("Username must be between 3 and 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username: input.name,
          email: input.email,
          password: input.password,
          role: "student", // Candidate = student role
        },
        { withCredentials: true }
      );

      // Save user info
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Go to login page after successful signup
      navigate("/Candidate/02_LoginCand");

    } catch (err) {
      const message = err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
                placeholder="e.g. Debarpita"
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
                placeholder="At least 4 characters"
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

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

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