import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/auth.controllers.js";
import protect from "../middlewares/auth.middleware.js";

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
