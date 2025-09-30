import { injectable, inject } from "inversify";
import { FileUploadDto } from "../../dto/file/FileUploadDto";
import { IFileUploadService } from "@domain/services/IFileUploadService";
import { Result } from "@shared/utils/Result";
import { IUserRepository } from "@domain/repositories/IUserRepository";

@injectable()
export class UploadFileUseCase {
  constructor(
    @inject("IFileUploadService") private fileUploadService: IFileUploadService,
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    dto: FileUploadDto,
    userId: string
  ): Promise<
    Result<
      {
        url: string;
        publicId: string;
        purpose: string;
        filename: string;
        size: number;
      },
      Error
    >
  > {
    try {
      // Validate user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.failure(new Error("User not found"));
      }

      // Validate DTO
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new Error(`Validation failed: ${validationErrors.join(", ")}`)
        );
      }

      // Upload file to Cloudinary
      const uploadResult = await this.fileUploadService.upload(
        dto.file.buffer,
        userId,
        dto.purpose
      );

      return Result.success({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        purpose: dto.purpose,
        filename: dto.file.originalname,
        size: dto.file.size,
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
