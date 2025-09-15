import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    plan: [
      {
        day: Number,
        location: String,

        activities: [
          {
            name: String,
            cost: Number,
            type: { type: String }, // e.g. sightseeing, adventure
            bookingLink: String, // ✅ link to activity booking
          },
        ],

        transport: {
          mode: String, // e.g. bus, train, cab
          cost: Number,
          provider: String, // e.g. IRCTC, Uber
          bookingLink: String, // ✅ link to transport booking
        },

        hotel: {
          name: String,
          cost: Number,
          provider: String, // e.g. OYO, Booking.com
          bookingLink: String, // ✅ link to hotel booking
        },

        totalDayCost: Number,
      },
    ],

    totalCost: Number,
    status: { type: String, enum: ['draft', 'final'], default: 'draft' },
  },
  { timestamps: true }
);

itinerarySchema.plugin(aggregatePaginate);

const Itinenary = mongoose.model('Itinerary', itinerarySchema);

export default Itinenary;
