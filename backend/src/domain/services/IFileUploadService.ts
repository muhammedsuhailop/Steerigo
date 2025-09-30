export interface IFileUploadService {
  upload(
    fileBuffer: Buffer,
    userId: string,
    purpose: string
  ): Promise<{
    url: string;
    publicId: string;
  }>;
  delete(publicId: string): Promise<void>;
}
