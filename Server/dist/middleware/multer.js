"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/others';
        if (file.fieldname === 'avatar') {
            folder = 'uploads/profile';
        }
        else if (file.fieldname === 'thumbnailImage') {
            folder = 'uploads/thumbnail';
        }
        else if (file.fieldname === 'video') {
            folder = 'uploads/video';
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});
// File filter function to allow images and videos
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Only images and videos are allowed.')); // Reject the file
    }
};
// Initialize multer instance with configuration
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 50 // 50MB file size limit (adjust as needed)
    }
});
//# sourceMappingURL=multer.js.map