"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseDescription: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        public_id: {
            // required : true,
            type: String,
        },
        url: {
            // required : true,
            type: String,
        }
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // required: true,
        ref: "Category",
    },
    tag: [{
            required: true,
            type: String,
        }],
    studentsEnrolled: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    ],
    instructions: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft",
    },
    ratingAndReviews: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }],
}, { timestamps: true });
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
//# sourceMappingURL=course.model.js.map