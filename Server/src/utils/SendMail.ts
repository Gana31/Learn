import nodemailer, { Transporter } from "nodemailer"
import { emailData } from "../controllers/user.controller";
import ApiError from "./ApiError";
require("dotenv").config();
interface EmailOptions {
    type: 'emailOptions';
    email: string;
    subject: string;
    data: emailData
}
interface EmailOptions2 {
    type: 'emailOptions2';
    email: string;
    subject: string;
    data: {
        name: string,
        title: string,
    };
}

interface EmailOptions3 {
    type: 'emailOptions3';
    email: string;
    subject: string;
    data: {
            _id: any;
        name: string;
        price: number;
        date: string;
        }
};

interface EmailOptions4 {
    type: 'emailOptions4';
    email: string;
    subject: string;
    data:any;
}

export const sendMail = async (options: EmailOptions | EmailOptions2 | EmailOptions3 | EmailOptions4): Promise<void> => {
    const transport: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '500'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });
    const { email, subject, data } = options;
    let mailOption: nodemailer.SendMailOptions;
    if (options.type === 'emailOptions') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            text: `HELLO ${data.user.name} Welcome to the Lean Website and To Activate Your Account Please Enter Your Otp is ${data.ActivationCode}`
        };
    } else if (options.type === 'emailOptions2') {
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
    } else if (options.type === 'emailOptions3') {
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
    } else if (options.type === 'emailOptions4') {
        const { email, subject, data } = options;
        mailOption = {
            from: `Learn Website <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html: `${data}`,
        };
    }
     else {
        throw new ApiError(400, 'Invalid email options');
    }

    await transport.sendMail(mailOption).catch(() => {
        throw new ApiError(400, "Email is not connected to the SMTP SERVER");
    });
};