import { injectable, inject } from "inversify";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class DeleteFileUseCase
  implements IUseCase<string, Promise<Result<{ message: string }, Error>>>
{
  constructor(
    @inject(TYPES.FileUploadService)
    private fileUploadService: IFileUploadService
  ) {}

  async execute(publicId: string): Promise<Result<{ message: string }, Error>> {
    try {
      Logger.info("Deleting file", { publicId });

      const deleteResult = await this.fileUploadService.delete(publicId);

      if (deleteResult.result === "ok") {
        return Result.success({ message: "File deleted successfully" });
      } else if (deleteResult.result === "not found") {
        return Result.failure(new Error(`File not found`));
      } else {
        return Result.failure(
          new Error(`Unexpected delete result: ${deleteResult.result}`)
        );
      }
    } catch (err) {
      Logger.error("DeleteFileUseCase failed", {
        publicId,
        error: (err as Error).message,
      });
      return Result.failure(err as Error);
    }
  }
}
