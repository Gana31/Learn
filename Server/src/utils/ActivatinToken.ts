require("dotenv").config();
import { Secret, sign } from "jsonwebtoken";

 interface ActivationTokenInterface {
    ActivationCode : string;
    Token : string;
 }

export const CreateActivationToken = (FirstName:string,LastName:string,email:string,password:string,role:string) : ActivationTokenInterface =>{
    const user = {LastName,FirstName , email,password,role}
    // console.log("from createActivationToken ", user)
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const Token = sign({user,ActivationCode},process.env.ACTIVATION_SECRET as Secret , {expiresIn:"5m"})
    return {Token , ActivationCode}
}