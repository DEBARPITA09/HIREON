import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./02_LoginCand.module.css";

export const LoginCandidate = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: input.email,
          password: input.password,
        },
        { withCredentials: true }
      );

      // Save user info to localStorage so other pages can use it
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Go to candidate dashboard
      navigate("/Candidate/06_MainCand");

    } catch (err) {
      // Show the error message from backend
      const message = err.response?.data?.message || "Login failed. Please try again.";
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

        <h1 className={styles.title}>Good to see you again</h1>

        <form onSubmit={handleLogin} className={styles.form}>

          <div className={styles.group}>
            <label htmlFor="login-email">Your email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={input.email}
              onChange={handleChange}
              placeholder="e.g. you@example.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="login-password">Your password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={input.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className={styles.hyperlinks}>
          <Link to="/Candidate/03_SignupCand" className={styles.hlink}>Don&#39;t have an account?</Link>
          <Link to="/Candidate/04_ForgotPassword" className={styles.hlink}>Forgot password?</Link>
        </div>

      </div>
    </div>
  );
};