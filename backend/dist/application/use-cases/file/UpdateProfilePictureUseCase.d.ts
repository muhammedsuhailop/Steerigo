import { UpdateProfilePictureDto } from "../../dto/file/UpdateProfilePictureDto";
import { IFileUploadService } from "../../services/IFileUploadService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Result } from "../../../shared/utils/Result";
import { UpdateProfilePictureResponseDto } from "../../dto/file/UpdateProfilePictureResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
export declare class UpdateProfilePictureUseCase implements IUseCase<UpdateProfilePictureDto, Promise<Result<UpdateProfilePictureResponseDto>>> {
    private _fileUploadService;
    private _userRepository;
    constructor(_fileUploadService: IFileUploadService, _userRepository: IUserRepository);
    execute(dto: UpdateProfilePictureDto): Promise<Result<UpdateProfilePictureResponseDto>>;
}
//# sourceMappingURL=UpdateProfilePictureUseCase.d.ts.map