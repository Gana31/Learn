import mongoose,{Schema,model,Document, Model} from "mongoose";

export interface OrderInterface extends Document {
    courseId : string;
    userId : string;
    payement_info : object;

}

const OrderSchema = new Schema<OrderInterface>({
    courseId : {
        type: String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    payement_info:{
        type : Object,
    }
},{timestamps:true});


const OrderModel : Model<OrderInterface> = mongoose.model("Order",OrderSchema);
export default OrderModel;