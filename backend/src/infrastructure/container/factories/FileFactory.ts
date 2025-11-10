import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

import { UploadFileUseCase } from "@application/use-cases/file/UploadFileUseCase";
import { GetUserFilesUseCase } from "@application/use-cases/file/GetUserFilesUseCase";
import { DeleteFileUseCase } from "@application/use-cases/file/DeleteFileUseCase";
import { FileController } from "@interface/controllers/file/FileController";
import { UpdateProfilePictureUseCase } from "@application/use-cases/file/UpdateProfilePictureUseCase";

export class FileFactory {
  static register(container: Container): void {
    container
      .bind<UploadFileUseCase>(TYPES.UploadFileUseCase)
      .to(UploadFileUseCase);
    container
      .bind<GetUserFilesUseCase>(TYPES.GetUserFilesUseCase)
      .to(GetUserFilesUseCase);
    container
      .bind<DeleteFileUseCase>(TYPES.DeleteFileUseCase)
      .to(DeleteFileUseCase);
    container
      .bind<UpdateProfilePictureUseCase>(TYPES.UpdateProfilePictureUseCase)
      .to(UpdateProfilePictureUseCase);

    container.bind<FileController>(TYPES.FileController).to(FileController);
  }
}
