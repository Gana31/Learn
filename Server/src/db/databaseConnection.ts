import mongoose from 'mongoose'
require("dotenv").config();

const connectDB = async() =>{
    
    try {
         await mongoose.connect(`${process.env.MONGODB_URL}/Learn`,{
            
         });
        console.log("DATABASE SUCESSFULLY CONNECTED");
    } catch (error) {
        console.log("ERROR WHILE CONNECTING DATABASE",error);
        process.exit(1)
    }
}
 export default connectDB;