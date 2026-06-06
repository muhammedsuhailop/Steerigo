import { CloudinaryResourceDto } from "../dto/file/CloudinaryResourceDto";
export interface IFileUploadResult {
    url: string;
    publicId: string;
    filename: string;
    size: number;
}
export interface IDeleteResult {
    result: "ok" | "not found" | string;
}
export interface IFileUploadService {
    upload(fileBuffer: Buffer, userId: string, purpose: string, originalName: string): Promise<IFileUploadResult>;
    delete(publicId: string): Promise<IDeleteResult>;
    generateSignedUrl(publicId: string, expiresIn?: number): Promise<string>;
    validateFile(file: Express.Multer.File, purpose: string): Promise<boolean>;
    listByPrefix(prefix: string): Promise<CloudinaryResourceDto[]>;
}
//# sourceMappingURL=IFileUploadService.d.ts.map