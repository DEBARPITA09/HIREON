import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { auth, googleProvider, db } from "../config/firebase";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const githubProvider = new GithubAuthProvider();
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* ── Dot grid background ── */
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

export const LoginPage = ({ role = "candidate" }) => {
  const isCandidate = role === "candidate";
  const navigate    = useNavigate();
  const canvasRef   = useRef(null);
  const cardRef     = useRef(null);
  useBackground(canvasRef);

  const [step, setStep]           = useState(1); // 1=email, 2=otp
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(["","","","","",""]);
  const [loading, setLoading]     = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError]   = useState("");
  const otpRefs                   = useRef([]);

  const seg1 = true;
  const seg2 = step === 2;
  const seg3 = false;

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

  /* Countdown timer */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── Send OTP ── */
  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep(2);
      setOtp(["","","","","",""]);
      setOtpError("");
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  /* ── Verify OTP ── */
  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) { setOtpError("Please enter the 6-digit OTP"); return; }
    setLoading(true);
    setOtpError("");
    try {
      const res = await fetch(`${BACKEND}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // OTP verified — check Firestore for existing user
      // Since this is email login (not Firebase Auth), just navigate
      // In production you'd mint a session token here
      navigate(isCandidate ? "/Candidate/06_MainCand" : "/Recruiter/06_MainRec");
    } catch (err) {
      setOtpError(err.message);
    }
    setLoading(false);
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
    // Auto verify when all 6 digits entered
    if (val && index === 5) {
      const full = [...newOtp.slice(0, 5), val.slice(-1)].join("");
      if (full.length === 6) setTimeout(() => handleVerifyOTPDirect(full), 100);
    }
  };

  const handleVerifyOTPDirect = async (otpValue) => {
    setLoading(true);
    setOtpError("");
    try {
      const res = await fetch(`${BACKEND}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      navigate(isCandidate ? "/Candidate/06_MainCand" : "/Recruiter/06_MainRec");
    } catch (err) {
      setOtpError(err.message);
    }
    setLoading(false);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerifyOTP();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  /* ── LinkedIn ── */
  const handleLinkedIn = () => {
    window.location.href = `${BACKEND}/auth/linkedin/${role}`;
  };

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

      {/* Role toggle */}
      <div className={styles.roleToggle}>
        <button className={`${styles.roleBtn} ${isCandidate ? styles.roleActive : ""}`} onClick={() => navigate("/Candidate/02_LoginCand")}>Candidate</button>
        <button className={`${styles.roleBtn} ${!isCandidate ? styles.roleActive : ""}`} onClick={() => navigate("/Recruiter/02_LoginRec")}>Recruiter</button>
      </div>

      {/* Card */}
      <div className={styles.cardOuter} ref={cardRef}>

        {/* Progress */}
        <div className={styles.progressBlock}>
          <div className={styles.progressSegs}>
            <div className={`${styles.seg} ${seg1 ? styles.segActive : ""}`} />
            <div className={`${styles.seg} ${seg2 ? styles.segActive : ""}`} />
            <div className={`${styles.seg} ${seg3 ? styles.segActive : ""}`} />
          </div>
          <span className={styles.progressTxt}>
            {loading ? "Please wait…"
              : step === 1 ? "Step 1 / 2 — Enter your email"
              : "Step 2 / 2 — Enter OTP"}
          </span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardShine} />

          {/* Header */}
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>{isCandidate ? "Candidate Login" : "Recruiter Login"}</div>
            <div className={styles.cardSub}>{isCandidate ? "Find your next opportunity" : "Hire top talent faster"}</div>
          </div>

          {/* ══ STEP 1: Social + Email ══ */}
          {step === 1 && (
            <>
              <div className={styles.socials}>
                {/* Google */}
                <button className={styles.socialBtn} onClick={async () => {
                  try {
                    const result = await signInWithPopup(auth, googleProvider);
                    const snap = await getDoc(doc(db, "users", result.user.uid));
                    if (!snap.exists()) { navigate(isCandidate ? "/Candidate/03_SignupCand" : "/Recruiter/03_SignupRec"); return; }
                    navigate(isCandidate ? "/Candidate/06_MainCand" : "/Recruiter/06_MainRec");
                  } catch(e) { alert(e.message); }
                }}>
                  <svg width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.19 29.5 1 24 1 14.84 1 7.1 6.33 3.44 14.07l7.11 5.52C12.37 13.28 17.72 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.56 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.64c-.55 2.96-2.2 5.46-4.68 7.14l7.18 5.57C43.26 37.55 46.56 31.5 46.56 24.5z"/>
                    <path fill="#FBBC05" d="M10.55 28.41A14.44 14.44 0 019.5 24c0-1.53.26-3.01.72-4.41l-7.11-5.52A23.94 23.94 0 001 24c0 3.87.93 7.52 2.56 10.75l7-5.34z"/>
                    <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.93l-7.18-5.57c-1.82 1.22-4.15 1.94-6.31 1.94-6.28 0-11.63-3.78-13.45-9.09l-7 5.34C7.1 41.67 14.84 47 24 47z"/>
                  </svg>
                  Google
                </button>

                {/* GitHub */}
                <button className={styles.socialBtn} onClick={async () => {
                  try {
                    const result = await signInWithPopup(auth, githubProvider);
                    const snap = await getDoc(doc(db, "users", result.user.uid));
                    if (!snap.exists()) { navigate(isCandidate ? "/Candidate/03_SignupCand" : "/Recruiter/03_SignupRec"); return; }
                    navigate(isCandidate ? "/Candidate/06_MainCand" : "/Recruiter/06_MainRec");
                  } catch(e) {
                    if (e.code === "auth/account-exists-with-different-credential") {
                      const { linkWithPopup } = await import("firebase/auth");
                      try {
                        const r = await signInWithPopup(auth, googleProvider);
                        await linkWithPopup(r.user, githubProvider);
                        navigate(isCandidate ? "/Candidate/06_MainCand" : "/Recruiter/06_MainRec");
                      } catch(le) { alert(le.message); }
                    } else { alert(e.message); }
                  }
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.82c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>

                {/* LinkedIn */}
                <button className={styles.socialBtn} onClick={handleLinkedIn}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="#0077b5"/>
                    <path fill="#fff" d="M7 9.5H4.5v9H7v-9zm-1.25-1.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm13.75 10.75h-2.5v-4.5c0-1.1-.4-1.85-1.4-1.85-.77 0-1.22.52-1.42 1.02-.07.18-.09.43-.09.68v4.65H11.5s.03-7.55 0-8.33H14v1.18c.33-.51.92-1.24 2.24-1.24 1.63 0 2.76 1.07 2.76 3.36v5.03z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>

              <div className={styles.or}>
                <span className={styles.orLine} />
                <span className={styles.orTxt}>or continue with email</span>
                <span className={styles.orLine} />
              </div>

              <form onSubmit={handleSendOTP} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.lbl}>Email Address</label>
                  <div className={`${styles.inputBox} ${focusedEmail ? styles.inputBoxFocus : ""}`}>
                    <svg className={styles.ico} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input type="email" required placeholder="you@example.com" className={styles.inp}
                      value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedEmail(true)} onBlur={() => setFocusedEmail(false)} autoFocus />
                  </div>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <><span className={styles.spinner}/> Sending OTP…</> : <>Send OTP <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
                </button>
              </form>

              <p className={styles.signupTxt}>
                No account?{" "}
                <span className={styles.signupLink} onClick={() => navigate(isCandidate ? "/Candidate/03_SignupCand" : "/Recruiter/03_SignupRec")}>
                  Create one →
                </span>
              </p>
            </>
          )}

          {/* ══ STEP 2: OTP Entry ══ */}
          {step === 2 && (
            <div className={styles.otpWrap}>
              <p className={styles.otpDesc}>
                We sent a 6-digit OTP to<br/>
                <strong style={{ color: "#f0f0f0" }}>{email}</strong>
              </p>

              {/* 6-digit OTP boxes */}
              <div className={styles.otpBoxes} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className={`${styles.otpBox} ${otpError ? styles.otpBoxErr : ""} ${digit ? styles.otpBoxFilled : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>

              {otpError && <p className={styles.otpErrMsg}>{otpError}</p>}

              <button className={styles.submitBtn} onClick={handleVerifyOTP} disabled={loading}>
                {loading ? <><span className={styles.spinner}/> Verifying…</> : <>Verify & Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
              </button>

              <div className={styles.otpFooter}>
                <button className={styles.resendBtn} disabled={countdown > 0} onClick={handleSendOTP}>
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
                <button className={styles.backBtn} onClick={() => { setStep(1); setOtp(["","","","","",""]); setOtpError(""); }}>
                  ← Change email
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;