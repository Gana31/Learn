import express, {Application, NextFunction, Request ,Response}  from 'express';
import cookieParser from 'cookie-parser'
import cors from "cors";
import connectDB from './db/databaseConnection';
import ApiError from './utils/ApiError';
import { ApiResponse } from './utils/ApiResponse';
import userRouter from './routes/user.route';
import {v2 as cloudinary} from "cloudinary";
import courseRouter from './routes/course.router';
import sectionRouter from './routes/section.router';
import ErrorHandler from './middleware/ErrorHandler';
// import orderRouter from './routes/order.routess';
// import AnalyticsRouter from './routes/analyatics.router';
// import layoutRouter from './routes/layout.router';
require("dotenv").config();

const app : Application = express()

app.use(express.json({limit:"50mb"}));

app.use(cors({
    credentials: true,
    origin:process.env.ORIGIN || "https://learn-alpha-murex.vercel.app" ,
    
}))
app.use(cookieParser());



app.use("/api/v1",userRouter,courseRouter,sectionRouter);


cloudinary.config({
cloud_name : process.env.CLOUD_NAME,
api_key : process.env.CLOUD_API_KEY,
api_secret : process.env.CLOUD_SECRET_KEY,
})
app.get("/",(req: Request,res:Response , next : NextFunction)=>{
  res.send("hello")
    })



app.all("*",(req: Request,res:Response , next : NextFunction)=>{
    next(new ApiError(400,"PAGE NOT FOUND "));
    })

    
app.use(ErrorHandler);

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("SERVER IS STARTED AT ",process.env.PORT);
    })
})
.catch((error)=>{
    console.log("ERROR ACCURING WHILE CONNECTING DATABASE ");
})
