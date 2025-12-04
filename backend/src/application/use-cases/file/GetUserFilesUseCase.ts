import { injectable, inject } from "inversify";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { GetUserFilesResponseDto } from "@application/dto/file/GetUserFilesResponseDto";
import { CloudinaryResourceDto } from "@application/dto/file/CloudinaryResourceDto";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetUserFilesUseCase
  implements IUseCase<string, Promise<Result<GetUserFilesResponseDto, Error>>>
{
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: IFileUploadService
  ) {}

  async execute(
    userId: string
  ): Promise<Result<GetUserFilesResponseDto, Error>> {
    try {
      Logger.info("Listing user files", { userId });

      const resources = await this.fileUploadService.listByPrefix(
        `steerigo/${userId}_`
      );

      const resourceDtos = resources.map(
        (r) =>
          new CloudinaryResourceDto(
            r.public_id,
            r.secure_url,
            r.format,
            r.bytes,
            r.created_at
          )
      );

      return Result.success(new GetUserFilesResponseDto(resourceDtos));
    } catch (err) {
      Logger.error("GetUserFilesUseCase failed", {
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
