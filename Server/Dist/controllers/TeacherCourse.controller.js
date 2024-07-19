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
exports.getAllRating = exports.getEnrolledCourses = exports.getCourseDetails = exports.deleteCourse = exports.getFullCourseDetails = exports.getInstructorCourses = exports.getAllCourses = exports.editCourse = exports.uploadTeacherCourse = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = __importDefault(require("../models/user.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const course_model_1 = __importDefault(require("../models/course.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
const ApiResponse_1 = require("../utils/ApiResponse");
const mongoose_1 = __importDefault(require("mongoose"));
const ratingAndReviews_1 = __importDefault(require("../models/ratingAndReviews"));
const courseProgress_mode_1 = __importDefault(require("../models/courseProgress.mode"));
const TotalTimeCalculate_1 = require("../utils/TotalTimeCalculate");
const section_model_1 = __importDefault(require("../models/section.model"));
const subsection_model_1 = __importDefault(require("../models/subsection.model"));
const { ObjectId } = mongoose_1.default.Types;
exports.uploadTeacherCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // console.log(req.body)
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
        let { courseName, courseDescription, price, tag: _tag, whatYouWillLearn, category, status, instructions: _Instructions, } = req.body;
        const filePath = (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path;
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_Instructions);
        const thumbnailImage = req.file;
        if (!courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnailImage ||
            !category ||
            !instructions.length) {
            throw new ApiError_1.default(401, "all fields Are required");
        }
        if (!status || status === undefined) {
            status = "Draft";
        }
        const instructorDetails = yield user_model_1.default.findById(userId, {
            role: "Instructor",
        });
        if (!instructorDetails) {
            throw new ApiError_1.default(401, "Instructor Details are not found");
        }
        // Check if the tag given is valid
        const categoryDetails = yield category_model_1.default.findById(category);
        if (!categoryDetails) {
            throw new ApiError_1.default(401, "category detail not found");
        }
        // Upload the Thumbnail to Cloudinary
        if (!filePath) {
            throw new ApiError_1.default(401, "image for course needed");
        }
        const myCloud = yield cloudinary_1.default.v2.uploader.upload(filePath, {
            folder: "thumbnail",
            width: 150,
        });
        const newCourse = yield course_model_1.default.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            status: status,
            instructions,
        });
        // Add the new course to the User Schema of the Instructor
        yield user_model_1.default.findByIdAndUpdate({
            _id: instructorDetails._id,
        }, {
            $push: {
                courses: newCourse._id,
            },
        }, { new: true });
        // Add the new course to the Categories
        const categoryDetails2 = yield category_model_1.default.findByIdAndUpdate({ _id: category }, {
            $push: {
                courses: newCourse._id,
            },
        }, { new: true });
        //   console.log("HEREEEEEEEE", categoryDetails2)
        // Return the new course and a success message
        res.send(new ApiResponse_1.ApiResponse(201, "Course Created Successfully", newCourse));
        fs_1.default.unlinkSync(filePath);
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while Uploading the Course ");
    }
}));
exports.editCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, OldImg, price } = req.body;
        const updates = req.body;
        console.log(req.body);
        const course = yield course_model_1.default.findById(courseId);
        // console.log(req.file)
        if (!course) {
            throw new ApiError_1.default(401, "No course Found");
        }
        console.log(OldImg);
        // If Thumbnail Image is found, update it
        if (req.file) {
            const destry = yield cloudinary_1.default.v2.uploader.destroy(OldImg);
            console.log(destry);
            if (destry.result == 'ok') {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(req.file.path, {
                    folder: "thumbnail",
                    width: 150,
                });
                course.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            fs_1.default.unlinkSync(req.file.path);
        }
        if (price) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice)) {
                throw new ApiError_1.default(400, "Invalid price value");
            }
            updates.price = parsedPrice;
        }
        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                const courseKey = key;
                if (courseKey === "tag" || courseKey === "instructions") {
                    course[courseKey] = JSON.parse(updates[courseKey]);
                }
                else {
                    course[courseKey] = updates[courseKey];
                }
            }
        }
        yield course.save();
        const updatedCourse = yield course_model_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            model: user_model_1.default,
        })
            .populate("category")
            .populate({
            path: "ratingAndReviews", // Ensure this matches the field in your CourseModel schema
            model: ratingAndReviews_1.default,
        })
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        res.send(new ApiResponse_1.ApiResponse(201, "Course Updated Successfull", updatedCourse));
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while Editing the Course ");
    }
}));
exports.getAllCourses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCourses = yield course_model_1.default.find({ status: "Published" }, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        })
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        });
    }
}));
exports.getInstructorCourses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        // console.log(req?.user?._id);
        // Get the instructor ID from the authenticated user or request body
        const instructorId = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id;
        // Find all courses belonging to the instructor
        const instructorCourses = yield course_model_1.default.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 });
        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
}));
exports.getFullCourseDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { courseId } = req.body;
        // console.log("req body",req.body)
        // console.log(courseId)
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const courseDetails = yield course_model_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        let courseProgressCount = yield courseProgress_mode_1.default.findOne({
            courseID: courseId,
            userId: userId,
        });
        // console.log("courseProgressCount : ", courseProgressCount)
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                // console.log("content.subSection",subSection.timeDuration)
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });
        const totalDuration = yield (0, TotalTimeCalculate_1.convertSecondsToDuration)(totalDurationInSeconds);
        // console.log(totalDuration);
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: (courseProgressCount === null || courseProgressCount === void 0 ? void 0 : courseProgressCount.completedVideos)
                    ? courseProgressCount === null || courseProgressCount === void 0 ? void 0 : courseProgressCount.completedVideos
                    : [],
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.deleteCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.body;
        // Find the course
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const thumbnail = course.thumbnail;
        // console.log(thumbnail.public_id)
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            yield user_model_1.default.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }
        if (thumbnail) {
            yield cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
        }
        // Delete sections and sub-sections
        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            const section = yield section_model_1.default.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    const subSection = yield subsection_model_1.default.findById(subSectionId);
                    if (subSection && subSection.public_id) {
                        yield cloudinary_1.default.v2.uploader.destroy(subSection.public_id, {
                            resource_type: "video",
                        });
                    }
                    yield subsection_model_1.default.findByIdAndDelete(subSectionId);
                }
            }
            yield section_model_1.default.findByIdAndDelete(sectionId);
        }
        const instructorId = course.instructor;
        yield user_model_1.default.findByIdAndUpdate(instructorId, {
            $pull: { courses: courseId },
        });
        // Delete the course
        yield course_model_1.default.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}));
