import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { FILE_MESSAGES } from "@shared/constants/FileConstants";
import { UpdateProfilePictureDto } from "@application/dto/file/UpdateProfilePictureDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { FileUploadResponseDto } from "@application/dto/file/FileUploadResponseDto";
import { GetUserFilesResponseDto } from "@application/dto/file/GetUserFilesResponseDto";
import { UpdateProfilePictureResponseDto } from "@application/dto/file/UpdateProfilePictureResponseDto";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class FileController {
  constructor(
    @inject(TYPES.UploadFileUseCase)
    private _uploadUc: IUseCase<
      FileUploadDto,
      Promise<Result<FileUploadResponseDto, Error>>
    >,
    @inject(TYPES.GetUserFilesUseCase)
    private _listUc: IUseCase<
      string,
      Promise<Result<GetUserFilesResponseDto, Error>>
    >,
    @inject(TYPES.DeleteFileUseCase)
    private _deleteUc: IUseCase<
      string,
      Promise<Result<{ message: string }, Error>>
    >,
    @inject(TYPES.UpdateProfilePictureUseCase)
    private _updateProfileUc: IUseCase<
      UpdateProfilePictureDto,
      Promise<Result<UpdateProfilePictureResponseDto>>
    >
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
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
        userId,
        purpose: req.body.purpose,
        file: req.file,
      });

      const result = await this._uploadUc.execute(dto);

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

      const result = await this._listUc.execute(userId);

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

      const result = await this._deleteUc.execute(publicId);

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

      const currentUser = req.user;
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

      const result = await this._updateProfileUc.execute(dto);

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
