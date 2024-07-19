import mongoose ,{ Document, Model, Schema } from "mongoose";

export interface categoryInterface extends Document{
name : string;
description : string;
courses : mongoose.Schema.Types.ObjectId[]
}

const categorySchema : Schema<categoryInterface> = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
});

const categoryModel : Model<categoryInterface> = mongoose.model<categoryInterface>("Category", categorySchema);

export default categoryModel;