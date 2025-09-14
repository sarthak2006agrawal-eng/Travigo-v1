/**
 * seed.js
 * 
 * PURPOSE:
 * ----------
 * This script "seeds" (inserts) data into our MongoDB database. 
 * Specifically, we are adding travel destination data (Goa, Pondicherry, Shimla) 
 * that we prepared as structured JSON files.
 * 
 * WHY WE NEED THIS:
 * ----------
 * - When we build the backend, we need initial test/demo data in our DB.
 * - Instead of manually inserting data in MongoDB Atlas or Compass,
 *   this script will insert everything at once.
 * - If data already exists, it will remove the old version (to avoid duplicates)
 *   and replace it with the new JSON version (clean overwrite).
 * 
 * HOW TO RUN:
 * ----------
 *   node seed.js
 * 
 * Make sure MongoDB is running (or Atlas is connected) and db.js is configured.
 */

import mongoose from "mongoose";         // Import mongoose (our ODM for MongoDB)
import connectDB from "./config/db.js";            // Our DB connection file (handles Mongo connection)
import Destination from "./models/destination.model.js"; // Our model that represents a destination (cities + details)

// Import JSON data (our source data)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const goaData = JSON.parse(readFileSync(join(__dirname, 'data', 'goa.json'), 'utf8'));
const pondicherryData = JSON.parse(readFileSync(join(__dirname, 'data', 'pondicherry.json'), 'utf8'));
const shimlaData = JSON.parse(readFileSync(join(__dirname, 'data', 'shimla.json'), 'utf8'));

/**
 * seedData function
 * -----------------
 * This is the main async function that:
 *   1. Connects to DB
 *   2. Iterates through each JSON destination file
 *   3. Removes old data for that city (if exists)
 *   4. Inserts fresh JSON data
 *   5. Logs success/failure
 *   6. Exits process
 */
const seedData = async () => {
  try {
    // 1. Connect to MongoDB using our connectDB helper
    await connectDB();
    console.log(" Database connected successfully!");

    // 2. Collect all destinations into an array
    //    (so we can loop through them instead of repeating code)
    const destinations = [goaData, pondicherryData, shimlaData];

    // 3. Loop through each destination JSON file
    for (const dest of destinations) {
      // Extract city ID from JSON
      // Example: Goa -> "C1", Pondicherry -> "C2"
      const cityId = dest.city.id;

      // 4. Remove any existing entry for the same city (avoid duplicates)
      await Destination.findOneAndDelete({ "city.id": cityId });
      console.log(` Old data for ${cityId} deleted (if it existed).`);

      // 5. Create a new Destination object using JSON data
      const newDest = new Destination(dest);

      // 6. Save new destination to database
      await newDest.save();
      console.log(` New data for ${dest.city.name} inserted successfully!`);
    }

    // 7. Log final success message
    console.log("🎉 All destination data seeded successfully!");

    // 8. Exit process with success code
    process.exit(0);

  } catch (err) {
    // If error happens at any stage, catch it here
    console.error(" Seeding error:", err);

    // Exit process with failure code (1)
    process.exit(1);
  }
};

// Call the function
seedData();
