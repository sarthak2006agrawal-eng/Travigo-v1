import express from 'express';

const app = express();

//Global middlewares
import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(cors({origin: process.env.CORS_ORIGIN}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//Rpote sections
import authRouter from './routes/authRoutes.js'; 


app.use('/api/v1/auth', authRouter);


//error mIddleware
import { errorHandler } from './middleware/errorHandler.js';

app.use(errorHandler);
export default app;