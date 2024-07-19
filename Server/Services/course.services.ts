import {Response } from "express";
import CourseModel, { ICourse } from "../models/course.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";



export const createCourse = asyncHandler( async(data,res:Response) => {
    const  course = await CourseModel.create(data);
    res.send(new ApiResponse(200,"Course Created Successfully",course))
})

export const getAllCoursesServices = async( res: Response) =>{
    const Courses = await CourseModel.find().sort({createdAt:-1});
    res.send(new ApiResponse(200,"all User Fetched Successfully",Courses));
}