import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
import { GetUserFilesUseCase } from "@application/use-cases/file/GetUserFilesUseCase";
import { DeleteFileUseCase } from "@application/use-cases/file/DeleteFileUseCase";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { ApiResponse } from "@shared/types/Common";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { FILE_MESSAGES } from "@shared/constants/FileConstants";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class FileController {
  constructor(
    @inject(TYPES.UploadFileUseCase) private uploadUc: UploadFileUseCase,
    @inject(TYPES.GetUserFilesUseCase) private listUc: GetUserFilesUseCase,
    @inject(TYPES.DeleteFileUseCase) private deleteUc: DeleteFileUseCase
  ) {}

  private getUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.userId ?? null;
  }

  async uploadFile(req: MulterRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: FILE_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      if (!req.file) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: FILE_MESSAGES.FILE_REQUIRED,
        });
        return;
      }

      if (!req.body.purpose) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: FILE_MESSAGES.PURPOSE_REQUIRED,
        });
        return;
      }

      const dto = new FileUploadDto({
        purpose: req.body.purpose,
        file: req.file,
      });

      const result = await this.uploadUc.execute(dto, userId);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: FILE_MESSAGES.FILE_UPLOADED,
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Upload file controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: FILE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: FILE_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const result = await this.listUc.execute(userId);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: FILE_MESSAGES.FILES_RETRIEVED,
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Get user files controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: FILE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: FILE_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const publicId = decodeURIComponent(req.params.publicId);
      if (!publicId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: FILE_MESSAGES.PUBLIC_ID_REQUIRED,
        });
        return;
      }

      const result = await this.deleteUc.execute(publicId);

      if (result.isSuccessful()) {
        const data = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: data.message,
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Delete file controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: FILE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
