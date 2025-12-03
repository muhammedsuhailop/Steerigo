import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
import { GetUserFilesUseCase } from "@application/use-cases/file/GetUserFilesUseCase";
import { DeleteFileUseCase } from "@application/use-cases/file/DeleteFileUseCase";
import { FileController } from "@interface/controllers/file/FileController";
import { UpdateProfilePictureUseCase } from "@application/use-cases/file/UpdateProfilePictureUseCase";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetUserFilesResponseDto } from "@application/dto/file/GetUserFilesResponseDto";
import { UpdateProfilePictureDto } from "@application/dto/file/UpdateProfilePictureDto";
import { UpdateProfilePictureResponseDto } from "@application/dto/file/UpdateProfilePictureResponseDto";
import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { FileUploadResponseDto } from "@application/dto/file/FileUploadResponseDto";

export class FileFactory {
  static register(container: Container): void {
    container
      .bind<
        IUseCase<FileUploadDto, Promise<Result<FileUploadResponseDto, Error>>>
      >(TYPES.UploadFileUseCase)
      .to(UploadFileUseCase);
    container
      .bind<
        IUseCase<string, Promise<Result<GetUserFilesResponseDto, Error>>>
      >(TYPES.GetUserFilesUseCase)
      .to(GetUserFilesUseCase);
    container
      .bind<
        IUseCase<string, Promise<Result<{ message: string }, Error>>>
      >(TYPES.DeleteFileUseCase)
      .to(DeleteFileUseCase);
    container
      .bind<
        IUseCase<
          UpdateProfilePictureDto,
          Promise<Result<UpdateProfilePictureResponseDto>>
        >
      >(TYPES.UpdateProfilePictureUseCase)
      .to(UpdateProfilePictureUseCase);

    container.bind<FileController>(TYPES.FileController).to(FileController);
  }
}
