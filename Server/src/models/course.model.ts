import mongoose,{Document,Model,Schema} from "mongoose";
import { UserSchemaInterface } from "./user.model";

export interface CategorySchemaInterface extends Document {
    name : string;
    description:string;
    courses:mongoose.Schema.Types.ObjectId[];
}

export interface ICourse extends Document {
    courseName: string;
    courseDescription: string;
    instructor: UserSchemaInterface | mongoose.Schema.Types.ObjectId;
    whatYouWillLearn: string;
    courseContent:  Array<{ courseId: mongoose.Schema.Types.ObjectId }>;
    price: number;
    thumbnail: object;
    category: CategorySchemaInterface | mongoose.Schema.Types.ObjectId;
    tag: string[];
    studentsEnrolled:  Array<{ courseId: mongoose.Schema.Types.ObjectId }>;
    ratingAndReviews : Array<{ courseId: mongoose.Schema.Types.ObjectId }>;
    instructions: string[];
    status: "Draft" | "Published";
}



const courseSchema = new Schema<ICourse>({
    courseName : {
        type : String,
        required:true,
    },
    courseDescription:{
        type : String,
        required:true,
    },
    instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
    whatYouWillLearn: {
		type: String,
	},
    courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
    price : {
        type : Number,
        required : true,
    },
    thumbnail:{
        public_id : {
            // required : true,
            type : String,
        },
        url :{
            // required : true,
            type : String,
    
        }
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
    },
    tag : [{
        required:true,
        type:String,
    }],
    studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
        default : "Draft",
	},
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      }] ,

    
},{timestamps:true})

const CourseModel : Model<ICourse> = mongoose.model("Course",courseSchema);
export default CourseModel;