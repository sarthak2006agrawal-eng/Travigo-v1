import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

// Protected routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
