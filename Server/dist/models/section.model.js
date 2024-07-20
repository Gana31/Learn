"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sectionSchema = new mongoose_1.default.Schema({
    sectionName: {
        type: String,
    },
    subSection: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "SubSection",
        },
    ],
});
const sectionModel = mongoose_1.default.model("Section", sectionSchema);
exports.default = sectionModel;
//# sourceMappingURL=section.model.js.map