"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const UploadFileUseCase_1 = require("../../../application/use-cases/file/UploadFileUseCase");
const GetUserFilesUseCase_1 = require("../../../application/use-cases/file/GetUserFilesUseCase");
const DeleteFileUseCase_1 = require("../../../application/use-cases/file/DeleteFileUseCase");
const FileController_1 = require("../../../interface/controllers/file/FileController");
const UpdateProfilePictureUseCase_1 = require("../../../application/use-cases/file/UpdateProfilePictureUseCase");
class FileFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.UploadFileUseCase)
            .to(UploadFileUseCase_1.UploadFileUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserFilesUseCase)
            .to(GetUserFilesUseCase_1.GetUserFilesUseCase);
        container
            .bind(DITypes_1.TYPES.DeleteFileUseCase)
            .to(DeleteFileUseCase_1.DeleteFileUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateProfilePictureUseCase)
            .to(UpdateProfilePictureUseCase_1.UpdateProfilePictureUseCase);
        container.bind(DITypes_1.TYPES.FileController).to(FileController_1.FileController);
    }
}
exports.FileFactory = FileFactory;
//# sourceMappingURL=FileFactory.js.map