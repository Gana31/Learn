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
exports.deleteSubSection = exports.updateSubSection = exports.createSubSection = exports.deleteSection = exports.updateSection = exports.Createsection = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const section_model_1 = __importDefault(require("../models/section.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = require("../utils/ApiResponse");
const subsection_model_1 = __importDefault(require("../models/subsection.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
exports.Createsection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the required properties from the request body
        const { sectionName, courseId } = req.body;
        // console.log(req.body);
        // Validate the input
        if (!sectionName || !courseId) {
            throw new ApiError_1.default(401, "all Fields are Required");
        }
        // Create a new section with the given name
        const newSection = yield section_model_1.default.create({ sectionName });
        // Add the new section to the course's content array
        const updatedCourse = yield course_model_1.default.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id,
            },
        }, { new: true })
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                model: subsection_model_1.default,
            },
        })
            .exec();
        // Return the updated course object in the response
        res.send(new ApiResponse_1.ApiResponse(201, "Subsection created successfully", updatedCourse));
    }
    catch (error) {
        // Handle errors
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while creating section of  the Course ");
    }
}));
exports.updateSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionName, sectionId, courseId } = req.body;
        const section = yield section_model_1.default.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        const course = yield course_model_1.default.findById(courseId)
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        res.send(new ApiResponse_1.ApiResponse(201, section, course));
    }
    catch (error) {
        console.error("Error updating section:", error);
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while updating section of  the Course ");
    }
}));
// DELETE a section
exports.deleteSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId, courseId } = req.body;
        // Remove section reference from course
        yield course_model_1.default.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        });
        // Find the section to delete
        const section = yield section_model_1.default.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        // Find and delete videos associated with each subsection
        const subSections = yield subsection_model_1.default.find({ _id: { $in: section.subSection } });
        for (const subSection of subSections) {
            if (subSection.public_id) {
                const destroyResult = yield cloudinary_1.default.v2.uploader.destroy(subSection.public_id, { resource_type: "video" });
                if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
                    console.error("Cloudinary deletion failed:", destroyResult);
                }
            }
        }
        // Delete the subsections from the database
        yield subsection_model_1.default.deleteMany({ _id: { $in: section.subSection } });
        // Delete the section from the database
        yield section_model_1.default.findByIdAndDelete(sectionId);
        // Find the updated course and return it
        const course = yield course_model_1.default.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();
        res.send(new ApiResponse_1.ApiResponse(201, "Section deleted", course));
    }
    catch (error) {
        console.error("Error deleting section:", error);
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while deleting section of the course");
    }
}));
exports.createSubSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract necessary information from the request body
        const { sectionId, title, description } = req.body;
        const video = req === null || req === void 0 ? void 0 : req.file;
        const filepath = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
        // console.log("video",req.file)
        //   // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res
                .status(404)
                .json({ success: false, message: "All Fields are Required" });
        }
        if (!req.file) {
            throw new ApiError_1.default(401, "video is not uploaded");
        }
        const uploadDetails = yield cloudinary_1.default.v2.uploader.upload(filepath, {
            folder: "sectionVideo",
            resource_type: "video",
        });
        //   console.log(uploadDetails)
        // Create a new sub-section with the necessary information
        const SubSectionDetails = yield subsection_model_1.default.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            public_id: uploadDetails.public_id,
            videoUrl: uploadDetails.secure_url,
        });
        // Update the corresponding section with the newly created sub-section
        const updatedSection = yield section_model_1.default.findByIdAndUpdate({ _id: sectionId }, { $push: { subSection: SubSectionDetails._id } }, { new: true }).populate("subSection");
        fs_1.default.unlinkSync(filepath);
        res.send(new ApiResponse_1.ApiResponse(200, "true", updatedSection));
    }
    catch (error) {
        console.error("Error creating new sub-section:", error);
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while creating sub section of  the Course ");
    }
}));
exports.updateSubSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = yield subsection_model_1.default.findById(subSectionId);
        //   console.log("subsection from update",subSection);
        // 	console.log("req.file from updateSubsection",req.file)
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }
        if (title !== undefined) {
            subSection.title = title;
        }
        if (description !== undefined) {
            subSection.description = description;
        }
        if (req.file && req.file.path !== undefined) {
            const destroyResult = yield cloudinary_1.default.v2.uploader.destroy(subSection.public_id, { resource_type: "video" });
            if (destroyResult.result === 'ok') {
                const video = req.file.path;
                const uploadDetails = yield cloudinary_1.default.v2.uploader.upload(video, {
                    folder: "sectionVideo",
                    resource_type: "video",
                });
                subSection.public_id = uploadDetails.public_id;
                subSection.videoUrl = uploadDetails.secure_url;
                subSection.timeDuration = `${uploadDetails.duration}`;
            }
        }
        yield subSection.save();
        // find updated section and return it
        const updatedSection = yield section_model_1.default.findById(sectionId).populate("subSection");
        //   console.log("updated section", updatedSection)
        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
}));
exports.deleteSubSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subSectionId, sectionId } = req.body;
        // Remove sub-section reference from section
        yield section_model_1.default.findByIdAndUpdate({ _id: sectionId }, {
            $pull: {
                subSection: subSectionId,
            },
        });
        // Find sub-section to delete
        const subSectionData = yield subsection_model_1.default.findById(subSectionId);
        if (!subSectionData) {
            return res.status(404).json({ success: false, message: "SubSection not found" });
        }
        // Attempt to delete the associated video from Cloudinary
        //   console.log("public_id",subSectionData.public_id)
        const destroyResult = yield cloudinary_1.default.v2.uploader.destroy(subSectionData.public_id, { resource_type: "video" });
        //   console.log("destryResult",destroyResult)
        if (destroyResult.result === 'ok' || destroyResult.result === 'not found') {
            // Delete the sub-section from the database
            yield subsection_model_1.default.findByIdAndDelete(subSectionId);
            // Find updated section and return it
            const updatedSection = yield section_model_1.default.findById(sectionId).populate('subSection');
            return res.json({
                success: true,
                message: "SubSection deleted successfully",
                data: updatedSection,
            });
        }
        else {
            // If Cloudinary deletion fails for other reasons, log the result and throw an error
            console.error("Cloudinary deletion failed:", destroyResult);
            throw new ApiError_1.default(401, "Video deletion from Cloudinary failed");
        }
    }
    catch (error) {
        console.error("Error deleting sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        });
    }
}));
//# sourceMappingURL=Section.controller.js.map