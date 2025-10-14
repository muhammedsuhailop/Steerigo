// backend/src/application/use-cases/file/GetUserFilesUseCase.ts

import { injectable, inject } from "inversify";
import { FileUploadService } from "@application/services/FileUploadService";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  created_at: string;
}

export interface FileListResponse {
  resources: CloudinaryResource[];
}

@injectable()
export class GetUserFilesUseCase {
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: FileUploadService
  ) {}

  async execute(userId: string): Promise<Result<FileListResponse, Error>> {
    try {
      Logger.info("Listing user files", { userId });

      const resources = await this.fileUploadService.listByPrefix(
        `steerigo/${userId}_`
      );

      return Result.success({ resources });
    } catch (err) {
      Logger.error("GetUserFilesUseCase failed", {
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
