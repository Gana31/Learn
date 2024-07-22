import { Request, Response, NextFunction } from "express";
import userModel, { UserSchemaInterface } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateActivationToken } from "../utils/ActivatinToken";
import { sendMail } from "../utils/SendMail";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { getAllUserServices, getUserById, updateUserRoleService } from "../Services/user.services";
import { SendTokenToRedis, acccesTokenOptions, refreshTokenOptions } from "../utils/jwt";
import { redis } from "../utils/Redis";
import cloudinary from "cloudinary"
import fs from "fs"

interface registerInterface {
    FirstName: string;
    LastName: string;
    email: string
    password: string;
    avatar?: string;
    role : string
}
export interface emailData {
    user: { name: string };
    ActivationCode: string;
}



export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("From the registerUser",req.body);
    const { FirstName,LastName, email, password ,role } = req.body as registerInterface;
    
    if (
        [FirstName,LastName, email, password,role].some((field) => field === "")) {
        throw new ApiError(400, "All Fields Are Requried");
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
        throw new ApiError(400, "User Is Already Exists");
    }

    const { Token, ActivationCode } = CreateActivationToken(FirstName,LastName, email, password,role);
    const data: emailData = { user: { name: FirstName + LastName }, ActivationCode }

    await sendMail({
        type : "emailOptions",
        email: email,
        subject: "Activate Your Account",
        data,
    }).catch((e) => {
        throw new ApiError(400, "email is not connected");
    });

    res.send(new ApiResponse(200, `Please check Your Email : ${email} to activate  your account `, Token));

})





interface ActivatinRequestInterface {
    accessToken: string,
    activation_code: string,
}

