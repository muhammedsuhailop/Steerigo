import { FilePurpose } from "@domain/value-objects/FilePurpose";

export class FileUploadDto {
  public readonly userId: string;
  public readonly purpose: FilePurpose;
  public readonly file: Express.Multer.File;

  constructor(data: {
    userId: string;
    purpose: string;
    file: Express.Multer.File;
  }) {
    this.userId = data.userId;
    this.purpose = FilePurpose.create(data.purpose);
    this.file = data.file;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Purpose validation is handled by FilePurpose value object
    if (!this.file) {
      errors.push("File is required");
      return errors;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (this.file.size > maxSize) {
      errors.push("File size cannot exceed 2MB");
    }

    // MIME type validation based on purpose
    const allowedMimeTypes = this.getAllowedMimeTypesForPurpose();
    if (!allowedMimeTypes.includes(this.file.mimetype)) {
      errors.push(
        `Invalid file type for purpose ${this.purpose.toString()}. Allowed types: ${allowedMimeTypes.join(", ")}`
      );
    }

    return errors;
  }

  getUserId(): string {
    return this.userId;
  }

  private getAllowedMimeTypesForPurpose(): string[] {
    const purposeValue = this.purpose.getValue();

    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const documentTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    switch (purposeValue) {
      case "avatar":
      case "profile":
        return imageTypes;
      case "licenseFront":
      case "licenseBack":
      case "kycdocFront":
      case "kycdocBack":
      case "insurance":
        return documentTypes;
      case "document":
        return [
          ...imageTypes,
          ...documentTypes,
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
      default:
        return imageTypes;
    }
  }

  getFileSizeInMB(): number {
    return parseFloat((this.file.size / (1024 * 1024)).toFixed(2));
  }
}
