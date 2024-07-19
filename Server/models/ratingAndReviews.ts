import mongoose, { Document, Model } from "mongoose";
// Define the RatingAndReview schema

export interface ratingAndReviewsI extends Document{
    user:mongoose.Schema.Types.ObjectId;
    rating:Number;
    review:String;
    course:mongoose.Schema.Types.ObjectId;

}


const ratingAndReviewSchema  = new mongoose.Schema<ratingAndReviewsI>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
});

// Export the RatingAndReview model
const ratingAndReviewModel : Model<ratingAndReviewsI> = mongoose.model<ratingAndReviewsI>("RatingAndReview", ratingAndReviewSchema);

export default ratingAndReviewModel;