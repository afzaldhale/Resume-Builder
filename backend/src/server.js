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
const envAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localhostOriginPattern =
  /^https?:\/\/(localhost|127(?:\.\d{1,3}){3})(:\d+)?$/i;
const lanOriginPattern =
  /^https?:\/\/((192\.168(?:\.\d{1,3}){2})|(10(?:\.\d{1,3}){3})|(172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}))(:\d+)?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return (
    envAllowedOrigins.includes(origin) ||
    localhostOriginPattern.test(origin) ||
    lanOriginPattern.test(origin)
  );
};

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

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.use("/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((err, _req, res, _next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
  }

  console.log(`Server running on port ${PORT}`);
});
