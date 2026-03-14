import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import styles from "./03_SignupCand.module.css";

/* ── Indian Universities list (searchable) ── */
const INDIAN_UNIVERSITIES = [
  "IIT Bombay","IIT Delhi","IIT Madras","IIT Kanpur","IIT Kharagpur",
  "IIT Roorkee","IIT Guwahati","IIT Hyderabad","IIT BHU Varanasi","IIT Indore",
  "IIT Mandi","IIT Patna","IIT Ropar","IIT Jodhpur","IIT Gandhinagar",
  "IIT Tirupati","IIT Dhanbad (ISM)","IIT Palakkad","IIT Jammu","IIT Bhilai",
  "IIT Dharwad","IIT Goa","IIT Bhubaneswar",
  "NIT Trichy","NIT Warangal","NIT Surathkal","NIT Calicut","NIT Rourkela",
  "NIT Allahabad","NIT Nagpur","NIT Jamshedpur","NIT Durgapur","NIT Kurukshetra",
  "NIT Silchar","NIT Hamirpur","NIT Jalandhar","NIT Bhopal","NIT Patna",
  "NIT Raipur","NIT Srinagar","NIT Agartala","NIT Meghalaya","NIT Manipur",
  "BITS Pilani","BITS Goa","BITS Hyderabad",
  "IIIT Hyderabad","IIIT Bangalore","IIIT Allahabad","IIIT Delhi","IIIT Pune",
  "IIIT Jabalpur","IIIT Gwalior","IIIT Kota","IIIT Lucknow","IIIT Ranchi",
  "Delhi University","Jadavpur University","Anna University","Pune University",
  "Mumbai University","Osmania University","Bangalore University",
  "Calcutta University","Madras University","Hyderabad University",
  "VIT Vellore","VIT Chennai","Manipal Institute of Technology",
  "SRM Institute of Science and Technology","Amity University",
  "Thapar Institute of Engineering","PSG College of Technology",
  "KIIT University","Kalinga Institute","Lovely Professional University",
  "Chandigarh University","Symbiosis Institute of Technology",
  "NMIMS Mumbai","Christ University Bangalore","Presidency University",
  "Jamia Millia Islamia","AMU Aligarh","BHU Varanasi","JNU New Delhi",
  "IISER Pune","IISER Kolkata","IISER Mohali","IISER Bhopal","IISER Thiruvananthapuram",
  "XLRI Jamshedpur","IIM Ahmedabad","IIM Bangalore","IIM Calcutta",
  "NIFT Mumbai","NID Ahmedabad","CEPT University",
  "Other",
];

const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);

