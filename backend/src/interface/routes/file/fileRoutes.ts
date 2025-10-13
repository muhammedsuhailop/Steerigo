import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { FileController } from "@interface/controllers/file/FileController";
import {
  uploadFileValidation,
  fileListValidation,
} from "@interface/validators/file/fileValidators";
import { authMiddleware } from "@interface/middleware/auth/AuthMiddleware";
import {
  uploadSingle,
  handleMulterError,
} from "@interface/middleware/multer/MulterMiddleware";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();
const fileController = container.get<FileController>(TYPES.FileController);

// POST /api/file/upload - File Upload
router.post(
  "/upload",
  authMiddleware,
  uploadSingle,
  handleMulterError,
  uploadFileValidation,
  fileController.uploadFile.bind(fileController)
);

// GET /api/file/list - Get user files
router.get(
  "/list",
  authMiddleware,
  fileListValidation,
  fileController.getUserFiles.bind(fileController)
);

// DELETE /api/file/:fileId - Delete file
router.delete(
  "/:publicId",
  authMiddleware,
  fileController.deleteFile.bind(fileController)
);

export { router as fileRoutes };
