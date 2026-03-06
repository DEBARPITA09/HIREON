import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./02_LoginRec.module.css";

export const LoginRecruiter = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem("recruiter"));
    if (!loggedUser) {
      setError("No account found. Please sign up first.");
      return;
    }
    if (input.email === loggedUser.email && input.password === loggedUser.password) {
      navigate("/Recruiter/04_MainRec");
    } else {
      setError("Wrong email or password. Please try again.");
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
