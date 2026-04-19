import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createResume,
  getMyDownloadRequests,
  downloadResumePDF,
  createDownloadRequest,
  getMyResumes,
  getResumeById,
  getResumeRenderData,
  duplicateResume,
  deleteResume,
  updateResume,
} from "../controllers/resumeController.js";

const router = express.Router();

/**
 * =====================================
 * CREATE RESUME + REQUEST APPROVAL
 * POST /api/resumes
 * =====================================
 */
router.post("/", authenticate, createResume);
router.get("/mine", authenticate, getMyResumes);

/**
 * =====================================
 * CREATE DOWNLOAD REQUEST (OPTIONAL)
 * POST /api/resumes/:id/request
 * =====================================
 */
router.post("/:id/request", authenticate, createDownloadRequest);

/**
 * =====================================
 * GET MY REQUESTS
 * GET /api/resumes/my-requests
 * =====================================
 */
router.get("/my-requests", authenticate, getMyDownloadRequests);

router.put("/:id", authenticate, updateResume);
router.get("/:id/render-data", getResumeRenderData);
router.get("/:id", authenticate, getResumeById);
router.post("/:id/duplicate", authenticate, duplicateResume);
router.delete("/:id", authenticate, deleteResume);

/**
 * =====================================
 * DOWNLOAD APPROVED PDF
 * GET /api/resumes/:id/pdf
 * =====================================
 */
router.get("/:id/pdf", authenticate, downloadResumePDF);

export default router;
