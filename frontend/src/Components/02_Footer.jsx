import React from "react";
import { Link } from "react-router-dom";
import styles from "./02_Footer.module.css";

export const Footer = () => {
    return (
        <div className={styles["my-footer"]}>

            <div className={styles.top}>

                <div className={styles.brand}>
                    <span className={styles.logo}>HIRE<span className={styles.logoBlue}>ON</span></span>
                    <p>AI-powered hiring for candidates and recruiters. Smarter resumes. Better matches. Faster decisions.</p>
                    <div className={styles.tagline}>
                        <span className={styles.dot}></span>
                        Built in Odisha, India
                    </div>
                </div>

                <div className={styles.linksGroup}>

                    <div className={styles.col}>
                        <h4>Platform</h4>
                        <Link to="/">Home</Link>
                        <Link to="/services">Services</Link>
                        <Link to="/about">About Us</Link>
                    </div>

                    <div className={styles.col}>
                        <h4>For You</h4>
                        <Link to="/Candidate/01_Candidate">Candidate Portal</Link>
                        <Link to="/Recruiter/01_Recruiter">Recruiter Portal</Link>
                    </div>

                    <div className={styles.col}>
                        <h4>Support</h4>
                        <Link to="/help">Help Center</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} HIREON. All rights reserved.</p>
                <p>Made with ❤️ for smarter hiring.</p>
            </div>

        </div>
    );
};
