"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courseProgress = new mongoose_1.default.Schema({
    courseID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    completedVideos: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "SubSection",
        },
    ],
});
const courseProgressModel = mongoose_1.default.model("courseProgress", courseProgress);
exports.default = courseProgressModel;
//# sourceMappingURL=courseProgress.mode.js.map