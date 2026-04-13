import { db } from "../database.js";
import { generateResumePDF } from "../services/pdfService.js";
import { validateResumePayload } from "../utils/resumeValidation.js";

/**
 * =====================================
 * CREATE RESUME
 * POST /api/resumes
 * =====================================
 */
export const createResume = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;
    const { resumeData, templateId, title } = req.body;

    const validationErrors = validateResumePayload({
      title,
      resumeData,
      templateId,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume payload",
        errors: validationErrors,
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO resumes (user_id, title, resume_data, template_id)
      VALUES (?, ?, ?, ?)
      `,
      [
        userId,
        title || "My Resume",
        JSON.stringify(resumeData),
        templateId,
      ]
    );

    res.status(201).json({
      success: true,
      resumeId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Create Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    const resumeId = req.params.id;
    const { resumeData, templateId, title } = req.body;

    const [existingResumes] = await db.query(
      `
      SELECT title, resume_data, template_id
      FROM resumes
      WHERE id = ? AND user_id = ?
      `,
      [resumeId, userId]
    );

    if (existingResumes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const existing = existingResumes[0];
    const updatedTitle = title ?? existing.title;
    const updatedTemplateId = templateId ?? existing.template_id;
    const updatedResumeData = resumeData ??
      (typeof existing.resume_data === "string"
        ? JSON.parse(existing.resume_data)
        : existing.resume_data);

    const validationErrors = validateResumePayload({
      title: updatedTitle,
      resumeData: updatedResumeData,
      templateId: updatedTemplateId,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume payload",
        errors: validationErrors,
      });
    }

    const [result] = await db.query(
      `
      UPDATE resumes
      SET title = ?, resume_data = ?, template_id = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        updatedTitle,
        JSON.stringify(updatedResumeData),
        updatedTemplateId,
        resumeId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resumeId: Number(resumeId),
      message: "Resume updated successfully",
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [rows] = await db.query(
      `
      SELECT
        r.id,
        r.title,
        r.template_id,
        r.created_at,
        COALESCE(dr.status, 'draft') AS status
      FROM resumes r
      LEFT JOIN download_requests dr ON dr.resume_id = r.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      resumes: rows,
    });
  } catch (error) {
    console.error("Get My Resumes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load resumes",
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const resumeId = req.params.id;

    const [rows] = await db.query(
      `
      SELECT id, title, template_id, resume_data, created_at
      FROM resumes
      WHERE id = ? AND user_id = ?
      `,
      [resumeId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resume = rows[0];

    return res.status(200).json({
      success: true,
      resume: {
        ...resume,
        resume_data:
          typeof resume.resume_data === "string"
            ? JSON.parse(resume.resume_data)
            : resume.resume_data,
      },
    });
  } catch (error) {
    console.error("Get Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load resume",
    });
  }
};

export const duplicateResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    const resumeId = req.params.id;

    const [rows] = await db.query(
      `
      SELECT title, resume_data, template_id
      FROM resumes
      WHERE id = ? AND user_id = ?
      `,
      [resumeId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const source = rows[0];

    const [result] = await db.query(
      `
      INSERT INTO resumes (user_id, title, resume_data, template_id)
      VALUES (?, ?, ?, ?)
      `,
      [userId, `${source.title} Copy`, source.resume_data, source.template_id]
    );

    return res.status(201).json({
      success: true,
      resumeId: result.insertId,
      message: "Resume duplicated successfully",
    });
  } catch (error) {
    console.error("Duplicate Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to duplicate resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    const resumeId = req.params.id;

    const [result] = await db.query(
      `DELETE FROM resumes WHERE id = ? AND user_id = ?`,
      [resumeId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

/**
 * =====================================
 * CREATE DOWNLOAD REQUEST
 * POST /api/resumes/:id/request
 * =====================================
 */
export const createDownloadRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const resumeId = req.params.id;

    const [resumes] = await db.query(
      `SELECT id FROM resumes WHERE id = ? AND user_id = ?`,
      [resumeId, userId]
    );

    if (resumes.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const [existing] = await db.query(
      `
      SELECT id FROM download_requests
      WHERE user_id = ? AND resume_id = ?
      `,
      [userId, resumeId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Download request already exists",
      });
    }

    await db.query(
      `
      INSERT INTO download_requests (user_id, resume_id, status)
      VALUES (?, ?, 'pending')
      `,
      [userId, resumeId]
    );

    res.status(201).json({
      success: true,
      message: "Download request submitted successfully",
    });
  } catch (error) {
    console.error("❌ Create Download Request Error:", error);
    res.status(500).json({ message: "Failed to create request" });
  }
};

/**
 * =====================================
 * GET MY DOWNLOAD REQUESTS
 * GET /api/resumes/my-requests
 * =====================================
 */
export const getMyDownloadRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        dr.id,
        dr.status,
        dr.created_at,
        r.id AS resume_id,
        r.title AS resume_title
      FROM download_requests dr
      JOIN resumes r ON r.id = dr.resume_id
      WHERE dr.user_id = ?
      ORDER BY dr.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      requests: rows,
    });
  } catch (error) {
    console.error("❌ Get My Requests Error:", error);
    res.status(500).json({
      success: false,
      requests: [],
      message: "Failed to fetch download requests",
    });
  }
};

/**
 * =====================================
 * DOWNLOAD APPROVED RESUME PDF
 * GET /api/resumes/:id/pdf
 * =====================================
 */
export const downloadResumePDF = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumeId = req.params.id;
    const userId = req.user.id;

    // ✅ CHECK REQUEST STATUS
    const [requests] = await db.query(
      `
      SELECT status
      FROM download_requests
      WHERE resume_id = ? AND user_id = ?
      `,
      [resumeId, userId]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: "No download request found" });
    }

    if (requests[0].status !== "approved") {
      return res.status(403).json({ message: "Resume not approved yet" });
    }

    // ✅ FETCH RESUME
    const [resumes] = await db.query(
      `
      SELECT resume_data, template_id
      FROM resumes
      WHERE id = ? AND user_id = ?
      `,
      [resumeId, userId]
    );

    if (resumes.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 🔥 FIX: SAFE JSON HANDLING
    const resumeData =
      typeof resumes[0].resume_data === "string"
        ? JSON.parse(resumes[0].resume_data)
        : resumes[0].resume_data;

    const pdfBuffer = await generateResumePDF(
      resumeData,
      resumes[0].template_id
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${resumeId}.pdf`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Download Error:", error);
    res.status(500).json({ message: "PDF generation failed" });
  }
};
