import mongoose, { Document, Schema, Model } from "mongoose";


export interface ISubSection extends Document {
    title: string;
    timeDuration: string;
    description: string;
    public_id: string;
    videoUrl: string;
}


const SubSectionSchema: Schema<ISubSection> = new mongoose.Schema({
    title: { type: String, required: true },
    timeDuration: { type: String, required: true },
    description: { type: String, required: true },
    public_id: { type: String, required: true },
    videoUrl: { type: String, required: true },
}, { timestamps: true });


const SubSectionModel: Model<ISubSection> = mongoose.model<ISubSection>("SubSection", SubSectionSchema);

export default SubSectionModel;
