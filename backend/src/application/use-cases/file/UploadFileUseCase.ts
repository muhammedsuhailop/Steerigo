import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { FileUploadService } from "@application/services/FileUploadService";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { inject, injectable } from "inversify";
import { FileUploadResponseDto } from "@application/dto/file/FileUploadResponseDto";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class UploadFileUseCase
  implements
    IUseCase<FileUploadDto, Promise<Result<FileUploadResponseDto, Error>>>
{
  constructor(
    @inject(TYPES.FileUploadService)
    private _fileUploadService: FileUploadService,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}

  async execute(
    dto: FileUploadDto
  ): Promise<Result<FileUploadResponseDto, Error>> {
    try {
      Logger.info("Uploading file", {
        userId: dto.userId,
        purpose: dto.purpose.toString(),
      });

      const user = await this._userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new Error("User not found"));
      }

      const errors = dto.validate();
      if (errors.length) {
        return Result.failure(
          new Error(`Validation failed: ${errors.join(", ")}`)
        );
      }

      const { url, publicId, filename, size } =
        await this._fileUploadService.upload(
          dto.file.buffer,
          dto.userId,
          dto.purpose.toString(),
          dto.file.originalname
        );

      Logger.info("File uploaded", { publicId, url });

      const response = new FileUploadResponseDto(
        url,
        publicId,
        filename,
        size,
        dto.file.mimetype,
        new Date().toISOString()
      );

      return Result.success(response);
    } catch (err) {
      Logger.error("UploadFileUseCase failed", {
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
