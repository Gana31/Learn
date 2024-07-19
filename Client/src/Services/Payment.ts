import toast from "react-hot-toast";

import rzpLogo from "../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../Slice/CourseSlice";
import { resetCart } from "../Slice/CartSlice";
import { RAZORPAY_KEY } from "../data/homePageData";



function loadScript(src : any) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(courses : any, userDetails : any, navigate : any, dispatch : any,CapturePayment : any,
     VerifyPayment:any,SendPaymentSuccessEmail : any
    ) {
    const toastId = toast.loading("Loading...");
    try{
      
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
        const orderResponse = await CapturePayment({courses:courses}).unwrap();
        console.log("orderRespiosnse from reactjs",orderResponse)
         
        if(!orderResponse.success) {
            throw new Error(orderResponse.data.message);
        }
        // console.log("PRINTING orderResponse", orderResponse.data.amount);
        //options
        const options = {
            key: RAZORPAY_KEY,
            currency: orderResponse.data.currency,
            amount: `${orderResponse.data.amount}`,
            order_id:orderResponse.data.id,
            name:"Learn",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response : any) {
                // console.log("response from callback hansdler",response)
                //send successful wala mail
                sendPaymentSuccessFromEmail(response, orderResponse.data.amount,SendPaymentSuccessEmail);
                //verifyPayment
                verifyFromPayment({...response, courses},navigate, dispatch,VerifyPayment);
            }
        }
        //miss hogya tha 
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response : any) {
            // console.log("response from the paymenetObject",response)
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessFromEmail(response : any, amount : any,SendPaymentSuccessEmail: any) {
//   console.log("from forntend",amount)
  const orderId = response.razorpay_order_id;
  const paymentId = response.razorpay_payment_id;
    try{
        await SendPaymentSuccessEmail({
            orderId: orderId,
            paymentId: paymentId,
            amount : amount,
        }).unwrap();
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyFromPayment(bodyData : any,navigate : any, dispatch : any,VerifyPayment:any) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    // console.log("bodydata",bodyData)
    try{
        const response  = await VerifyPayment({bodyData}).unwrap();
            console.log("from the verifytpaymen",response)
        if(!response.success) {
            throw new Error(response.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}