import mongoose, { Document ,Model,Schema} from "mongoose";

export interface SectionSchemaInteface extends Document{
	sectionName : string;
	subSection : mongoose.Schema.Types.ObjectId[];
}

const sectionSchema : Schema<SectionSchemaInteface>= new mongoose.Schema({
	sectionName: {
		type: String,
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SubSection",
		},
	],
});

const sectionModel: Model<SectionSchemaInteface> = mongoose.model<SectionSchemaInteface>("Section", sectionSchema);

export default sectionModel;
