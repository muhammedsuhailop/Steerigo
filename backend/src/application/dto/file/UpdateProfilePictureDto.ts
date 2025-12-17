import { FilePurpose } from "@domain/value-objects/FilePurpose";

export class UpdateProfilePictureDto {
  public readonly userId: string;
  public readonly purpose: FilePurpose = FilePurpose.create("profile");
  public readonly file: Express.Multer.File;

  constructor(data: { userId: string; file: Express.Multer.File }) {
    this.userId = data.userId;
    this.file = data.file;
  }

  static fromRequest(userId: string, file: Express.Multer.File) {
    return new UpdateProfilePictureDto({ userId, file });
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId || this.userId.trim().length === 0) {
      errors.push("User ID is required");
    }

    if (!this.file) {
      errors.push("File is required");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (this.file && this.file.size > maxSize) {
      errors.push("File size cannot exceed 2MB");
    }

    // Only allow image types for profile picture
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (this.file && !allowedMimeTypes.includes(this.file.mimetype)) {
      errors.push(
        `Invalid file type for profile picture. Allowed types: ${allowedMimeTypes.join(", ")}`
      );
    }

    return errors;
  }

  getFileSizeInMB(): number {
    return parseFloat((this.file.size / (1024 * 1024)).toFixed(2));
  }
}
