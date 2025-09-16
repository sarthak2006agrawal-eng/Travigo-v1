import User from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Get user preferences
export const getPreferences = asyncHandler(async (req, res, next) => {
  
  const user = await User.findById(req.user._id).select("preferences");
  if (!user) throw new ApiError(404, "User not found");

  return new ApiResponse(200, "Preferences fetched successfully", user.preferences).send(res);
}); 


// Update user preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const { interests, travelStyle } = req.body;

    if (!interests && !travelStyle) {
      throw new ApiError(400, "No preferences provided");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    if (interests) user.preferences.interests = interests;
    if (travelStyle) user.preferences.travelStyle = travelStyle;

    await user.save();

    return new ApiResponse(200, "Preferences updated successfully", user.preferences).send(res);
  } catch (err) {
    next(err);
  }
};


