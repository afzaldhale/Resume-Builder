import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  getAllUsers,
  getAllDownloadRequests,
  approveDownloadRequest,
  rejectDownloadRequest,
  previewResume,
} from "../controllers/adminController.js";

const router = express.Router();

/**
 * =========================
 * ADMIN HEALTH / DASHBOARD
 * =========================
 * GET /api/admin/dashboard
 */
router.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    adminId: req.user.id,
  });
});

/**
 * =========================
 * USERS
 * GET /api/admin/users
 * =========================
 */
router.get("/users", adminAuth, getAllUsers);

/**
 * =========================
 * DOWNLOAD REQUESTS
 * GET /api/admin/requests
 * =========================
 */
router.get("/requests", adminAuth, getAllDownloadRequests);

/**
 * =========================
 * APPROVE / REJECT
 * PUT /api/admin/requests/:id/approve
 * PUT /api/admin/requests/:id/reject
 * =========================
 */
router.put("/requests/:id/approve", adminAuth, approveDownloadRequest);
router.put("/requests/:id/reject", adminAuth, rejectDownloadRequest);

/**
 * =========================
 * PREVIEW RESUME
 * GET /api/admin/requests/:id/preview
 * =========================
 */
router.get("/requests/:id/preview", adminAuth, previewResume);

export default router;
