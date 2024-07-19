"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentSuccessEmail = exports.verifyPayment = exports.capturePayment = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const OrderConfirm_1 = require("../utils/OrderConfirm");
const courseProgress_mode_1 = __importDefault(require("../models/courseProgress.mode"));
const user_model_1 = __importDefault(require("../models/user.model"));
const crypto_1 = __importDefault(require("crypto"));
const asyncHandler_1 = require("../utils/asyncHandler");
const razorpay_connection_1 = require("../db/razorpay.connection");
const SendMail_1 = require("../utils/SendMail");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
require("dotenv").config();
// Capture the payment and initiate the Razorpay order
exports.capturePayment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courses } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    // console.log("courses form backend",req.body)
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" });
    }
    let total_amount = 0;
    for (const course_id of courses) {
        let course;
        try {
            // Find the course by its ID
            course = yield course_model_1.default.findById(course_id);
            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" });
            }
            // Check if the user is already enrolled in the course
            console.log("course.studentesEntrolled", course);
            course.studentsEnrolled.some(studentId => console.log("studnetID", studentId.toString() === userId.toString()));
            const isEnrolled = course.studentsEnrolled.some(studentId => studentId.toString() === userId.toString());
            if (isEnrolled) {
                return res.status(200).json({ success: false, message: "Student is already Enrolled" });
            }
            // Add the price of the course to the total amount
            total_amount += course.price;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    try {
        // Initiate the payment using Razorpay
        const paymentResponse = yield razorpay_connection_1.instance.orders.create(options);
        // console.log("Payement Response",paymentResponse)
        res.json({
            success: true,
            data: paymentResponse,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Could not initiate order." });
    }
}));
// verify the payment
exports.verifyPayment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const razorpay_order_id = (_b = req.body) === null || _b === void 0 ? void 0 : _b.bodyData.razorpay_order_id;
    const razorpay_payment_id = (_c = req.body) === null || _c === void 0 ? void 0 : _c.bodyData.razorpay_payment_id;
    const razorpay_signature = (_d = req.body) === null || _d === void 0 ? void 0 : _d.bodyData.razorpay_signature;
    const courses = (_e = req.body) === null || _e === void 0 ? void 0 : _e.bodyData.courses;
    const userId = (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id;
    // console.log("verfify payment ",req.body)
    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed all field are required" });
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");
    // console.log("expectedSignature",expectedSignature,razorpay_signature)
    if (expectedSignature === razorpay_signature) {
        yield enrollStudents(courses, userId, res);
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }
    return res.status(200).json({ success: false, message: "Payment Failed beacuse of internal issue" });
}));
// Send Payment Success Email
exports.sendPaymentSuccessEmail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { orderId, paymentId, amount } = req.body;
    // console.log("orderid payment from sendPaymentScucessEmail ",req.body)
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id;
    // console.log("user form send payment ",amount,paymentId,orderId)
    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all the details in sendPaymentSuccessEmail" });
    }
    try {
        const enrolledStudent = yield user_model_1.default.findById(userId);
        // console.log("enrolledStudent user Object",enrolledStudent)
        yield (0, SendMail_1.sendMail)({
            type: "emailOptions4",
            email: enrolledStudent === null || enrolledStudent === void 0 ? void 0 : enrolledStudent.email,
            subject: `Payment Received`,
            data: (0, OrderConfirm_1.paymentSuccessEmail)(`${enrolledStudent === null || enrolledStudent === void 0 ? void 0 : enrolledStudent.FirstName} ${enrolledStudent === null || enrolledStudent === void 0 ? void 0 : enrolledStudent.LastName}`, amount / 100, orderId, paymentId),
        }).catch((e) => {
            throw new ApiError_1.default(400, "email is not connected");
        });
    }
    catch (error) {
        console.log("error in sending mail", error);
        return res
            .status(400)
            .json({ success: false, message: "Could not send email" });
    }
}));
// enroll the student in the courses
const enrollStudents = (courses, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("fromt the enrollStudneds",courses,userId)
    if (!courses || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please Provide Course ID and User ID" });
    }
    for (const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = yield course_model_1.default.findOneAndUpdate({ _id: courseId }, { $push: { studentsEnrolled: userId } }, { new: true });
            if (!enrolledCourse) {
                return res
                    .status(500)
                    .json({ success: false, error: "Course not found" });
            }
            // console.log("Updated course: ", enrolledCourse)
            const courseProgress = yield courseProgress_mode_1.default.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });
            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = yield user_model_1.default.findByIdAndUpdate(userId, {
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                },
            }, { new: true });
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
        }
        catch (error) {
            // console.log('from the enrollcoursese sturdne ',error)
            return res.status(400).json({ success: false, error: error.message });
        }
    }
});
//# sourceMappingURL=Payment.controller.js.map