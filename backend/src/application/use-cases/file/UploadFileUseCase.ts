
import { injectable, inject } from "inversify";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { FileUploadService } from "@application/services/FileUploadService";
import { UserRepository } from "@application/repositories/UserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

export interface FileUploadResponse {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

@injectable()
export class UploadFileUseCase {
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: FileUploadService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(
    dto: FileUploadDto,
    userId: string
  ): Promise<Result<FileUploadResponse, Error>> {
    try {
      Logger.info("Uploading file", {
        userId,
        purpose: dto.purpose.toString(),
      });

      const user = await this.userRepository.findById(userId);
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
        await this.fileUploadService.upload(
          dto.file.buffer,
          userId,
          dto.purpose.toString(),
          dto.file.originalname
        );

      Logger.info("File uploaded", { publicId, url });

      return Result.success({
        url,
        publicId,
        filename,
        size,
        mimeType: dto.file.mimetype,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      Logger.error("UploadFileUseCase failed", {
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
