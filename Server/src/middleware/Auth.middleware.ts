import { Request,Response , NextFunction } from 'express';

import jwt,{JwtPayload } from "jsonwebtoken";
import ApiError from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { redis } from '../utils/Redis';


export const isAutheticated = asyncHandler(async (req:Request ,res:Response,next:NextFunction) => {
    const access_token = req.cookies["access_token"];
    // console.log(req.cookies)
    // console.log("accesss TOken ++++++++++++=",access_token)

        if(!access_token){
            const refresh_token = req.cookies["refresh_token"];
            if(!refresh_token){
             throw new ApiError(401,"User is not Login In Our website");
            }
            return next(new ApiError(401, "Please refresh token"));
        }
        const decoded = await jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload;
        
        if(!decoded){
            throw new ApiError(401,"access token is not vaild ");
        }

        const user = await redis.get(decoded._id);
      
        // console.log(user);
        if(!user){
            throw new ApiError(400,"Please Login To website")
        }
            req.user = JSON.parse(user);
        // console.log(req.user);
               
         next();
})

export const authorizeRoles = (...roles : string[]) =>{
return (req : Request , res: Response , next : NextFunction)=>{
    if(!roles.includes(req.user?.role || '')){
        throw new ApiError(400,`Role ${req.user?.role} is not allowed to access this resources`)
    }
    next();
}
}