import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import {
  authenticate,
  getAuthenticatedUser,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getAuthenticatedUser);

export default router;
