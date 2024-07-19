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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv").config();
const emailValidator = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const UserSchema = new mongoose_1.default.Schema({
    FirstName: {
        type: String,
        required: [true, "Please Enter Your FirstName"],
    },
    LastName: {
        type: String,
        required: [true, "Please Enter Your LastName"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: {
            validator: function (value) {
                return emailValidator.test(value);
            },
            message: "Please enter the Valid Email",
        },
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [6, "Password Needed Atleast 6 Character"],
        select: false,
        trim: true,
    },
    avatar: {
        public_id: String,
        avatar_url: String,
    },
    role: {
        type: String,
        enum: ['admin', 'Student', 'Instructor'],
        default: "Student",
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    gender: {
        type: String,
        default: null,
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    about: {
        type: String,
        trim: true,
        default: null,
    },
    contactNumber: {
        type: Number,
        trim: true,
        default: null,
    },
    courseProgress: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "courseProgress",
        },
    ],
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
UserSchema.methods.isPasswordIsCorrect = function (enterPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enterPassword, this.password);
    });
};
UserSchema.methods.signAcessToken = function () {
    return (0, jsonwebtoken_1.sign)({ _id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "1d",
    });
};
UserSchema.methods.signrefreshToken = function () {
    return (0, jsonwebtoken_1.sign)({ _id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: "5d",
    });
};
UserSchema.methods.generateAccessToken = function () {
    return (0, jsonwebtoken_1.sign)({
        _id: this._id,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};
const userModel = mongoose_1.default.model("User", UserSchema);
exports.default = userModel;
//# sourceMappingURL=user.model.js.map