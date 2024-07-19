import { NextFunction, Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { OrderInterface } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { NewOrder, getAllOrderServices } from "../Services/order.services";
import { sendMail } from "../utils/SendMail";
import NotificationModel from "../models/notification.model";
import { redis } from "../utils/Redis";

export interface orderData {
    courseId : string;
    userId : string;
    payement_info :object;
}

export const createOrder = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {courseId,payement_info} = req.body as OrderInterface;
        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course : any)=> course?._id.toString() === courseId);
        
        if(courseExistInUser){
            throw new ApiError(404,"you have Already Purchase the Course");
        }
        const course = await CourseModel.findById(courseId);

        if(!course){
            throw new ApiError(404," Course Not FOund To Purchase");
        }
        

        const orderdata : orderData = {
            courseId : course._id,
            userId : user?._id,
            payement_info,
        };

        

        const data = {
                _id : course._id.toString().slice(0,6),
                name:course.name,
                price:course.price,
                date : new Date().toLocaleDateString('en-Us',{year:'numeric',month:'long',day:'numeric'}),
        };
        // console.log(data)
        if(user){
            await sendMail({
                type:"emailOptions3",
                email:user.email,
                subject : "Order Confirmation",
                data,
            })
        }
        user?.courses.push(course?._id);
        await user?.save();

        const notification = await NotificationModel.create({
            usr:user?._id,
            title:"New Order",
            message:`You Have a New Order From ${course?.name} `,
        });
       course.purchased ? course.purchased += 1 : course.purchased;
         await course.save();
        //  console.log(course.purchased)
        NewOrder(orderdata,res,next);
        const userExist = await redis.get(user?._id)
        if(userExist){
            await redis.set(user?._id,JSON.stringify(user));
        }

    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "invaild request for Creating ORder")
    }
})

export const getAllOrders = asyncHandler(async (req:Request,res:Response) => {
    try {
        getAllOrderServices(res);
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While GetAllOrders FOrm OderServices In Oder Controller")
    }
})