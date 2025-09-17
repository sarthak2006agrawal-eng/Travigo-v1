import { ApiResponse } from "../utils/apiResponse.js";

export const errorHandler = (err,req,res,next)=>{
  const message = err.message || "Issue with the server";
  const status=err.status || 500;

  return new ApiResponse(status, message).send(res);

}; 