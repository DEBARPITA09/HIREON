import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./01_Nav.module.css";

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getLinkClass = (path) =>
    location.pathname === path ? styles.active : styles.link;

  const close = () => setMenuOpen(false);

  return (
    <nav className={styles.nav + (scrolled ? " " + styles.scrolled : "")}>

      <Link to="/" className={styles.logo}>
        HIRE<span>ON</span>
      </Link>

      <ul className={styles.links + (menuOpen ? " " + styles.open : "")}>
        <li><Link to="/"         className={getLinkClass("/")}         onClick={close}>Home</Link></li>
        <li><Link to="/services" className={getLinkClass("/services")} onClick={close}>Services</Link></li>
        <li><Link to="/about"    className={getLinkClass("/about")}    onClick={close}>About</Link></li>
        <li><Link to="/contact"  className={getLinkClass("/contact")}  onClick={close}>Contact</Link></li>
        <li><Link to="/help"     className={getLinkClass("/help")}     onClick={close}>Help</Link></li>
      </ul>

      <div className={styles.badge}>
        <span className={styles.dot}></span>
        AI Hiring Platform
      </div>

      <button
        className={styles.hamburger + (menuOpen ? " " + styles.hamburgerOpen : "")}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </nav>
  );
};
