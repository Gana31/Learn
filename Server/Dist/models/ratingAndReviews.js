"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratingAndReviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    },
});
// Export the RatingAndReview model
const ratingAndReviewModel = mongoose_1.default.model("RatingAndReview", ratingAndReviewSchema);
exports.default = ratingAndReviewModel;
//# sourceMappingURL=ratingAndReviews.js.map