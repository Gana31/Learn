import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import NotificationModel from "../models/notification.model";
import { ApiResponse } from "../utils/ApiResponse";
import cron from 'node-cron'


// admin
export const getNotification = asyncHandler(async (req:Request,res:Response) => {
    try {
        const notification = await NotificationModel.find().sort({createdAt : -1});
        res.send(new ApiResponse(200,"All notification Are Successfully fetch ",notification));

    } catch (error) {
        throw new ApiError(400, error instanceof Error ? error.message : "Error accuring while geting Notification");
    }
})

export const updateNotification = asyncHandler(async (req:Request,res:Response) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
    
        if (!notification) {
            throw new ApiError(400,"Notification is not found for Updating the content of Notification");
        } else {
            notification.status ? notification.status = "read" : notification.status;
        }

        await notification.save();

        const notifications = await NotificationModel.find().sort({createdAt : -1});

        res.send(new ApiResponse(200,"Notification Successfullyn Updated",notifications));
    } catch (error) {
        throw new ApiError(400, error instanceof Error ? error.message : "Error accuring while Updating Notification");
    }
})


// cron.schedule("*/5 * * * * *",function() {
//     console.log("cron is running")
// })
cron.schedule("0 0 0 * * *",async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({status:"read",createdAt : {$lt : thirtyDaysAgo}})
})



