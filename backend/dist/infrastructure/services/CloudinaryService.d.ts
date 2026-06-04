import { IFileUploadService, IFileUploadResult, IDeleteResult } from "@application/services/IFileUploadService";
import { CloudinaryResourceDto } from "@application/dto/file/CloudinaryResourceDto";
export declare class CloudinaryService implements IFileUploadService {
    constructor();
    upload(fileBuffer: Buffer, userId: string, purpose: string, originalName: string): Promise<IFileUploadResult>;
    delete(publicId: string): Promise<IDeleteResult>;
    generateSignedUrl(publicId: string, expiresIn?: number): Promise<string>;
    validateFile(file: Express.Multer.File, purpose: string): Promise<boolean>;
    private getAllowedMimeTypes;
    listByPrefix(prefix: string): Promise<CloudinaryResourceDto[]>;
}
//# sourceMappingURL=CloudinaryService.d.ts.map