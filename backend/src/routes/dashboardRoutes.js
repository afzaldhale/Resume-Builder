import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import {
  authenticate,
  authorizeSelfOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, getDashboardData);
router.get("/:userId", authenticate, authorizeSelfOrAdmin, getDashboardData);

export default router;
