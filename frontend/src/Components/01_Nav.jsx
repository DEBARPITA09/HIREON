import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./01_Nav.module.css";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={styles.nav + (scrolled ? " " + styles.scrolled : "")}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoSq}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 2V16M15 2V16M3 9H15" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className={styles.logoWord}>HIRE<span>ON</span></span>
      </Link>


    </nav>
  );
};