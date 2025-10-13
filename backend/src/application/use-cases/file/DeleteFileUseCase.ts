// backend/src/application/use-cases/file/DeleteFileUseCase.ts

import { injectable, inject } from "inversify";
import { FileUploadService } from "@application/services/FileUploadService";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class DeleteFileUseCase {
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: FileUploadService
  ) {}

  async execute(publicId: string): Promise<Result<{ message: string }, Error>> {
    try {
      Logger.info("Deleting file", { publicId });
      await this.fileUploadService.delete(publicId);
      return Result.success({ message: "File deleted successfully" });
    } catch (err) {
      Logger.error("DeleteFileUseCase failed", {
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
