"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const fileValidators_1 = require("../../validators/file/fileValidators");
const AuthMiddleware_1 = require("../../middleware/auth/AuthMiddleware");
const MulterMiddleware_1 = require("../../middleware/multer/MulterMiddleware");
const DITypes_1 = require("../../../shared/constants/DITypes");
const router = (0, express_1.Router)();
exports.fileRoutes = router;
const fileController = DIContainer_1.container.get(DITypes_1.TYPES.FileController);
// POST /api/file/upload - File Upload
router.post("/upload", AuthMiddleware_1.authMiddleware, MulterMiddleware_1.uploadSingle, MulterMiddleware_1.handleMulterError, fileValidators_1.uploadFileValidation, fileController.uploadFile.bind(fileController));
// GET /api/file/list - Get user files
router.get("/list", AuthMiddleware_1.authMiddleware, fileValidators_1.fileListValidation, fileController.getUserFiles.bind(fileController));
// DELETE /api/file/:fileId - Delete file
router.delete("/:publicId", AuthMiddleware_1.authMiddleware, fileController.deleteFile.bind(fileController));
// POST /api/file/profile-picture/:userId - Update Profile Picture
router.post("/profile-picture/:userId", AuthMiddleware_1.authMiddleware, MulterMiddleware_1.uploadSingle, MulterMiddleware_1.handleMulterError, fileController.updateProfilePicture.bind(fileController));
//# sourceMappingURL=fileRoutes.js.map