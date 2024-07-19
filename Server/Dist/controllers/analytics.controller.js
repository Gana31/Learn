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
exports.updateCourseProgress = exports.createRating = exports.categoryPageDetailsteCourse = exports.showAllCategories = exports.createCategory = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const category_model_1 = __importDefault(require("../models/category.model"));
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const course_model_1 = __importDefault(require("../models/course.model"));
const ratingAndReviews_1 = __importDefault(require("../models/ratingAndReviews"));
const subsection_model_1 = __importDefault(require("../models/subsection.model"));
const courseProgress_mode_1 = __importDefault(require("../models/courseProgress.mode"));
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
exports.createCategory = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            throw new ApiError_1.default(400, "All fields are required");
        }
        const CategorysDetails = yield category_model_1.default.create({
            name: name,
            description: description,
        });
        res.send(new ApiResponse_1.ApiResponse(200, "category created successfully"));
    }
    catch (error) {
        next(error);
    }
}));
const showAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("INSIDE SHOW ALL CATEGORIES");
        const allCategorys = yield category_model_1.default.find({});
        res.send(new ApiResponse_1.ApiResponse(200, "category fetch successfully", allCategorys));
        if (!allCategorys) {
            throw new ApiError_1.default(400, "Error whiel getting the category");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.showAllCategories = showAllCategories;
exports.categoryPageDetailsteCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);
        // Get courses for the specified category
        const selectedCategory = yield category_model_1.default.findById(categoryId)
            .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
        })
            .exec();
        //console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.");
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }
        // Get courses for other categories
        const categoriesExceptSelected = yield category_model_1.default.find({
            _id: { $ne: categoryId },
        });
        let differentCategory = yield category_model_1.default.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id)
            .populate({
            path: "courses",
            match: { status: "Published" },
        })
            .exec();
        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = yield category_model_1.default.find()
            .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
        })
            .exec();
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);
        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}));
exports.createRating = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //get user id
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
        //fetchdata from req body
        const { rating, review, courseId } = req.body;
        //check if user is enrolled or not
        const courseDetails = yield course_model_1.default.findOne({ _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = yield ratingAndReviews_1.default.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }
        //create rating and review
        const ratingReview = yield ratingAndReviews_1.default.create({
            rating, review,
            course: courseId,
            user: userId,
        });
        //update course with this rating/review
        const updatedCourseDetails = yield course_model_1.default.findByIdAndUpdate({ _id: courseId }, {
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        }, { new: true });
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.updateCourseProgress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { courseId, subsectionId } = req.body;
    const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
    try {
        // Check if the subsection is valid
        const subsection = yield subsection_model_1.default.findById(subsectionId);
        if (!subsection) {
            return res.status(404).json({ error: "Invalid subsection" });
        }
        // Find the course progress document for the user and course
        let courseProgress = yield courseProgress_mode_1.default.findOne({
            courseID: courseId,
            userId: userId,
        });
        if (!courseProgress) {
            // If course progress doesn't exist, create a new one
            return res.status(404).json({
                success: false,
                message: "Course progress Does Not Exist",
            });
        }
        else {
            // If course progress exists, check if the subsection is already completed
            if (courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(400).json({ error: "Subsection already completed" });
            }
            // Push the subsection into the completedVideos array
            courseProgress.completedVideos.push(subsectionId);
        }
        // Save the updated course progress
        yield courseProgress.save();
        return res.status(200).json({ message: "Course progress updated" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
//# sourceMappingURL=analytics.controller.js.map