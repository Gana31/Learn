import mongoose from "mongoose"
import CourseModel from "../models/course.model"
import { paymentSuccessEmail } from "../utils/OrderConfirm"
import courseProgressModel from "../models/courseProgress.mode"
import userModel from "../models/user.model"
import crypto from "crypto"
import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { instance } from "../db/razorpay.connection"
import { sendMail } from "../utils/SendMail"
import ApiError from "../utils/ApiError"
require("dotenv").config();
// Capture the payment and initiate the Razorpay order
export const capturePayment = asyncHandler(async (req:Request,res:Response) => {
  const { courses } = req.body
  const userId = req?.user?._id
  // console.log("courses form backend",req.body)
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await CourseModel.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
        console.log("course.studentesEntrolled",course)
      course.studentsEnrolled.some(studentId => console.log("studnetID", studentId.toString() === userId.toString()));

      const isEnrolled = course.studentsEnrolled.some(studentId => studentId.toString() === userId.toString());
      if (isEnrolled) {
        return res.status(200).json({ success: false, message: "Student is already Enrolled" });
      }
      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error : any) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    // console.log("Payement Response",paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
})


// verify the payment

export const verifyPayment = asyncHandler(async (req:Request,res:Response) => {
    const razorpay_order_id = req.body?.bodyData.razorpay_order_id
    const razorpay_payment_id = req.body?.bodyData.razorpay_payment_id
    const razorpay_signature = req.body?.bodyData.razorpay_signature
    const courses = req.body?.bodyData.courses
  
    const userId = req?.user?._id
    // console.log("verfify payment ",req.body)
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed all field are required" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex")
      // console.log("expectedSignature",expectedSignature,razorpay_signature)
    if (expectedSignature === razorpay_signature) {
     
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed beacuse of internal issue" })
})


// Send Payment Success Email
export const sendPaymentSuccessEmail = asyncHandler(async (req:Request,res:Response) => {
  const { orderId, paymentId, amount } = req.body
  // console.log("orderid payment from sendPaymentScucessEmail ",req.body)
  const userId = req.user?._id
  // console.log("user form send payment ",amount,paymentId,orderId)
  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details in sendPaymentSuccessEmail" })
  }

  try {
    const enrolledStudent = await userModel.findById(userId)
    // console.log("enrolledStudent user Object",enrolledStudent)
    await sendMail({
        type : "emailOptions4",
        email:  enrolledStudent?.email as string,
        subject: `Payment Received`,
        data :  paymentSuccessEmail(
            `${enrolledStudent?.FirstName} ${enrolledStudent?.LastName}`,
            amount / 100,
            orderId,
            paymentId
          ),
    }).catch((e) => {
        throw new ApiError(400, "email is not connected");
    });
    
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}
);



// enroll the student in the courses

const enrollStudents = async (courses : any, userId : string, res : any) => {
  // console.log("fromt the enrollStudneds",courses,userId)
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await CourseModel.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      // console.log("Updated course: ", enrolledCourse)

      const courseProgress = await courseProgressModel.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await userModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      // console.log("Enrolled student updateteee: ", enrolledStudent)
      // Send an email notification to the enrolled student
    //   const emailResponse = await mailSender(
    //     enrolledStudent.email,
    //     `Successfully Enrolled into ${enrolledCourse.courseName}`,
    //     courseEnrollmentEmail(
    //       enrolledCourse.courseName,
    //       `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
    //     )
    //   )

    //   console.log("Email sent successfully: ", emailResponse.response)
    } catch (error : any) {
      // console.log('from the enrollcoursese sturdne ',error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}