import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    let folder = 'uploads/others';
    if (file.fieldname === 'avatar') {
      folder = 'uploads/profile';
    } else if (file.fieldname === 'thumbnailImage') {
      folder = 'uploads/thumbnail';
    } else if (file.fieldname === 'video') {
      folder = 'uploads/video';
    }
    cb(null, folder);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

// File filter function to allow images and videos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images and videos are allowed.')); // Reject the file
  }
};

// Initialize multer instance with configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB file size limit (adjust as needed)
  }
});
