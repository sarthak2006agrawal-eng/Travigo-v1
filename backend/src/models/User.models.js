import { Schema, model } from 'mongoose';
import bycrypt from 'bcryptjs';
const kycSchema = new Schema({
  documnetType: {
    type: String,
    enum: ['passport', 'driver_license', 'aadhar_card', 'pan_card'],
    required: true,
  },

  documentNumber: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    preferences: {
      budget: { type: Number, default: 0 },
      interests: [String],
      locations: [String],
      travelStyle: {
        type: String,
        enum: ['luxury', 'budget', 'balanced'],
        default: 'balanced',
      },
    },

    kyc: kycSchema,

    blockchainId: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.passwsord = await bycrypt.hash(this.password, 10);
  next();
})  

userSchema.methods.comparePassword = async function(){
  return await bycrypt.compare(password,rhis.password);
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({ userId: this._id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
};

const User = new model('User', userSchema);

export default User;
