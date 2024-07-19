import { NextFunction ,Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import OrderModel from "../models/order.model";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { orderData } from "../controllers/order.controller";


export const NewOrder = async(data:orderData,res:Response,next:NextFunction)=>{
try {
    const order = await OrderModel.create(data);
    res.send(new ApiResponse(200,"Order Is Placed By user",order))
} catch (error) {
    throw new ApiError(401, error instanceof Error ? error.message : "Error Accouring while creating ORderModel");
}
}

export const getAllOrderServices = async( res: Response) =>{
    const order = await OrderModel.find().sort({createdAt:-1});
    res.send(new ApiResponse(200,"all User Fetched Successfully",order));
}