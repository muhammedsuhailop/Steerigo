import { UpdateProfilePictureDto } from "@application/dto/file/UpdateProfilePictureDto";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { inject, injectable } from "inversify";
import { UpdateProfilePictureResponseDto } from "@application/dto/file/UpdateProfilePictureResponseDto";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class UpdateProfilePictureUseCase
  implements
    IUseCase<
      UpdateProfilePictureDto,
      Promise<Result<UpdateProfilePictureResponseDto>>
    >
{
  constructor(
    @inject(TYPES.FileUploadService)
    private _fileUploadService: IFileUploadService,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async execute(
    dto: UpdateProfilePictureDto
  ): Promise<Result<UpdateProfilePictureResponseDto>> {
    try {
      Logger.info("Updating profile picture", { userId: dto.userId });

      const errors = dto.validate();
      if (errors.length) {
        return Result.failure(
          new Error(`Validation failed: ${errors.join(", ")}`)
        );
      }

      const user = await this._userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new Error("User not found"));
      }

      const { url, publicId } = await this._fileUploadService.upload(
        dto.file.buffer,
        dto.userId,
        dto.purpose.getValue(),
        dto.file.originalname
      );

      await this._userRepository.updateById(dto.userId, {
        profilePicture: url,
      });

      user.updateProfilePicture(url);

      Logger.info("Profile picture updated successfully", {
        userId: dto.userId,
        publicId,
        url,
      });

      const response = new UpdateProfilePictureResponseDto(
        url,
        publicId,
        dto.userId,
        new Date().toISOString()
      );

      return Result.success(response);
    } catch (err) {
      Logger.error("UpdateProfilePictureUseCase failed", {
        userId: dto.userId,
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
