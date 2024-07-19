import mongoose,{Model,Document,Schema} from "mongoose";


export interface NotificationInterface extends Document{
title : string;
message : string;
status : string;
userId : string;
}

const NotificationSchema = new Schema<NotificationInterface>({
    title : {
        type: String,
        required:true,
    },
    message : {
        type: String,
        required:true,
    },
    status : {
        type: String,
        required:true,
        default:"unread"
    },
    // userId : {
    //     type: String,
    // },
},{timestamps:true});

const NotificationModel : Model<NotificationInterface> = mongoose.model("Notification",NotificationSchema);
export default NotificationModel;