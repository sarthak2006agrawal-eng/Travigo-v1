// controllers/kyc.controller.js
import User from "../models/User.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * POST /users/kyc
 * Body: { documentType, documentNumber }
 * Saves KYC details for the logged-in user
 */
export const submitKYC = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { documentType, documentNumber } = req.body;

  // Validate input
  if (!documentType || !documentNumber) {
    throw new ApiError(400, "documentType and documentNumber are required");
  }

  const allowedTypes = ["passport", "driver_license", "aadhar_card", "pan_card"];
  if (!allowedTypes.includes(documentType)) {
    throw new ApiError(400, "Invalid documentType");
  }

  // Check if the document number is already used by another user
  const existingUser = await User.findOne({
    "kyc.documentNumber": documentNumber,
    _id: { $ne: userId },
  });
  if (existingUser) {
    throw new ApiError(400, "This document number is already in use");
  }

  // Update the user's KYC
  const user = await User.findByIdAndUpdate(
    userId,
    {
      kyc: {
        documentType,
        documentNumber,
        verified: false,
        verifiedAt: null,
      },
    },
    { new: true }
  );

  return new ApiResponse(200, "KYC submitted successfully", user.kyc).send(res);
});