exports.getCourseDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.body;
        const courseDetails = yield course_model_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                select: "-videoUrl",
            },
        })
            .exec();
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });
        const totalDuration = (0, TotalTimeCalculate_1.convertSecondsToDuration)(totalDurationInSeconds);
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.getEnrolledCourses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const userDetails = yield user_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(String(userId)), // Convert userId to ObjectId here
                },
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courses',
                    foreignField: '_id',
                    as: 'courses',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'sections',
                                localField: 'courseContent',
                                foreignField: '_id',
                                as: 'courseContent',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'subsections',
                                            localField: 'subSection',
                                            foreignField: '_id',
                                            as: 'subSection'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);
        // console.log("usedetails",userDetails)
        if (!userDetails || userDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: `Could not find user details`,
            });
        }
        const user = userDetails[0];
        // console.log('Raw userDetails:', user);
        for (let i = 0; i < user.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let SubsectionLength = 0;
            const courseContent = user.courses[i].courseContent || [];
            for (let j = 0; j < courseContent.length; j++) {
                const subSections = courseContent[j].subSection || [];
                totalDurationInSeconds += subSections.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
                SubsectionLength += subSections.length;
            }
            user.courses[i].totalDuration = (0, TotalTimeCalculate_1.convertSecondsToDuration)(totalDurationInSeconds);
            const courseProgress = yield courseProgress_mode_1.default.findOne({
                courseID: user.courses[i]._id,
                userId: userId,
            });
            // console.log('courseProgress:', courseProgress);
            const completedVideosCount = (courseProgress === null || courseProgress === void 0 ? void 0 : courseProgress.completedVideos.length) || 0;
            if (SubsectionLength === 0) {
                user.courses[i].progressPercentage = 100;
            }
            else {
                const multiplier = Math.pow(10, 2);
                user.courses[i].progressPercentage =
                    Math.round((completedVideosCount / SubsectionLength) * 100 * multiplier) / multiplier;
            }
        }
        // console.log('Processed userDetails:', user);
        return res.status(200).json({
            success: true,
            data: user.courses,
        });
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.getAllRating = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReviews = yield ratingAndReviews_1.default.find({})
            .sort({ rating: "desc" })
            .populate({
            path: "user",
            select: "FirstName LastName email avatar",
        })
            .populate({
            path: "course",
            select: "courseName",
        })
            .exec();
        // console.log(allReviews);
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
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
//# sourceMappingURL=TeacherCourse.controller.js.map