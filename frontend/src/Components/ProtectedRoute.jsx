// src/Components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (requiredRole && role !== requiredRole) {
    if (role === "recruiter") return <Navigate to="/Recruiter/06_MainRec" replace />;
    if (role === "candidate") return <Navigate to="/Candidate/06_MainCand" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};