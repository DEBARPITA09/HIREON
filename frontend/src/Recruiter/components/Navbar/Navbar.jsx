import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbar = ({ recruiter = {}, onSignOut, onOpenModal }) => {
  const [open, setOpen] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const dropRef = useRef();
  const name     = recruiter.name || "Recruiter";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Load recruiter photo whenever recruiter prop changes
  React.useEffect(() => {
    const email = recruiter.email || "";
    if (!email) return;
    const photoKey = `recruiterPhoto_${email}`;
    const saved = localStorage.getItem(photoKey);
    if (saved) setPhotoURL(saved);
  }, [recruiter.email]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.topLogo}>
        <span className={styles.logoHire}>HIRE</span>
        <span className={styles.logoOn}>ON</span>
      </div>

      <div className={styles.topRight}>
        {/* Avatar pill + dropdown */}
        <div className={styles.avatarWrap} ref={dropRef}>
          <button className={styles.avatarBtn} onClick={() => setOpen(v => !v)}>
            <div className={styles.avatar}>
              {photoURL
                ? <img src={photoURL} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt="" />
                : initials
              }
            </div>
            <span className={styles.avatarName}>{name.split(" ")[0]}</span>
            <span className={styles.chevron}>{open ? "▲" : "▾"}</span>
          </button>

          {open && (
            <div className={styles.dropdown}>
              {/* Header */}
              <div className={styles.dropHead}>
                <div className={styles.dropAvatarLg}>
                  {photoURL
                    ? <img src={photoURL} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt="" />
                    : initials
                  }
                </div>
                <div className={styles.dropHeadInfo}>
                  <p className={styles.dropName}>{name}</p>
                  {recruiter.designation && <p className={styles.dropDesig}>{recruiter.designation}</p>}
                  {recruiter.email   && <p className={styles.dropMeta}>{recruiter.email}</p>}
                  {recruiter.company && <p className={styles.dropMeta}>🏢 {recruiter.company}</p>}
                </div>
              </div>

              <div className={styles.dropDivider} />

              {/* Menu items */}
              <button className={styles.dropItem} onClick={() => { setOpen(false); onOpenModal("recruiterProfile"); }}>
                My Profile
              </button>
              <button className={styles.dropItem} onClick={() => { setOpen(false); onOpenModal("companyProfile"); }}>
                Company Profile
              </button>

              <div className={styles.dropDivider} />

              <button className={`${styles.dropItem} ${styles.dropItemLogout}`} onClick={() => { setOpen(false); onSignOut(); }}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Instant sign out */}
        <button className={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
};