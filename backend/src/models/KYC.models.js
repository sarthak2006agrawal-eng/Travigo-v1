import {Schema,model} from 'mongoose';



const kycSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  documentType: {
    type: String,
    enum: ['passport', 'driver_license', 'aadhar_card', 'pan_card'],
    required: true,
  },
  documentNumber: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
});

export const KYC = model('KYC', kycSchema);