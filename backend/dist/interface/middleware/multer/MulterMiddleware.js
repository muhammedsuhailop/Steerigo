"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
// Memory storage for cloud uploads
const storage = multer_1.default.memoryStorage();
// File filter with validation
const fileFilter = (req, file, cb) => {
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
        return cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and DOC files are allowed."));
    }
    // Additional extension check for security
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/i;
    if (!allowedExtensions.test(file.originalname)) {
        return cb(new Error("Invalid file extension."));
    }
    cb(null, true);
};
// Multer configuration
exports.uploadSingle = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1,
    },
    fileFilter,
}).single("file");
// Error handling middleware for multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size too large. Maximum size allowed is 10MB",
            });
        }
        else if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Too many files. Only one file allowed",
            });
        }
        else if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message: "Unexpected file field",
            });
        }
    }
    if (error instanceof Error && error.message.includes("Invalid file")) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
    next(error);
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=MulterMiddleware.js.map