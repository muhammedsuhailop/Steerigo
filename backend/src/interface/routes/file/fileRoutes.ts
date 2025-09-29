import { Router } from "express";
import { container } from "@infrastructure/container/Container";
import { FileController } from "../../controllers/file/FileController";
import { uploadFileValidation } from "../../validators/file/fileValidators";
import { authMiddleware } from "../../middleware/auth/AuthMiddleware";
import {
  uploadSingle,
  handleMulterError,
} from "../../middleware/multer/MulterMiddleware";

const router = Router();
const fileController = container.get(FileController);

// POST /api/file/upload - File Upload
router.post(
  "/upload",
  authMiddleware,
  uploadSingle,
  handleMulterError,
  uploadFileValidation,
  fileController.upload.bind(fileController)
);

export { router as fileRoutes };
