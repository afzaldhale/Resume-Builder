import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { db } from "./database.js";

dotenv.config();

const app = express();
const authAttemptStore = new Map();

const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...valueParts] = part.split("=");
      if (!key) return acc;
      acc[key] = decodeURIComponent(valueParts.join("="));
      return acc;
    }, {});

const authRateLimiter = (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 20;
  const current = authAttemptStore.get(key);

  if (!current || now - current.start > windowMs) {
    authAttemptStore.set(key, { count: 1, start: now });
    return next();
  }

  if (current.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: "Too many authentication attempts. Please try again later.",
    });
  }

  authAttemptStore.set(key, {
    count: current.count + 1,
    start: current.start,
  });

  return next();
};

/* ======================================================
   CORS CONFIGURATION (FIXED)
====================================================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // ✅ Vite default
      "http://localhost:8080", // Frontend port
      "http://localhost:8081", // Alternative frontend port
      "http://localhost:3000", // Common dev port
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Resume-Render-Token",
    ],
  })
);

/* ======================================================
   GLOBAL MIDDLEWARES
====================================================== */
app.use((req, _res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
});
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRateLimiter);

/* ======================================================
   ROUTES
====================================================== */

/**
 * Auth Routes
 * POST /auth/login
 * POST /auth/register
 */
app.use("/auth", authRoutes);

/**
 * Resume Routes
 * GET  /api/resumes/my-resumes/:userId
 * GET  /api/resumes/:id/pdf
 * POST /api/resumes
 */
app.use("/api/resumes", resumeRoutes);

/**
 * Admin Routes
 * GET /api/admin/users
 * GET /api/admin/requests
 * PUT /api/admin/requests/:id
 */
app.use("/api/admin", adminRoutes);

/**
 * Dashboard Route (🚀 SINGLE API CALL)
 * GET /api/dashboard/:userId
 */
app.use("/api/dashboard", dashboardRoutes);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */
app.use((err, _req, res, _next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ======================================================
   SERVER START
====================================================== */
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }

  console.log(`🚀 Server running on port ${PORT}`);
});
