import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
import { GetUserFilesUseCase } from "@application/use-cases/file/GetUserFilesUseCase";
import { DeleteFileUseCase } from "@application/use-cases/file/DeleteFileUseCase";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { v2 as cloudinary } from "cloudinary";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class FileController {
  constructor(
    @inject(TYPES.UploadFileUseCase) private uploadUc: UploadFileUseCase,
    @inject(TYPES.GetUserFilesUseCase) private listUc: GetUserFilesUseCase,
    @inject(TYPES.DeleteFileUseCase) private deleteUc: DeleteFileUseCase
  ) {}

  async uploadFile(req: MulterRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId || !req.file) {
        res
          .status(400)
          .json({ success: false, message: "Missing user or file" });
        return;
      }
      const dto = new FileUploadDto({
        purpose: req.body.purpose,
        file: req.file,
      });
      const result = await this.uploadUc.execute(dto, userId);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "file_upload"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.json({ success: true, data: result.getValue() });
    } catch (err) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        err as Error,
        "file_upload"
      );
      res.status(statusCode).json(response);
    }
  }

  async getUserFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await this.listUc.execute(userId);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "list_files"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.json({ success: true, data: result.getValue() });
    } catch (err) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        err as Error,
        "list_files"
      );
      res.status(statusCode).json(response);
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const publicId = req.params.publicId;
      const result = await this.deleteUc.execute(publicId);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "delete_file"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.json({ success: true, message: result.getValue().message });
    } catch (err) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        err as Error,
        "delete_file"
      );
      res.status(statusCode).json(response);
    }
  }
}
