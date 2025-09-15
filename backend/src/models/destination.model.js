// backend/src/models/destination.model.js

import mongoose from "mongoose";

/**
 * Destination Schema
 * This schema is designed to store static travel data for a city.
 * - Unlike itineraries (which are user-specific), destinations are universal
 *   and reusable by all users when generating itineraries.
 * - Each document in this collection = one city (Shimla, Goa, Pondicherry, etc.)
 * - Data here is mostly curated once (from JSON/seed data), and rarely changes.
 */

const destinationSchema = new mongoose.Schema({

  city: {
    id: { type: String, required: true, unique: true }, // e.g., "C3"
    name: { type: String, required: true }, // e.g., "Shimla"
    state: { type: String },
    country: { type: String },
    coordinates: {
      lat: Number,
      lon: Number
    },
    timezone: String,

    // When data was created/updated (from JSON seed files)
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    // ✅ To control how many people can plan trips to this destination
    group_size: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 20 }
    },

    // ✅ City description in multiple languages (currently English + Hindi)
    description: {
      en: { type: String },
      hi: { type: String }
    },

    /**
     * ✅ POIs (Points of Interest)
     * Examples: Mall Road, Kufri, Jakhoo Temple
     * Each POI has:
     *  - id, name, category/subcategory
     *  - description in multiple languages
     *  - geo coordinates
     *  - rating
     *  - cost (entry fee, activity cost)
     *  - estimated duration
     *  - preference_category (mapping to user questionnaire: nature, culture, etc.)
     *  - accessibility info
     *  - best visiting hours
     *  - weather alerts (rain, snow, etc.)
     */
    pois: [
      {
        id: { type: String, required: true },
        name: {
          en: { type: String },
          hi: { type: String }
        },
        category: String,
        subcategory: String,
        description: {
          en: String,
          hi: String
        },
        coordinates: {
          lat: Number,
          lon: Number
        },
        rating: Number,
        cost: [
          {
            amount: Number,
            currency: String,
            type: String,     // entry_fee, activity_cost
            category: String  // activity, transport, etc.
          }
        ],
        estimated_duration_minutes: Number,
        preference_category: [String], // maps to frontend questionnaire options
        accessibility: {
          wheelchair_accessible: Boolean,
          pet_friendly: Boolean
        },
        best_time_to_visit: {
          start: String, // e.g. "09:00"
          end: String
        },
        weather_alerts: [String]
      }
    ],

    /**
     * ✅ Accommodations
     * Hotels and stays available in this city
     *  - id, name (multi-language)
     *  - location coordinates
     *  - rating, cost, category (budget/luxury/mid-range)
     *  - amenities (wifi, spa, etc.)
     *  - type (3-star, 5-star, boutique, etc.)
     *  - accessibility info
     */
    accommodations: [
      {
        id: { type: String, required: true },
        name: {
          en: String,
          hi: String
        },
        coordinates: {
          lat: Number,
          lon: Number
        },
        rating: Number,
        cost_per_night: Number,
        category: String, // luxury, mid-range, budget
        currency: String,
        amenities: [String],
        type: String, // 3-star, 4-star, boutique
        accessibility: {
          wheelchair_accessible: Boolean,
          pet_friendly: Boolean
        }
      }
    ],

    /**
     * ✅ Transport
     * Available modes of transport in this destination
     *  - Multiple options (scooter, bike, car rental, train, flights, etc.)
     *  - Each has a cost in local currency
     */
    transport: {
      scooter_rental: {
        per_day: Number,
        currency: String
      },
      car_rental: {
        average_fare: Number,
        currency: String
      },
      bike_rental: {
        per_day: Number,
        currency: String
      },
      bus_coach: {
        per_day: Number,
        currency: String
      },
      train: {
        average_fare: Number,
        currency: String
      },
      domestic_flight: {
        average_fare: Number,
        currency: String
      }
    },

    /**
     * ✅ Weather Alert Settings
     * - Sources: APIs you trust (OpenWeatherMap, AccuWeather, etc.)
     * - Thresholds: rules for alerts (e.g., >50mm rain, 10cm snow, <0°C cold)
     * These can later be tied into an alert system for users.
     */
    weather_alert: {
      sources: [String],
      thresholds: {
        rain: String,
        landslide_risk: String,
        snow: String,
        cold: String,
        heat: String,
        cyclone_risk: String,
        storm: String,
        high_tide: String
      }
    }
  }

}, { timestamps: true }); // Mongo will add createdAt, updatedAt automatically


// Create model
const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