export const ActivateRequest = asyncHandler(async (req: Request, res: Response) => {

    try {
        const { activation_code, accessToken} = req.body as ActivatinRequestInterface;
        const newUser: { user: UserSchemaInterface; ActivationCode: string } = verify(
            accessToken,
            process.env.ACTIVATION_SECRET as string) as { user: UserSchemaInterface; ActivationCode: string };

            // console.log("From the Activate Request",newUser.user);
            // console.log(activation_code,accessToken)
        const { LastName,FirstName, email, password,role } = newUser.user;
        const existuser = await userModel.findOne({ email });
        if (existuser) {
            throw new ApiError(400, "user is already register to our Website");
        }

        if (newUser.ActivationCode !== activation_code) {
            throw new ApiError(400, "Invalid activation Code");
        }
        else {
            if (activation_code !== (null || undefined)) {
        const avatarUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${FirstName} ${LastName}`;
        const avatarResponse = await fetch(avatarUrl);
        const avatarSvg = await avatarResponse.text();

        // Upload avatar to Cloudinary
        const avatarUpload = await cloudinary.v2.uploader.upload(`data:image/svg+xml;base64,${Buffer.from(avatarSvg).toString('base64')}`, {
          folder: "avatars",
          width: 150,
        });
                const createUser = await userModel.create({
                    FirstName,
                    LastName,
                    email,
                    password,
                    role,
                    avatar: {
                        public_id: avatarUpload.public_id,
                        avatar_url: avatarUpload.secure_url,
                      },
                });

                res.send(new ApiResponse(200, "User is succesfully created",))
            }
            else {
                throw new ApiError(400, "Token Is expired ")
            }
        }
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "invaild request for token validation")
    }

})


export const  getUserInfo = asyncHandler(async(req : Request , res : Response)=>{
    try {
        const userId = req.user?._id;
        getUserById(userId,res);

    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "User Info not Found")
    }
})


interface userLoginInterface {
    email: string;
    password : string;   
   }
   
   export const userLogin = asyncHandler(async(req:Request,res:Response)=>{
       try {
           const {email,password} = req.body as userLoginInterface;
        //    console.log(email,password);
           if (!email || !password){
               throw new ApiError(400,"Please Enter the email and password");
   
           }
           const user = await userModel.findOne({email}).select("+password");
           if(!user){
               throw new ApiError(400,"User is not Exist");
           }
        //    console.log(user);
   
           const isPassword = await user.isPasswordIsCorrect(password);;
           if(!isPassword){
               throw new ApiError(400,"User is not Match");
           }
        //    console.log(user,200,res);
           SendTokenToRedis(user,200,res);
   
   
       } catch (error : any) {
           throw new ApiError(401, error)
       }
   })


   export const userLogout = asyncHandler(async(req : Request ,res : Response,next:NextFunction)=>{
    try {
        const domains = [ 'https://learn-alpha-murex.vercel.app',
            'https://learn-git-main-gana31s-projects.vercel.app',
            'https://learn-cw69512x3-gana31s-projects.vercel.app'];
        // console.log(req.user || "");
        const id = req.user?._id || ''
        await redis.del(id);
        domains.forEach(domain => {
            res.cookie("access_token", "", {
                maxAge: 1,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                domain: domain,
                path: '/'
            });

            res.cookie("refresh_token", "", {
                maxAge: 1,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                domain: domain,
                path: '/'
            });
        });

        res.status(200).json(new ApiResponse(200,"User LogOut Succesfully"))

    } catch (error : any) {
        next( new ApiError(401, error))
    }
})



interface SocialAuthInterface {
    email:string;
    name:string;
    avatar:string;
    }
    
    
    export const SocialAuth = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const {email,name,avatar} = req.body as SocialAuthInterface;
        const user = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({name,email,avatar});
            SendTokenToRedis(newUser,200,res)
        }
        else{
            SendTokenToRedis(user,200,res)
        }
    
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Trouble while using SocialAuth ")
    }
    })


    export const updateAcesssToken = asyncHandler(async( req : Request , res: Response)=>{
        try {
            const refresh_token = req.cookies.refresh_token as string;
            console.log("Refresh TOken From the update",refresh_token);
            const decoded = verify(refresh_token,process.env.REFRESH_TOKEN as string) as JwtPayload;
            // console.log(decoded);
            if(!decoded){
                throw new ApiError(4002,"could not refresh Token");
            }
            const session = await redis.get(decoded._id as string);
            if(!session){
                throw new ApiError(400,"Please Login for access this resources");
            }
          
            const user = JSON.parse(session);
             const accessToken = sign({_id:user._id}, process.env.ACCESS_TOKEN as string,{
                expiresIn: '1d'
             });
             const refreshToken = sign({_id:user._id},process.env.REFRESH_TOKEN as string,{
                expiresIn:"5d"
             });
             req.user = user;
             res.cookie("access_token",accessToken,acccesTokenOptions);
             res.cookie("refresh_token",refreshToken,refreshTokenOptions);

             await redis.set(user._id,JSON.stringify(user),"EX",604800);
             
             res.status(200).json({sucess: " True",accessToken,user})
        } catch (error) {
            throw new ApiError(401, error instanceof Error ? error.message : "Trouble while using updateacessToken ")
        }
    })
    
    
    
    
    
    interface updateUserInfoInterface {
        FirstName:string;
        LastName:string;
        email:string;
        about:string;
        gender:string;
        contactNumber:number;
        dateOfBirth : string;
    }
    
    export const UpdateUserInfo = asyncHandler(async(req:Request,res:Response)=>{
        try {
            const {FirstName,LastName , dateOfBirth ,about,contactNumber,gender} = req.body as updateUserInfoInterface;
            const userId = req.user?._id;
            const user = await userModel.findById(userId);
            
            if(FirstName && LastName && user && about && contactNumber && gender){
                user.FirstName = FirstName;
                user.LastName = LastName;
                user.about = about;
                user.contactNumber = contactNumber;
                user.gender = gender;
                user.dateOfBirth = dateOfBirth;
            }
            await user?.save();
             await redis.set(userId,JSON.stringify(user));
            res.send (new ApiResponse(200,"user is Updated Suucessfully",user));
        } catch (error) {
            throw new ApiError(401, error instanceof Error ? error.message : "Error Accuring While Updating User Info ")
        }
    })
    
    
    interface UpdatePasswordInterface {
        oldPassword : string;
        newPassword : string;
    }
    
    
    export const UpdatePassword = asyncHandler(async(req:Request,res:Response)=>{
    
        try {
            const {oldPassword,newPassword} = req.body as UpdatePasswordInterface;
            
            if(!oldPassword || !newPassword){
                throw new ApiError(400,"Please Enter the Old and New Password");
            }
            
            const user = await userModel.findById(req.user?._id).select("+password");
    
            if(user?.password === undefined){
             throw new ApiError(400,"Invalid User ");  
            }
    
            const isPasswordmatch = await user?.isPasswordIsCorrect(oldPassword);
            const isNewPassoword = await user?.isPasswordIsCorrect(newPassword);
            if(!isPasswordmatch){
                throw new ApiError(400,"Invaild old Password");
    
            }
            if(isNewPassoword || (oldPassword  === newPassword)){
                throw new ApiError(400,"New Password should Not Be The same As privious One")
            }
            user.password = newPassword;
            await user.save();
            await redis.set(req.user?._id,JSON.stringify(user));
    
            res.send(new ApiResponse(200,"User Password Updated Successfully",user));
        } catch (error) {
            throw new ApiError(401, error instanceof Error ? error.message : "Error Accuring While Updating User Password ")
        }
    })
    
    interface userAvatarInteface{
        avatar :string;
    }
    
    export const updateUserAvatar = asyncHandler(async(req:Request,res:Response)=>{
    
    try {
        // console.log("From the updateUserAvatar",req.body);
        const filePath = req?.file?.path;
        // console.log(filePath);
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
      if(filePath && user) {
          if(user?.avatar?.public_id){
             await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
             const myCloud =  await cloudinary.v2.uploader.upload(filePath,{
                folder : "avatars",
                width : 150,
            });
            user.avatar = {
                public_id : myCloud.public_id,
                avatar_url : myCloud.secure_url,
            }
          } else{
              const myCloud =  await cloudinary.v2.uploader.upload(filePath,{
                  folder : "avatars",
                  width : 150,
              });
              user.avatar = {
                  public_id : myCloud.public_id,
                  avatar_url : myCloud.secure_url,
              }
          }
          fs.unlinkSync(filePath);
      }
      
      await user?.save();
      await redis.set(userId,JSON.stringify(user));
      res.send(new ApiResponse(200,"Avatar succesfully Updated",user))
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Error Accuring While Updating User Avatar ")
    }
    
    })





export const getAllUseres = asyncHandler(async (req:Request,res:Response) => {
    try {
        getAllUserServices(res);
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While GetAllUSer")
    }
})


export const UpdateUserRole = asyncHandler(async (req:Request,res:Response) => {
    try {
        const {_id,role} = req.body;
        updateUserRoleService(res,_id,role);
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While Changing the User Role By Admin");
    }
})



export const DeleteUser = asyncHandler(async (req:Request,res:Response) => {
    try {
        const {_id} = req.params;
        const user = await userModel.findById(_id);
        if(!user){
            throw new ApiError(400,"User Is not Found FOr deleting");
        }

        await user.deleteOne({_id});
        await redis.del(_id);

        res.send(new ApiResponse(200,"User Deleted successfully"));
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While Deleting the User By Admin");
    }
})