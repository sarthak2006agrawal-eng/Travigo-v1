// backend/src/services/transformAnswers.js
/**
 * Transform the raw AI response from Cerebras into a valid Itinerary object
 * matching the backend schema.
 */

import mongoose from "mongoose";

/**
 * Fills in missing ObjectIds for POIs and accommodations if placeholders exist.
 * @param {Object} raw - Raw JSON from AI
 * @param {string} userId - MongoDB user _id
 * @param {string} destinationId - MongoDB destination _id
 * @returns {Object} - Valid Itinerary document ready to insert into MongoDB
 */
export const transformAnswers = (raw, userId, destinationId) => {
  try {
    // Base itinerary object
    const itinerary = {
      user: mongoose.Types.ObjectId(userId),
      destination: mongoose.Types.ObjectId(destinationId),
      trip_name: raw.trip_name || "My Trip",
      start_date: raw.start_date ? new Date(raw.start_date) : new Date(),
      end_date: raw.end_date
        ? new Date(raw.end_date)
        : new Date(new Date().setDate(new Date().getDate() + (raw.total_days || 1))),
      total_days: raw.total_days || 1,
      budget: raw.budget || 0,
      travel_style: raw.travel_style || "balanced",
      daily_plan: [],
      cost_breakdown: {
        transport: 0,
        accommodation: 0,
        activities: 0,
        total: 0,
        currency: raw.cost_breakdown?.currency || "INR",
      },
      status: raw.status || "draft",
    };

    // Transform daily_plan with activity placeholders
    if (Array.isArray(raw.daily_plan)) {
      itinerary.daily_plan = raw.daily_plan.map((day) => ({
        date: day.date ? new Date(day.date) : new Date(),
        activities: Array.isArray(day.activities)
          ? day.activities.map((act) => ({
              poi_id: act.poi_id
                ? mongoose.Types.ObjectId(act.poi_id)
                : mongoose.Types.ObjectId(), // placeholder ObjectId
              accommodation_id: act.accommodation_id
                ? mongoose.Types.ObjectId(act.accommodation_id)
                : mongoose.Types.ObjectId(), // placeholder ObjectId
              transport_mode: act.transport_mode || "car_rental",
              notes: act.notes || "",
              estimated_cost: act.estimated_cost || 0,
            }))
          : [],
      }));
    }

    // Auto-calculate cost breakdown
    let transport = 0,
      accommodation = 0,
      activities = 0;

    itinerary.daily_plan.forEach((day) =>
      day.activities.forEach((act) => {
        // Currently all transport/accommodation costs are zero; estimated_cost counts toward activities
        activities += act.estimated_cost || 0;
      })
    );

    itinerary.cost_breakdown = {
      transport,
      accommodation,
      activities,
      total: transport + accommodation + activities,
      currency: itinerary.cost_breakdown.currency,
    };

    return itinerary;
  } catch (err) {
    console.error("Error transforming AI answer:", err);
    throw new Error("Failed to transform AI response.");
  }
};
