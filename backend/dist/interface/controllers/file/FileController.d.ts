import { Request, Response } from "express";
import { FileUploadDto } from "../../../application/dto/file/FileUploadDto";
import { UpdateProfilePictureDto } from "../../../application/dto/file/UpdateProfilePictureDto";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { FileUploadResponseDto } from "../../../application/dto/file/FileUploadResponseDto";
import { GetUserFilesResponseDto } from "../../../application/dto/file/GetUserFilesResponseDto";
import { UpdateProfilePictureResponseDto } from "../../../application/dto/file/UpdateProfilePictureResponseDto";
type MulterRequest = Request & {
    file?: Express.Multer.File;
};
export declare class FileController {
    private _uploadUc;
    private _listUc;
    private _deleteUc;
    private _updateProfileUc;
    constructor(_uploadUc: IUseCase<FileUploadDto, Promise<Result<FileUploadResponseDto, Error>>>, _listUc: IUseCase<string, Promise<Result<GetUserFilesResponseDto, Error>>>, _deleteUc: IUseCase<string, Promise<Result<{
        message: string;
    }, Error>>>, _updateProfileUc: IUseCase<UpdateProfilePictureDto, Promise<Result<UpdateProfilePictureResponseDto>>>);
    private getUserId;
    uploadFile(req: MulterRequest, res: Response): Promise<void>;
    getUserFiles(req: Request, res: Response): Promise<void>;
    deleteFile(req: Request, res: Response): Promise<void>;
    updateProfilePicture(req: MulterRequest, res: Response): Promise<void>;
}
export {};
//# sourceMappingURL=FileController.d.ts.map