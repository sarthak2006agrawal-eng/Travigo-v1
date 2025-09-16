// backend/src/models/destination.model.js

import mongoose from "mongoose";

/**
 * Destination Schema
 * ==================
 * Represents static travel data for a destination (city or region).
 * - Unlike itineraries (user-specific), destinations are universal and reusable.
 * - Seeded once (from JSON/API), updated rarely.
 * - Powers itinerary generation, personalization, and recommendations.
 */

const destinationSchema = new mongoose.Schema(
  {
    city: {
      id: { type: String, required: true, unique: true }, // e.g., "C3"
      name: { type: String, required: true }, // e.g., "Shimla"
      state: { type: String },
      country: { type: String },
      coordinates: {
        lat: Number,
        lon: Number,
      },
      timezone: String,

      // Metadata
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },

      // ✅ Group size (useful for trip planning constraints)
      group_size: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 20 },
      },

      // ✅ Description in multiple languages
      description: {
        en: { type: String },
        hi: { type: String },
      },

      // ✅ Media (images, videos, thumbnails)
      media: {
        images: [String], // e.g., Cloudinary/URLs
        videos: [String],
        thumbnails: [String],
      },

      // ✅ POIs (Points of Interest: attractions, activities)
      pois: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          id: { type: String, required: true },
          name: {
            en: { type: String },
            hi: { type: String },
          },
          category: String,
          subcategory: String,
          description: {
            en: String,
            hi: String,
          },
          coordinates: {
            lat: Number,
            lon: Number,
          },
          rating: Number,
          cost: [
            {
              amount: Number,
              currency: String,
              type: String, // entry_fee, activity_cost
              category: String, // activity, transport, etc.
            },
          ],
          estimated_duration_minutes: Number,
          preference_category: [String], // maps to user preferences
          accessibility: {
            wheelchair_accessible: Boolean,
            pet_friendly: Boolean,
          },
          best_time_to_visit: {
            start: String, // e.g., "09:00"
            end: String,
          },
          weather_alerts: [String],
        },
      ],

      // ✅ Accommodations (hotels, stays, resorts)
      accommodations: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          id: { type: String, required: true },
          name: {
            en: String,
            hi: String,
          },
          coordinates: {
            lat: Number,
            lon: Number,
          },
          rating: Number,
          cost_per_night: Number,
          category: String, // luxury, mid-range, budget
          currency: String,
          amenities: [String], // wifi, spa, breakfast
          type: String, // 3-star, 5-star, boutique
          accessibility: {
            wheelchair_accessible: Boolean,
            pet_friendly: Boolean,
          },
        },
      ],

      // ✅ Transport options available in the city
      transport: {
        scooter_rental: {
          per_day: Number,
          currency: String,
        },
        car_rental: {
          average_fare: Number,
          currency: String,
        },
        bike_rental: {
          per_day: Number,
          currency: String,
        },
        bus_coach: {
          per_day: Number,
          currency: String,
        },
        train: {
          average_fare: Number,
          currency: String,
        },
        domestic_flight: {
          average_fare: Number,
          currency: String,
        },
      },

      // ✅ Restrictions & Safety
      restrictions: {
        entry_requirements: String, // "Govt ID required"
        closed_days: [String], // e.g., ["Monday"]
        safety_tips: [String], // "Avoid night treks"
        travel_advisories: [String], // Govt alerts
      },

      // ✅ Cultural & Local Info
      local_info: {
        language_spoken: [String], // ["Hindi", "English"]
        festivals: [
          {
            name: String,
            description: String,
            start_date: Date,
            end_date: Date,
          },
        ],
        food_specialities: [String], // "Chole Bhature", "Fish Curry"
      },

      // ✅ Tags & Metadata
      tags: [String], // ["beach", "heritage", "romantic"]
      keywords: [String],

      // ✅ External references for integrations
      external_refs: {
        wikipedia: String,
        tripadvisor: String,
        google_place_id: String,
        official_tourism_website: String,
      },

      // ✅ Popularity & Engagement (for recommendations)
      popularity: {
        monthly_visitors_estimate: Number,
        trending_score: Number, // custom score
      },
      reviews: [
        {
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          rating: Number,
          comment: String,
          created_at: { type: Date, default: Date.now },
        },
      ],

      // ✅ Connectivity (how to reach the destination)
      connectivity: {
        nearest_airport: {
          name: String,
          distance_km: Number,
        },
        nearest_railway: {
          name: String,
          distance_km: Number,
        },
        nearest_bus_terminal: {
          name: String,
          distance_km: Number,
        },
      },

      // ✅ Seasonality (best time to visit)
      seasonality: [
        {
          season: String, // "Winter", "Monsoon"
          best_months: [String], // ["Nov", "Dec"]
          notes: String,
        },
      ],

      // ✅ Weather alert thresholds (tie with APIs)
      weather_alert: {
        sources: [String], // "OpenWeatherMap"
        thresholds: {
          rain: String,
          landslide_risk: String,
          snow: String,
          cold: String,
          heat: String,
          cyclone_risk: String,
          storm: String,
          high_tide: String,
        },
      },
    },
  },
  { timestamps: true } // Mongo will auto add createdAt, updatedAt
);

// Create model
const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
