"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubSectionSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    timeDuration: { type: String, required: true },
    description: { type: String, required: true },
    public_id: { type: String, required: true },
    videoUrl: { type: String, required: true },
}, { timestamps: true });
const SubSectionModel = mongoose_1.default.model("SubSection", SubSectionSchema);
exports.default = SubSectionModel;
//# sourceMappingURL=subsection.model.js.map