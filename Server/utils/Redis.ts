import {Redis} from 'ioredis'
import ApiError from "./ApiError"
require("dotenv").config();

 const RedisClient = () =>{
    if(process.env.REDIS_URL){
        console.log("Redis is Connected");
    return process.env.REDIS_URL;
    }
    throw new ApiError(400,"Redis Is Not Conected");
}

export const redis = new Redis(RedisClient());