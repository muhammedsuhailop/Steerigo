import { IFileUploadService } from "@application/services/IFileUploadService";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class DeleteFileUseCase implements IUseCase<string, Promise<Result<{
    message: string;
}, Error>>> {
    private fileUploadService;
    constructor(fileUploadService: IFileUploadService);
    execute(publicId: string): Promise<Result<{
        message: string;
    }, Error>>;
}
//# sourceMappingURL=DeleteFileUseCase.d.ts.map