import mongoose, {Document , Model , Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import { sign ,Secret} from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
require("dotenv").config();


const emailValidator : RegExp =  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


export interface UserSchemaInterface extends Document {
    FirstName : string;
    LastName : string;
    email : string;
    password : string;
    avatar :{
        public_id : string;
        avatar_url : string;
    },
    role: string;
    isVerfied : boolean;
    courses :  Array<{ courseId: mongoose.Schema.Types.ObjectId }>;
    gender : string;
    dateOfBirth : string;
    about:string;
    contactNumber:number;
    courseProgress:string[]
    isPasswordIsCorrect : (password : string) => Promise<boolean>;
    signAcessToken : ()=> string;
    signrefreshToken :()=> string;
}

const UserSchema : Schema<UserSchemaInterface> = new mongoose.Schema({
    FirstName:{
        type:String,
        required:[true,"Please Enter Your FirstName"],
    },
    LastName:{
        type:String,
        required:[true,"Please Enter Your LastName"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        validate:{
            validator : function(value :string){
                return emailValidator.test(value);
            },
            message:"Please enter the Valid Email",
        },
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        minlength:[6,"Password Needed Atleast 6 Character"],
        select:false,
        trim:true,
    },
    avatar:{
        public_id : String,
        avatar_url : String,
    },
    role:{
        type:String,
        enum: ['admin', 'Student', 'Instructor'],
        default:"Student",
    },
    isVerfied:{
        type:Boolean,
        default:false,
    },
    courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
    gender: {
		type: String,
        default:null,
	},
	dateOfBirth: {
		type: String,
        default:null,
	},
	about: {
		type: String,
		trim: true,
        default:null,
	},
	contactNumber: {
		type: Number,
		trim: true,
        default:null,
          
	},
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseProgress",
        },
    ],

},{timestamps:true})

UserSchema.pre<UserSchemaInterface>("save",async function (next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();  
})

UserSchema.methods.isPasswordIsCorrect = async function (enterPassword : string) : Promise<boolean> {
    return await bcrypt.compare (enterPassword ,  this.password);
}

UserSchema.methods.signAcessToken = function(): string{
return sign({_id : this._id},process.env.ACCESS_TOKEN || "",{
    expiresIn:"1d",
})
}

UserSchema.methods.signrefreshToken = function(): string{
    return sign({_id : this._id},process.env.REFRESH_TOKEN || "",{
        expiresIn:"5d",
    })
}

UserSchema.methods.generateAccessToken = function() : string {
 return sign({
    _id : this._id,
    email : this.email,
 },process.env.ACCESS_TOKEN_SECRET as Secret,{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
 })
}


const userModel: Model<UserSchemaInterface> = mongoose.model("User",UserSchema);
export default userModel;