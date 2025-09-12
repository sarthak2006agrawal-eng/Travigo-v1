import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true },

  // Which item inside the itinerary was booked?
  day: Number,   // Day of itinerary
  itemType: { type: String, enum: ["hotel", "transport", "activity"], required: true },
  itemName: String,        // e.g. "Hotel XYZ" or "Delhi to Agra Train"
  bookingLink: String,     // ✅ store the link user clicked
  provider: String,        // e.g. OYO, IRCTC
  bookingRef: String,      // Reference ID returned by provider

  amount: Number,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
