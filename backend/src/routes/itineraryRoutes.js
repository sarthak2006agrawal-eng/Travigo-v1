import express from "express";
import {
  createItinerary,
  getUserItineraries,
  generatePlan,
  updateItinerary,
  deleteItinerary
} from "../controllers/itineraryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All endpoints require auth in this MVP (only logged-in users manage itineraries)
router.post("/", protect, createItinerary);
router.get("/", protect, getUserItineraries);
router.get("/:id", protect, generatePlan);
router.put("/:id", protect, updateItinerary);
router.delete("/:id", protect, deleteItinerary);


// ✅ Cerebras AI itinerary generation endpoint
// Frontend should POST: { destination, trip_name, start_date, end_date, budget, travel_style }
// Response: JSON fully matching the Itinerary schema
router.post("/generate", protect, generateItinerary);
export default router;
