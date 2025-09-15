import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Link to the destination (city chosen)
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },

    // Trip basics
    trip_name: { type: String, default: "My Trip" },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    total_days: Number,

    // Budget & style (user preference)
    budget: { type: Number },
    travel_style: {
      type: String,
      enum: ["luxury", "budget", "balanced"],
      default: "balanced",
    },

    // Planned schedule per day
    daily_plan: [
      {
        date: { type: Date, required: true },
        activities: [
          {
            poi: { type: mongoose.Schema.Types.ObjectId, ref: "Destination.city.pois" }, 
            // referencing a POI inside destination
            accommodation: { type: mongoose.Schema.Types.ObjectId, ref: "Destination.city.accommodations" },
            transport_mode: String,
            notes: String,
            estimated_cost: Number,
          },
        ],
      },
    ],

    // Cost summary
    cost_breakdown: {
      transport: Number,
      accommodation: Number,
      activities: Number,
      total: Number,
      currency: { type: String, default: "INR" },
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "confirmed", "completed", "cancelled"],
      default: "draft",
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
