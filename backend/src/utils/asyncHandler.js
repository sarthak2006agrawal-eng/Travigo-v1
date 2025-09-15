export const asyncHandler = (fn)=> async(req,res,err,next) =>{
   try {
      await fn(req,res,err,next);
   } catch (error) {
    next(error);
   } 
};