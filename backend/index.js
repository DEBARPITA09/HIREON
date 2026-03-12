import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/lib/connectDb.js";
import authRouter from "./src/routes/authRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS — allows your frontend to talk to your backend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "🚀 Hireon backend is running!" });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong on the server", error: err.message });
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Hireon server running on http://localhost:${PORT}`);
  });
});