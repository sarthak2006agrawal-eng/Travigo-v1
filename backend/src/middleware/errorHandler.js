import { ApiResponse } from "../utils/apiResponse.js";

export const errorHandler = (res,err)=>{
  const message = err.message;
  const status=err.status;

  new ApiResponse(status, message).send(res);

}; 