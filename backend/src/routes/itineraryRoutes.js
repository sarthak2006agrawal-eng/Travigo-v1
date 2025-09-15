import express from "express";
import {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary
} from "../controllers/itinerary.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// All endpoints require auth in this MVP (only logged-in users manage itineraries)
router.post("/", protect, createItinerary);
router.get("/", protect, getUserItineraries);
router.get("/:id", protect, getItineraryById);
router.put("/:id", protect, updateItinerary);
router.delete("/:id", protect, deleteItinerary);

export default router;
