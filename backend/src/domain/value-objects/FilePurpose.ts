export enum FilePurposeEnum {
  AVATAR = "avatar",
  LICENSE_FRONT = "licenseFront",
  LICENSE_BACK = "licenseBack",
  INSURANCE = "insurance",
  KYC_DOC_FRONT = "kycdocFront",
  KYC_DOC_BACK = "kycdocBack",
  PROFILE = "profile",
  DOCUMENT = "document",
}

export class FilePurpose {
  private constructor(private readonly value: FilePurposeEnum) {}

  static create(purpose: string): FilePurpose {
    const validPurpose = Object.values(FilePurposeEnum).find(
      (p) => p === purpose
    );
    if (!validPurpose) {
      throw new Error(
        `Invalid file purpose: ${purpose}. Allowed values: ${Object.values(FilePurposeEnum).join(", ")}`
      );
    }
    return new FilePurpose(validPurpose);
  }

  getValue(): FilePurposeEnum {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: FilePurpose): boolean {
    return this.value === other.value;
  }

  static getAllowedPurposes(): string[] {
    return Object.values(FilePurposeEnum);
  }
}
