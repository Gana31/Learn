"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: { type: String },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});
const categoryModel = mongoose_1.default.model("Category", categorySchema);
exports.default = categoryModel;
//# sourceMappingURL=category.model.js.map