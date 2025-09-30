import multer from "multer";
import { Request } from "express";

// Memory storage for cloud uploads
const storage = multer.memoryStorage();

// File filter with validation
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file types
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and DOC files are allowed."
      )
    );
  }

  // Additional extension check for security
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/i;
  if (!allowedExtensions.test(file.originalname)) {
    return cb(new Error("Invalid file extension."));
  }

  cb(null, true);
};

// Multer configuration
export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 1,
  },
  fileFilter,
}).single("file");

// Error handling middleware for multer errors
export const handleMulterError = (
  error: any,
  req: Request,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size allowed is 10MB",
      });
    } else if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Only one file allowed",
      });
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field",
      });
    }
  }

  if (error.message.includes("Invalid file")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};
