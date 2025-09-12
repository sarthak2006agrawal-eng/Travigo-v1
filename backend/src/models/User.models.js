import {Schema, model} from 'mongoose';

const kycSchema = new Schema(
{
  documnetType: {
    type: String,
    enum: ['passport', 'driver_license', 'aadhar_card', 'pan_card'],
    required: true
  },

  documentNumber: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date }
});

const userSchema = new Schema(
{
  name: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },

  preferences: {
    budget: { type: Number, default: 0 },
    interests: [String], 
    locations: [String], 
    travelStyle: { 
      type: String, 
      enum: ["luxury", "budget", "balanced"], 
      default: "balanced" 
    }
  },

  kyc: kycSchema,

  blockchainId: { type: String }
}, 
{timestamps: true}
);

const User = new model('User', userSchema);

export default User;