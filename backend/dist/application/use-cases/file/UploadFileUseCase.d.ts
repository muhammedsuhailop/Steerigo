import { FileUploadDto } from "@application/dto/file/FileUploadDto";
import { IFileUploadService } from "@application/services/IFileUploadService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { FileUploadResponseDto } from "@application/dto/file/FileUploadResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
export declare class UploadFileUseCase implements IUseCase<FileUploadDto, Promise<Result<FileUploadResponseDto, Error>>> {
    private _fileUploadService;
    private _userRepository;
    constructor(_fileUploadService: IFileUploadService, _userRepository: IUserRepository);
    execute(dto: FileUploadDto): Promise<Result<FileUploadResponseDto, Error>>;
}
//# sourceMappingURL=UploadFileUseCase.d.ts.map