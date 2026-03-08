import express from "express";
import { signup, login, logout, getMe } from "../controllers/userAuth.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/recruiter-only", authenticate, authorizeRoles("recruiter"), (req, res) => {
  res.json({
    message: "Welcome, Recruiter! 🎯 You have access to this protected route.",
    user: req.user,
  });
});
router.get("/student-only", authenticate, authorizeRoles("student"), (req, res) => {
  res.json({
    message: "Welcome, Student! 🎓 You have access to this protected route.",
    user: req.user,
  });
});
router.get("/dashboard", authenticate, authorizeRoles("student", "recruiter"), (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.role}!`,
    user: req.user,
  });
});

export default router;