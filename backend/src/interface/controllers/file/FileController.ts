import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { validationResult } from "express-validator";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class FileController {
  constructor(
    @inject(UploadFileUseCase)
    private uploadFileUseCase: UploadFileUseCase
  ) {}

  async upload(req: MulterRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Missing user ID",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "File is required",
        });
        return;
      }

      console.log("File upload request:", {
        userId,
        purpose: req.body.purpose,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      const dto = new FileUploadDto({
        purpose: req.body.purpose,
        file: req.file,
      });

      const result = await this.uploadFileUseCase.execute(dto, userId);

      if (result.isFailure()) {
        res.status(400).json({
          success: false,
          message: result.getError().message,
        });
      } else {
        const uploadData = result.getValue();
        res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          data: {
            url: uploadData.url,
            publicId: uploadData.publicId,
            purpose: uploadData.purpose,
            filename: uploadData.filename,
            size: uploadData.size,
            uploadedAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("File upload controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
