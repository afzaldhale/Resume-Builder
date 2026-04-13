import { db } from "../database.js";
import { generateResumePDF } from "../services/pdfService.js";
import bcrypt from "bcrypt";

/**
 * =====================================
 * GET ALL USERS (ADMIN)
 * GET /api/admin/users
 * =====================================
 */
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, email, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/**
 * =====================================
 * GET ALL DOWNLOAD REQUESTS (ADMIN)
 * GET /api/admin/requests
 * =====================================
 */
export const getAllDownloadRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        dr.id,
        dr.status,
        dr.created_at,
        r.id AS resume_id,
        r.title AS resume_title,
        u.name AS user_name
      FROM download_requests dr
      JOIN resumes r ON dr.resume_id = r.id
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
    `);

    res.status(200).json({
      success: true,
      requests: rows,
    });
  } catch (error) {
    console.error("❌ Get requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch download requests",
    });
  }
};

/**
 * =====================================
 * APPROVE REQUEST
 * PUT /api/admin/requests/:id/approve
 * =====================================
 */
export const approveDownloadRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE download_requests
      SET status = 'approved', updated_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume approved successfully",
    });
  } catch (error) {
    console.error("❌ Approve request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve request",
    });
  }
};

/**
 * =====================================
 * REJECT REQUEST
 * PUT /api/admin/requests/:id/reject
 * =====================================
 */
export const rejectDownloadRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE download_requests
      SET status = 'rejected', updated_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume rejected successfully",
    });
  } catch (error) {
    console.error("❌ Reject request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject request",
    });
  }
};

/**
 * =====================================
 * PREVIEW RESUME (ADMIN)
 * GET /api/admin/requests/:id/preview
 * =====================================
 */
export const previewResume = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT r.resume_data, r.template_id, r.title
      FROM download_requests dr
      JOIN resumes r ON dr.resume_id = r.id
      WHERE dr.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const rawData = rows[0].resume_data;
    const resumeData =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    res.status(200).json({
      success: true,
      resume: {
        title: rows[0].title,
        templateId: rows[0].template_id,
        resumeData,
      },
    });
  } catch (error) {
    console.error("❌ Preview resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load resume preview",
    });
  }
};

/**
 * =====================================
 * DOWNLOAD REQUEST PDF (ADMIN)
 * GET /api/admin/requests/:id/pdf
 * =====================================
 */
export const downloadRequestPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT r.resume_data, r.template_id, r.title
      FROM download_requests dr
      JOIN resumes r ON dr.resume_id = r.id
      WHERE dr.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const rawData = rows[0].resume_data;
    const resumeData =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    const pdfBuffer = await generateResumePDF(resumeData, rows[0].template_id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=resume-request-${id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Admin request PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
};

/**
 * =====================================
 * CREATE USER (ADMIN)
 * POST /api/admin/users
 * =====================================
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // ✅ Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // ✅ Fetch newly created user (without password)
    const [users] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    const newUser = users[0];

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

/**
 * =====================================
 * DELETE USER (ADMIN)
 * DELETE /api/admin/users/:id
 * =====================================
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingUser] = await db.query(
      "SELECT role FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (existingUser[0].role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
