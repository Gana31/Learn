import userModel from "../models/user.model"
import { Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { redis } from "../utils/Redis";


export const  getUserById = async(id:string,res:Response)=>{
 
const userjson = await redis.get(id);
if(userjson){
    const user = JSON.parse(userjson)
    res.send(new ApiResponse(200,'GETTING a User By Id',user))
}

}


export const getAllUserServices = async( res: Response) =>{
    const users = await userModel.find().sort({createdAt:-1});
    res.send(new ApiResponse(200,"all User Fetched Successfully",users));
}

export const updateUserRoleService = async (res:Response , _id:string, role:string) => {
    const user = await userModel.findByIdAndUpdate(_id,{role},{new :true});
    res.send(new ApiResponse(200,"User Role Upadate Succesfully Bu admin",user))
}