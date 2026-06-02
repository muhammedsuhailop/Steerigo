import { IFileUploadService } from "../../services/IFileUploadService";
import { Result } from "../../../shared/utils/Result";
import { GetUserFilesResponseDto } from "../../dto/file/GetUserFilesResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetUserFilesUseCase implements IUseCase<string, Promise<Result<GetUserFilesResponseDto, Error>>> {
    private fileUploadService;
    constructor(fileUploadService: IFileUploadService);
    execute(userId: string): Promise<Result<GetUserFilesResponseDto, Error>>;
}
//# sourceMappingURL=GetUserFilesUseCase.d.ts.map