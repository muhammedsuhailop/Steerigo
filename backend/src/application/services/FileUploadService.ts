import { CloudinaryResource } from "@application/use-cases/file/GetUserFilesUseCase";

export interface FileUploadResult {
  url: string;
  publicId: string;
  filename: string;
  size: number;
}

export interface FileUploadService {
  upload(
    fileBuffer: Buffer,
    userId: string,
    purpose: string,
    originalName: string
  ): Promise<FileUploadResult>;
  delete(publicId: string): Promise<void>;
  generateSignedUrl(publicId: string, expiresIn?: number): Promise<string>;
  validateFile(file: Express.Multer.File, purpose: string): Promise<boolean>;
  listByPrefix(prefix: string): Promise<CloudinaryResource[]>;
}
