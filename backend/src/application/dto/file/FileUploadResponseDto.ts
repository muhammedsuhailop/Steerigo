export class FileUploadResponseDto {
  readonly url: string;
  readonly publicId: string;
  readonly filename: string;
  readonly size: number;
  readonly mimeType: string;
  readonly uploadedAt: string;

  constructor(
    url: string,
    publicId: string,
    filename: string,
    size: number,
    mimeType: string,
    uploadedAt: string
  ) {
    this.url = url;
    this.publicId = publicId;
    this.filename = filename;
    this.size = size;
    this.mimeType = mimeType;
    this.uploadedAt = uploadedAt;
  }
}
