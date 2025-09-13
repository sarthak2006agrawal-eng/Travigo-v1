import app from "./app.js";
import connectDB from "./config/db.js";   
import dotenv from "dotenv";
dotenv.config({path: './.env'});


connectDB()
.then((connection)=>{
  console.log(`${connection.connection.name} is succesfully connected to Atlas server ${connection.connection.host}`);
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
  });

})
.catch((error)=>{
  console.log("Connection to mongoDB failed", error.message);
  process.exit(1);
})