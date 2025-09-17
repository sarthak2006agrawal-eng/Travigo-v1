// backend/src/services/cerebrasService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Call Cerebras to generate itinerary JSON
 * @param {Object} payload
 * @param {string} payload.user - User ID
 * @param {string} payload.destination - Destination name
 * @param {number} payload.days - Number of days
 * @param {number} payload.budget - Budget
 * @param {string} payload.travel_style - "luxury", "balanced", or "budget"
 *
 * @returns {Promise<Object>} - JSON matching Itinerary schema
 */
export const callCerebrasAI = async ({
  user,
  destination,
  days,
  budget,
  travel_style,
}) => {
  try {
    // Messages array for chat-completions
    const messages = [
      {
        role: "system",
        content:
          "You are a travel planner AI. Respond ONLY in valid JSON following this Itinerary schema: user, destination, trip_name, start_date, end_date, total_days, budget, travel_style, daily_plan[], cost_breakdown, status."
      },
      {
        role: "user",
        content: `Generate a ${days}-day itinerary for ${destination} within a budget of ${budget} INR/USD, travel style: ${travel_style}. Include daily_plan with activities, each activity must have poi_id/accommodation_id placeholders, transport_mode, notes, estimated_cost. status should be 'draft'. Dates should start from today's date. Return only valid JSON, do NOT include any markdown or backticks.`
      },
    ];

    // Cerebras-native API URL
    const apiUrl = "https://api.cerebras.ai/v1/chat/completions";

    // API key from env
    const apiKey = process.env.CEREBRAS_API_KEY;

    // Model (Qwen3 recommended for Cerebras)
    const model = process.env.AI_MODEL || "qwen/qwen-3-14b-instruct";

    // Call Cerebras API
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000, // ⚠️ adjust to control token usage
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract AI content
    let content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned from Cerebras.");

    // ✅ Robustly remove Markdown code fences and extra whitespace
    content = content.replace(/(^```json\s*|^```\s*|```$)/g, "").trim();

    // Parse JSON safely
    const parsed = JSON.parse(content);

    return parsed;
  } catch (error) {
    console.error(
      "Cerebras API call failed:",
      error.response?.data || error.message
    );
    // Fallback or propagate error
    throw new Error("AI generation failed. Please try again later.");
  }
};
