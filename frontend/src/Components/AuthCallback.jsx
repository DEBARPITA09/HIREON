// HIREON/frontend/src/Components/AuthCallback.jsx
// Handles redirect from backend after any OAuth (Google / GitHub / LinkedIn)
// Routes to dashboard (login) OR signup onboarding depending on mode

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const AuthCallback = () => {
  const navigate     = useNavigate();
  const [params]     = useSearchParams();
  const [status, setStatus] = useState("Completing sign-in…");

  useEffect(() => {
    const token    = params.get("token");
    const redirect = params.get("redirect");
    const error    = params.get("error");

    if (error) {
      setStatus("Authentication failed. Redirecting…");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (!token) {
      setStatus("No token received. Redirecting…");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Decode JWT payload
    let payload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch {
      setStatus("Invalid token. Redirecting…");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Store JWT
    localStorage.setItem("hireon_token", token);
    localStorage.setItem("hireon_user", JSON.stringify({
      id:    payload.id,
      name:  payload.name,
      email: payload.email,
      photo: payload.photo,
      role:  payload.role,
    }));

    const isSignupMode = localStorage.getItem("hireon_signup_mode") === "true";

    (async () => {
      try {
        if (isSignupMode) {
          // Signup flow — always go to onboarding
          setStatus("Account connected! Setting up profile…");
          // Store token for signup page to read
          localStorage.setItem("hireon_signup_token", token);
          localStorage.removeItem("hireon_signup_mode");
          navigate("/Candidate/03_SignupCand", { replace: true });
          return;
        }

        // Login flow — check if user has a Firestore profile
        setStatus("Checking your account…");
        const snap = await getDoc(doc(db, "users", payload.id));

        if (!snap.exists()) {
          // New user came through login page — redirect to signup
          setStatus("No account found. Redirecting to signup…");
          localStorage.setItem("hireon_signup_token", token);
          navigate("/Candidate/03_SignupCand", { replace: true });
          return;
        }

        setStatus("Success! Redirecting…");
        const userRole = snap.data().role || payload.role || "candidate";
        navigate(
          userRole === "recruiter" ? "/Recruiter/06_MainRec" : "/Candidate/06_MainCand",
          { replace: true }
        );
      } catch (err) {
        console.error("AuthCallback error:", err);
        // Fallback to redirect param
        navigate(redirect || "/Candidate/06_MainCand", { replace: true });
      }
    })();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#0a0a0a", color: "#e5e5e5",
      fontFamily: "system-ui, sans-serif", gap: "1rem",
    }}>
      <div style={{
        width: "36px", height: "36px",
        border: "2px solid rgba(255,255,255,0.1)",
        borderTop: "2px solid #e8703a",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;