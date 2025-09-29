export class FileUploadDto {
  public readonly purpose: string;
  public readonly file: Express.Multer.File;

  constructor(data: { purpose: string; file: Express.Multer.File }) {
    this.purpose = data.purpose;
    this.file = data.file;
  }

  validate(): string[] {
    const errors: string[] = [];

    const allowedPurposes = [
      "avatar",
      "license",
      "insurance",
      "kycdoc1",
      "kycdoc2",
      "profile",
      "document",
    ];
    if (!allowedPurposes.includes(this.purpose)) {
      errors.push(
        `Invalid purpose. Allowed values: ${allowedPurposes.join(", ")}`
      );
    }

    if (!this.file) {
      errors.push("File is required");
    }

    return errors;
  }
}
