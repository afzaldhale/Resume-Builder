import { db } from "../database.js";

export const getDashboardData = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    /* -------------------------------
       TOTAL RESUMES
    -------------------------------- */
    const [[resumeCount]] = await db.query(
      `SELECT COUNT(*) AS total FROM resumes WHERE user_id = ?`,
      [userId]
    );

    /* -------------------------------
       DOWNLOAD REQUEST STATS
       (CORRECT TABLE)
    -------------------------------- */
    const [[requestStats]] = await db.query(
      `
      SELECT
        COALESCE(SUM(status = 'pending'), 0)  AS pending,
        COALESCE(SUM(status = 'approved'), 0) AS approved,
        COALESCE(SUM(status = 'rejected'), 0) AS rejected
      FROM download_requests
      WHERE user_id = ?
      `,
      [userId]
    );

    /* -------------------------------
       RECENT ACTIVITY (OPTIONAL)
    -------------------------------- */
    let activity = [];

    try {
      const [rows] = await db.query(
        `
        SELECT action, created_at
        FROM activity_logs
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      );

      activity = rows;
    } catch {
      // activity_logs table is optional
      activity = [];
    }

    /* -------------------------------
       FINAL RESPONSE
    -------------------------------- */
    res.json({
      success: true,
      data: {
        totalResumes: resumeCount.total,
        pending: requestStats.pending,
        approved: requestStats.approved,
        rejected: requestStats.rejected,
      },
      activity,
    });
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};
