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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = __importDefault(require("./ApiError"));
require("dotenv").config();
;
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '500'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });
    const { email, subject, data } = options;
    let mailOption;
    if (options.type === 'emailOptions') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            text: `HELLO ${data.user.name} Welcome to the Lean Website and To Activate Your Account Please Enter Your Otp is ${data.ActivationCode}`
        };
    }
    else if (options.type === 'emailOptions2') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html: `
                <p>Hello ${data.name},</p>
                <p>We are delighted to inform you that you've received a reply from our Learning Management System (LMS)!
                Project Video Is ${data.title}</p>
                <p>Please log in to your account to view and respond to the message.</p>
                <p>Thank you for being a part of our learning community.</p>
                <p>Best regards,</p>
                <p>The Learn Website Team</p>
            `
        };
    }
    else if (options.type === 'emailOptions3') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html: `
            <p>Hello User</p>
            <p>We are thrilled to confirm your order on our Learning Management System (LMS)!</p>
            <p>Below are the details of your course:</p>
            <ul>
                <li><strong>Course Name:</strong> ${data.name}</li>
                <li><strong>Course ID:</strong> ${data._id}</li>
                <li><strong>Price:</strong> ${data.price}</li>
                <li><strong>Date:</strong> ${data.date}</li>
            </ul>
            <p>You can now access your course materials by logging in to your account.</p>
            <p>Thank you for choosing us as your learning platform!</p>
            <p>Best regards,</p>
            <p>The Learn Website Team</p>
        `
        };
    }
    else if (options.type === 'emailOptions4') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html: `${data}`,
        };
    }
    else {
        throw new ApiError_1.default(400, 'Invalid email options');
    }
    yield transport.sendMail(mailOption).catch(() => {
        throw new ApiError_1.default(400, "Email is not connected to the SMTP SERVER");
    });
});
exports.sendMail = sendMail;
//# sourceMappingURL=SendMail.js.map