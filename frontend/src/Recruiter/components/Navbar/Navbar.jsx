import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbar = ({ recruiterName, onProfileClick }) => {
  const navigate  = useNavigate();
  const firstName = (recruiterName || "Recruiter").split(" ")[0];
  const initial   = firstName.charAt(0).toUpperCase();

  return (
    <div className={styles.topBar}>
      <div className={styles.topLogo}>
        <span className={styles.logoHire}>HIRE</span>
        <span className={styles.logoOn}>ON</span>
      </div>
      <div className={styles.topRight}>
        <div className={styles.userPill} onClick={onProfileClick}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.welcomeText}>Welcome {firstName}</span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={() => navigate("/Recruiter/02_LoginRec")}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};