import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { updatePreferences, getPreferences } from "../controllers/user.controller.js";

const router = express.Router();

// ✅ Update preferences (after login)
router.patch("/preferences", protect, updatePreferences);

// ✅ Get preferences
router.get("/preferences", protect, getPreferences);

import { submitKYC } from "../controllers/kyc.controller.js";
// Submit KYC
router.post("/", protect, submitKYC);

export default router;
