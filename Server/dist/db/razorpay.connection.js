"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const Razorpay = require("razorpay");
require("dotenv").config();
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
//# sourceMappingURL=razorpay.connection.js.map