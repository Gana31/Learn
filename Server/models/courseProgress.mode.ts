import mongoose,{Document,Model, Schema} from "mongoose"

export interface courseProgressInterface extends Document{
    courseID : mongoose.Schema.Types.ObjectId;
    userId : mongoose.Schema.Types.ObjectId;
    completedVideos : mongoose.Schema.Types.ObjectId[];
}

const courseProgress : Schema<courseProgressInterface> = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
})
const courseProgressModel : Model<courseProgressInterface> = mongoose.model<courseProgressInterface>("courseProgress", courseProgress);

export default courseProgressModel;