/* ── Dot grid background (same as LoginPage) ── */
function useBackground(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 55;
    const dots = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00012, vy: (Math.random() - 0.5) * 0.00012,
      r: 0.8 + Math.random() * 1.2, a: 0.08 + Math.random() * 0.18,
      ph: Math.random() * Math.PI * 2,
    }));
    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.01 + d.ph);
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,160,160,${d.a * pulse})`;
        ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 0.1) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x*W, dots[i].y*H);
          ctx.lineTo(dots[j].x*W, dots[j].y*H);
          ctx.strokeStyle = `rgba(120,120,120,${0.07*(1-dist/0.1)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

export const SignupCandidate = () => {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);
  const cardRef    = useRef(null);
  useBackground(canvasRef);

  // Step 1: social connect — stores temp user info from JWT
  // Step 2: username
  // Step 3: profile details
  const [step, setStep]       = useState(1);
  const [tempUser, setTempUser] = useState(null); // from JWT after OAuth

  // Step 2
  const [username, setUsername]   = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  // Step 3
  const [fullName, setFullName]   = useState("");
  const [college, setCollege]     = useState("");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeOpen, setCollegeOpen]     = useState(false);
  const [gradYear, setGradYear]   = useState("");
  const [gradOpen, setGradOpen]   = useState(false);
  const [phone, setPhone]         = useState("");
  const [loading, setLoading]     = useState(false);

  /* 3D tilt */
  useEffect(() => {
    const card = cardRef.current; if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
      const dy = (e.clientY - rect.top  - rect.height/2) / (rect.height/2);
      card.style.transform = `perspective(1100px) rotateY(${dx*4}deg) rotateX(${-dy*4}deg)`;
    };
    const onLeave = () => { card.style.transform = `perspective(1100px) rotateY(0deg) rotateX(0deg)`; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseleave", onLeave); };
  }, []);

  /* Read JWT from URL if redirected from OAuth (same AuthCallback flow) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setTempUser({ ...payload, token });
        localStorage.setItem("hireon_signup_token", token);
        setFullName(payload.name || "");
        setStep(2);
        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);
      } catch { /* ignore */ }
    } else {
      // Check if coming back from OAuth stored in localStorage
      const stored = localStorage.getItem("hireon_signup_token");
      if (stored) {
        try {
          const payload = JSON.parse(atob(stored.split(".")[1]));
          setTempUser({ ...payload, token: stored });
          setFullName(payload.name || "");
          setStep(2);
        } catch { localStorage.removeItem("hireon_signup_token"); }
      }
    }
  }, []);

  /* ── Social OAuth handlers ── */
  const handleSocial = (provider) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    // Store flag so AuthCallback knows to redirect to signup, not dashboard
    localStorage.setItem("hireon_signup_mode", "true");
    window.location.href = `${backendURL}/auth/${provider}/candidate?signup=true`;
  };

  /* ── Username validation ── */
  const validateUsername = (val) => {
    if (val.length < 3 || val.length > 20) return "Must be 3–20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Only letters, numbers and _ allowed";
    if (/\s/.test(val)) return "No spaces allowed";
    return "";
  };

  const handleUsernameNext = async () => {
    const err = validateUsername(username);
    if (err) { setUsernameErr(err); return; }
    // Check uniqueness in Firestore
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "usernames", username.toLowerCase()));
      if (snap.exists()) { setUsernameErr("Username already taken"); setLoading(false); return; }
      setUsernameErr("");
      setStep(3);
    } catch { setUsernameErr("Error checking username. Try again."); }
    setLoading(false);
  };

  /* ── Final submit ── */
  const handleSubmit = async () => {
    if (!fullName.trim()) { alert("Please enter your full name"); return; }
    if (!college) { alert("Please select your college"); return; }
    if (!gradYear) { alert("Please select your graduation year"); return; }
    if (!phone.trim() || phone.length < 10) { alert("Please enter a valid phone number"); return; }

    setLoading(true);
    try {
      const uid = tempUser?.id || tempUser?.sub || tempUser?.uid;
      if (!uid) throw new Error("No user ID found. Please sign in again.");

      // Save user profile to Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        username:     username.toLowerCase(),
        name:         fullName.trim(),
        email:        tempUser.email || "",
        photo:        tempUser.photo || "",
        college,
        graduationYear: gradYear,
        phone:        phone.trim(),
        role:         "candidate",
        provider:     tempUser.provider || "social",
        createdAt:    new Date().toISOString(),
      });

      // Reserve username
      await setDoc(doc(db, "usernames", username.toLowerCase()), { uid });

      // Store final JWT and user
      localStorage.setItem("hireon_token", tempUser.token);
      localStorage.setItem("hireon_user", JSON.stringify({
        id: uid, name: fullName.trim(),
        email: tempUser.email, photo: tempUser.photo,
        role: "candidate", username: username.toLowerCase(),
      }));
      localStorage.removeItem("hireon_signup_token");
      localStorage.removeItem("hireon_signup_mode");

      navigate("/Candidate/06_MainCand", { replace: true });
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  /* ── College dropdown filter ── */
  const filteredColleges = INDIAN_UNIVERSITIES.filter(c =>
    c.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const progressLabels = ["Connect Account", "Set Username", "Your Profile"];

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Back */}
      <button className={styles.back} onClick={() => navigate("/")}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <div className={styles.cardOuter}>

        {/* ── TUF-style progress bar ── */}
        <div className={styles.progressWrap}>
          <div className={styles.progressSegs}>
            {[1,2,3].map(s => (
              <div
                key={s}
                className={`${styles.seg} ${step >= s ? styles.segActive : ""} ${step > s ? styles.segDone : ""}`}
              />
            ))}
          </div>
          <div className={styles.progressLabels}>
            {progressLabels.map((label, i) => (
              <span key={i} className={`${styles.progressLabel} ${step === i+1 ? styles.progressLabelActive : ""}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardShine} />

          {/* ══ STEP 1: Choose Social Provider ══ */}
          {step === 1 && (
            <div className={styles.stepWrap}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitle}>Create your account</div>
                <div className={styles.cardSub}>Start your journey to your dream role</div>
              </div>

              <div className={styles.socialStack}>
                <button className={styles.socialBtn} onClick={() => handleSocial("google")}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.19 29.5 1 24 1 14.84 1 7.1 6.33 3.44 14.07l7.11 5.52C12.37 13.28 17.72 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.56 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.64c-.55 2.96-2.2 5.46-4.68 7.14l7.18 5.57C43.26 37.55 46.56 31.5 46.56 24.5z"/>
                    <path fill="#FBBC05" d="M10.55 28.41A14.44 14.44 0 019.5 24c0-1.53.26-3.01.72-4.41l-7.11-5.52A23.94 23.94 0 001 24c0 3.87.93 7.52 2.56 10.75l7-5.34z"/>
                    <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.93l-7.18-5.57c-1.82 1.22-4.15 1.94-6.31 1.94-6.28 0-11.63-3.78-13.45-9.09l-7 5.34C7.1 41.67 14.84 47 24 47z"/>
                  </svg>
                  Continue with Google
                </button>

                <button className={styles.socialBtn} onClick={() => handleSocial("github")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.82c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Continue with GitHub
                </button>

                <button className={styles.socialBtn} onClick={() => handleSocial("linkedin")}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="#0077b5"/>
                    <path fill="#fff" d="M7 9.5H4.5v9H7v-9zm-1.25-1.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm13.75 10.75h-2.5v-4.5c0-1.1-.4-1.85-1.4-1.85-.77 0-1.22.52-1.42 1.02-.07.18-.09.43-.09.68v4.65H11.5s.03-7.55 0-8.33H14v1.18c.33-.51.92-1.24 2.24-1.24 1.63 0 2.76 1.07 2.76 3.36v5.03z"/>
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              <p className={styles.signupTxt}>
                Already have an account?{" "}
                <span className={styles.signupLink} onClick={() => navigate("/Candidate/02_LoginCand")}>
                  Log in →
                </span>
              </p>
            </div>
          )}

          {/* ══ STEP 2: Set Username ══ */}
          {step === 2 && (
            <div className={styles.stepWrap}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitle}>Set your username</div>
                <div className={styles.cardSub}>{tempUser?.email || "Choose a unique handle"}</div>
              </div>

              <div className={styles.field}>
                <div className={`${styles.inputBox} ${usernameErr ? styles.inputBoxErr : ""}`}>
                  <span className={styles.atSign}>@</span>
                  <input
                    className={styles.inp}
                    placeholder="enter your username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setUsernameErr(""); }}
                    onKeyDown={e => e.key === "Enter" && handleUsernameNext()}
                    autoFocus
                  />
                </div>
                <div className={styles.usernameRules}>
                  <span className={username.length >= 3 && username.length <= 20 ? styles.ruleOk : styles.ruleNeutral}>
                    ✓ 3–20 characters length
                  </span>
                  <span className={/^[a-zA-Z0-9_]*$/.test(username) && username ? styles.ruleOk : styles.ruleNeutral}>
                    ✓ Only letters, numbers, and underscores (_) are allowed
                  </span>
                  <span className={username && !/\s/.test(username) ? styles.ruleOk : styles.ruleErr}>
                    ✓ No spaces allowed (leading, trailing, or between)
                  </span>
                </div>
                {usernameErr && <p className={styles.errMsg}>{usernameErr}</p>}
              </div>

              <button className={styles.submitBtn} onClick={handleUsernameNext} disabled={loading}>
                {loading ? <><span className={styles.spinner}/> Checking…</> : <>Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
              </button>
            </div>
          )}

          {/* ══ STEP 3: Profile Details ══ */}
          {step === 3 && (
            <div className={styles.stepWrap}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitle}>Your profile</div>
                <div className={styles.cardSub}>Almost there — tell us about yourself</div>
              </div>

              <div className={styles.fields}>

                {/* Full Name */}
                <div className={styles.field}>
                  <label className={styles.lbl}>Full Name</label>
                  <div className={styles.inputBox}>
                    <input className={styles.inp} placeholder="Enter your full name"
                      value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>

                {/* College — searchable dropdown */}
                <div className={styles.field}>
                  <label className={styles.lbl}>College / University</label>
                  <div className={styles.dropdownWrap}>
                    <div className={`${styles.inputBox} ${styles.dropdownTrigger}`}
                      onClick={() => setCollegeOpen(o => !o)}>
                      <input className={styles.inp}
                        placeholder="Search your college…"
                        value={collegeOpen ? collegeSearch : college}
                        onChange={e => { setCollegeSearch(e.target.value); setCollegeOpen(true); }}
                        onFocus={() => { setCollegeOpen(true); setCollegeSearch(""); }}
                      />
                      <svg className={`${styles.chevron} ${collegeOpen ? styles.chevronUp : ""}`}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                    {collegeOpen && (
                      <div className={styles.dropdownList}>
                        {filteredColleges.length === 0
                          ? <div className={styles.dropdownEmpty}>No results found</div>
                          : filteredColleges.map(c => (
                            <div key={c} className={`${styles.dropdownItem} ${college === c ? styles.dropdownItemActive : ""}`}
                              onMouseDown={() => { setCollege(c); setCollegeSearch(""); setCollegeOpen(false); }}>
                              {c}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Graduation Year */}
                <div className={styles.field}>
                  <label className={styles.lbl}>Graduation Year</label>
                  <div className={styles.dropdownWrap}>
                    <div className={`${styles.inputBox} ${styles.dropdownTrigger}`}
                      onClick={() => setGradOpen(o => !o)}>
                      <span className={`${styles.inp} ${!gradYear ? styles.placeholder : ""}`}>
                        {gradYear || "Choose your graduation year"}
                      </span>
                      <svg className={`${styles.chevron} ${gradOpen ? styles.chevronUp : ""}`}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                    {gradOpen && (
                      <div className={styles.dropdownList}>
                        {GRAD_YEARS.map(y => (
                          <div key={y} className={`${styles.dropdownItem} ${gradYear === String(y) ? styles.dropdownItemActive : ""}`}
                            onMouseDown={() => { setGradYear(String(y)); setGradOpen(false); }}>
                            {y}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.field}>
                  <label className={styles.lbl}>Phone Number</label>
                  <div className={styles.inputBox}>
                    <span className={styles.phoneFlag}>🇮🇳 +91</span>
                    <input className={styles.inp} placeholder="Enter your phone number"
                      type="tel" maxLength={10}
                      value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>

              </div>

              <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><span className={styles.spinner}/> Creating account…</>
                  : <>Complete Signup <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SignupCandidate;