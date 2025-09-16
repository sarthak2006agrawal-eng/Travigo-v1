import express from 'express';

const app = express();

//Global middlewares
import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(cors({origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//Rpote sections
import authRouter from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoute.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
// import destinationRoutes from './routes/destinationRoutes.js';

app.use('/api/v1/auth', authRouter);
app.use("/api/users", userRoutes);
app.use("/api/itineraries", itineraryRoutes);
// app.use("/api/destinations", destinationRoutes);



//error mIddleware
import { errorHandler } from './middleware/errorHandler.js';

app.use(errorHandler);
export default app;