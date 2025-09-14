import mongoose from "mongoose";


import { DB_NAME } from "../utils/constants.js";

async function connectDB(){
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    return connection;
  } catch (error) {
    throw error;
  }
} 

export default connectDB;