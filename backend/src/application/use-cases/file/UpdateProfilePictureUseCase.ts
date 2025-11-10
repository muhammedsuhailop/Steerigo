import { UpdateProfilePictureDto } from "@application/dto/file/UpdateProfilePictureDto";
import { FileUploadService } from "@application/services/FileUploadService";
import { UserRepository } from "@application/repositories/UserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { inject, injectable } from "inversify";

export interface UpdateProfilePictureResponse {
  profilePictureUrl: string;
  publicId: string;
  userId: string;
  updatedAt: string;
}

@injectable()
export class UpdateProfilePictureUseCase {
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: FileUploadService,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async execute(
    dto: UpdateProfilePictureDto
  ): Promise<Result<UpdateProfilePictureResponse>> {
    try {
      Logger.info("Updating profile picture", { userId: dto.userId });

      const errors = dto.validate();
      if (errors.length) {
        return Result.failure(
          new Error(`Validation failed: ${errors.join(", ")}`)
        );
      }

      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new Error("User not found"));
      }

      const { url, publicId } = await this.fileUploadService.upload(
        dto.file.buffer,
        dto.userId,
        dto.purpose.getValue(),
        dto.file.originalname
      );

      await this.userRepository.updateById(dto.userId, {
        profilePicture: url,
      });

      user.updateProfilePicture(url);

      Logger.info("Profile picture updated successfully", {
        userId: dto.userId,
        publicId,
        url,
      });

      return Result.success({
        profilePictureUrl: url,
        publicId,
        userId: dto.userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      Logger.error("UpdateProfilePictureUseCase failed", {
        userId: dto.userId,
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
