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
import { UpdateProfilePictureDto } from "@application/dto/file/UpdateProfilePictureDto";
import { UpdateProfilePictureUseCase } from "@application/use-cases/file/UpdateProfilePictureUseCase";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class FileController {
  constructor(
    @inject(TYPES.UploadFileUseCase) private uploadUc: UploadFileUseCase,
    @inject(TYPES.GetUserFilesUseCase) private listUc: GetUserFilesUseCase,
    @inject(TYPES.DeleteFileUseCase) private deleteUc: DeleteFileUseCase,
    @inject(TYPES.UpdateProfilePictureUseCase)
    private updateProfileUc: UpdateProfilePictureUseCase
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

  async updateProfilePicture(req: MulterRequest, res: Response): Promise<void> {
    try {
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: FILE_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const { userId } = req.params;

      const currentUser = (req as any).user;
      if (userId !== currentUserId && currentUser?.role !== "Admin") {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: FILE_MESSAGES.PROFILE_PICTURE_UPDATE_FORBIDDEN,
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

      const dto = new UpdateProfilePictureDto({
        userId,
        file: req.file,
      });

      const result = await this.updateProfileUc.execute(dto);

      if (result.isSuccessful()) {
        const data = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: FILE_MESSAGES.PROFILE_PICTURE_UPDATE_SUCCESS,
          data: {
            profilePictureUrl: data.profilePictureUrl,
            publicId: data.publicId,
            userId: data.userId,
            updatedAt: data.updatedAt,
          },
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Update profile picture controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: FILE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
