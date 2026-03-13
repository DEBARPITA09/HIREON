import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const SignupCandidate = () => {
  const navigate = useNavigate();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth account
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save display name to Firebase Auth profile
      await updateProfile(result.user, { displayName: name });

      // 3. Save user data to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        name,
        email,
        role: "candidate",
        createdAt: serverTimestamp(),
        profileComplete: false,
      });

      // 4. Create empty candidate profile doc
      await setDoc(doc(db, "candidates", result.user.uid), {
        name,
        email,
        phone: "",
        location: "",
        title: "",
        bio: "",
        skills: [],
        resumeURL: "",
        atsScore: 0,
        github: "",
        linkedin: "",
        portfolio: "",
        createdAt: serverTimestamp(),
      });

      // 5. Go to dashboard
      navigate("/Candidate/06_MainCand");

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoSq}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.sub}>Start your journey to your dream role.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Manoranjan Mahapatra"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/Candidate/02_LoginCand" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans, sans-serif", padding:"2rem" },
  card: { width:"100%", maxWidth:"420px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"2.5rem 2rem" },
  logo: { display:"flex", alignItems:"center", gap:"0.5rem", fontFamily:"Playfair Display, serif", fontWeight:900, fontSize:"1.1rem", color:"#fff", marginBottom:"1.8rem", letterSpacing:"0.05em" },
  logoSq: { width:"28px", height:"28px", borderRadius:"6px", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" },
  heading: { fontFamily:"Playfair Display, serif", fontSize:"1.6rem", fontWeight:900, color:"#fff", margin:"0 0 0.3rem" },
  sub: { fontSize:"0.83rem", color:"rgba(255,255,255,0.4)", margin:"0 0 1.8rem" },
  errorBox: { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"8px", padding:"10px 14px", color:"rgb(239,68,68)", fontSize:"0.8rem", marginBottom:"1.2rem" },
  form: { display:"flex", flexDirection:"column", gap:"1rem" },
  group: { display:"flex", flexDirection:"column", gap:"6px" },
  label: { fontSize:"0.65rem", fontWeight:600, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.1em" },
  input: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"11px 14px", color:"#fff", fontSize:"0.85rem", outline:"none", fontFamily:"DM Sans, sans-serif" },
  btn: { marginTop:"0.5rem", padding:"12px", background:"#fff", border:"none", borderRadius:"8px", color:"#080808", fontWeight:700, fontSize:"0.9rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif" },
  btnDisabled: { marginTop:"0.5rem", padding:"12px", background:"rgba(255,255,255,0.3)", border:"none", borderRadius:"8px", color:"#080808", fontWeight:700, fontSize:"0.9rem", cursor:"not-allowed", fontFamily:"DM Sans, sans-serif" },
  footer: { marginTop:"1.4rem", textAlign:"center", fontSize:"0.8rem", color:"rgba(255,255,255,0.4)" },
  link: { color:"#fff", textDecoration:"underline" },
};