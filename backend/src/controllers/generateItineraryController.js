// backend/src/controllers/generateItineraryController.js
import { callCerebrasAI } from "../services/cerebrasService.js";
import { transformAnswers } from "../utils/transformAnswers.js";
import fs from "fs";
import path from "path";
import Itinerary from "../models/Itinerary.models.js";

/**
 * POST /api/itineraries/generate
 * Generate a travel itinerary using Cerebras AI
 * Fallback to local JSON if AI fails
 */
export const generateItinerary = async (req, res) => {
  try {
    const { destination, trip_name, start_date, end_date, budget, travel_style } = req.body;
    const userId = req.user._id;

    // Calculate total_days
    const total_days =
      start_date && end_date
        ? Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1
        : 1;

    let aiResponse;

    // 1️⃣ Call Cerebras AI chat-completions
    try {
      aiResponse = await callCerebrasAI({
        user: userId,
        destination,
        days: total_days,
        budget,
        travel_style,
      });
    } catch (err) {
      console.warn("Cerebras AI failed, using fallback:", err.message);

      // 2️⃣ Fallback: load local JSON
      const fallbackPath = path.join(process.cwd(), "src", "data", `${destination.toLowerCase()}.json`);
      const fallbackData = fs.existsSync(fallbackPath)
        ? JSON.parse(fs.readFileSync(fallbackPath, "utf-8"))
        : {
            trip_name: trip_name || "My Trip",
            daily_plan: [],
            total_days,
            budget,
            travel_style,
            status: "draft",
          };
      aiResponse = fallbackData;
    }

    // 3️⃣ Transform AI/fallback response to match Itinerary schema
    const itineraryData = transformAnswers(aiResponse, userId, req.body.destination_id || destination);

    // 4️⃣ Save to DB
    const newItinerary = await Itinerary.create(itineraryData);

    return res.status(201).json(newItinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return res.status(500).json({ message: "Failed to generate itinerary." });
  }
};
