import { db } from "../database.js";

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

    res.status(200).json({
      success: true,
      resume: {
        title: rows[0].title,
        templateId: rows[0].template_id,
        resumeData: JSON.parse(rows[0].resume_data),
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
