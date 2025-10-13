import { FilePurpose } from "@domain/value-objects/FilePurpose";

export class File {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly filename: string,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly url: string,
    public readonly publicId: string,
    public readonly purpose: FilePurpose,
    public readonly uploadedAt: Date,
    public readonly isActive: boolean = true
  ) {}

  static create(data: {
    id: string;
    userId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    publicId: string;
    purpose: FilePurpose;
    uploadedAt?: Date;
  }): File {
    return new File(
      data.id,
      data.userId,
      data.filename,
      data.originalName,
      data.mimeType,
      data.size,
      data.url,
      data.publicId,
      data.purpose,
      data.uploadedAt || new Date()
    );
  }

  isImage(): boolean {
    return this.mimeType.startsWith("image/");
  }

  isDocument(): boolean {
    return [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(this.mimeType);
  }

  getFileExtension(): string {
    return this.originalName.split(".").pop()?.toLowerCase() || "";
  }
}
