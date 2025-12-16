import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { DocumentType } from "@domain/value-objects/DocumentType";

interface LicenseKYCRequestBody {
  licenseCategory: LicenseCategory;
  docNumber: string;
  eligibleBodyTypes?: BodyType[];
  eligibleGearTypes?: GearType[];
  issueDate?: string;
  expiryDate?: string;
  frontImageUrls?: string[];
  backImageUrls?: string[];
}

interface GenericKYCRequestBody {
  docNumber: string;
  issueDate?: string;
  expiryDate?: string;
  frontImageUrls?: string[];
  backImageUrls?: string[];
}

export class KYCSubmissionRequestDto {
  constructor(
    private readonly userId: string,
    private readonly licenseCategory?: LicenseCategory,
    private readonly licenseNumber?: string,
    private readonly licenseBodyTypes?: BodyType[],
    private readonly licenseGearTypes?: GearType[],
    private readonly licenseIssueDate?: Date,
    private readonly licenseExpiryDate?: Date,
    private readonly licenseFrontImage?: string,
    private readonly licenseBackImage?: string,
    private readonly idType?: DocumentType,
    private readonly idNumber?: string,
    private readonly idIssueDate?: Date,
    private readonly idExpiryDate?: Date | null,
    private readonly idFrontImage?: string,
    private readonly idBackImage?: string
  ) {}

  static fromLicenseRequest(
    userId: string,
    body: LicenseKYCRequestBody
  ): KYCSubmissionRequestDto {
    return new KYCSubmissionRequestDto(
      userId,
      body.licenseCategory,
      body.docNumber,
      body.eligibleBodyTypes,
      body.eligibleGearTypes,
      body.issueDate ? new Date(body.issueDate) : undefined,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
      body.frontImageUrls?.[0],
      body.backImageUrls?.[0],
      undefined, // idType
      undefined, // idNumber
      undefined, // idIssueDate
      undefined, // idExpiryDate
      undefined, // idFrontImage
      undefined // idBackImage
    );
  }

  static fromGenericRequest(
    userId: string,
    docType: DocumentType,
    body: GenericKYCRequestBody
  ): KYCSubmissionRequestDto {
    return new KYCSubmissionRequestDto(
      userId,
      undefined, // licenseCategory
      undefined, // licenseNumber
      undefined, // licenseBodyTypes
      undefined, // licenseGearTypes
      undefined, // licenseIssueDate
      undefined, // licenseExpiryDate
      undefined, // licenseFrontImage
      undefined, // licenseBackImage
      docType,
      body.docNumber,
      body.issueDate ? new Date(body.issueDate) : undefined,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
      body.frontImageUrls?.[0],
      body.backImageUrls?.[0]
    );
  }

  validate(): string[] {
    const errors: string[] = [];

    const hasLicense =
      this.licenseNumber ||
      this.licenseFrontImage ||
      this.licenseBackImage ||
      this.licenseCategory;
    const hasId =
      this.idNumber || this.idFrontImage || this.idBackImage || this.idType;

    if (!hasLicense && !hasId) {
      errors.push("At least one document (License or ID) must be provided");
    }

    if (
      this.licenseNumber ||
      this.licenseCategory ||
      this.licenseIssueDate ||
      this.licenseExpiryDate
    ) {
      if (!this.licenseNumber) errors.push("License number is required");
      if (!this.licenseCategory) errors.push("License category is required");
      if (!this.licenseIssueDate) errors.push("License issue date is required");
      if (!this.licenseExpiryDate)
        errors.push("License expiry date is required");
      if (this.licenseBodyTypes && this.licenseBodyTypes.length === 0) {
        errors.push("Eligible body types are required for license");
      }
      if (this.licenseGearTypes && this.licenseGearTypes.length === 0) {
        errors.push("Eligible gear types are required for license");
      }
    }

    if (this.idNumber || this.idType || this.idIssueDate || this.idExpiryDate) {
      if (!this.idNumber) errors.push("ID number is required");
      if (!this.idType) errors.push("ID type is required");
      if (!this.idIssueDate) errors.push("ID issue date is required");
    }

    return errors;
  }

  getUserId(): string {
    return this.userId;
  }

  getLicenseCategory(): LicenseCategory | undefined {
    return this.licenseCategory;
  }

  getLicenseNumber(): string | undefined {
    return this.licenseNumber;
  }

  getEligibleBodyTypes(): BodyType[] | undefined {
    return this.licenseBodyTypes;
  }

  getEligibleGearTypes(): GearType[] | undefined {
    return this.licenseGearTypes;
  }

  getLicenseIssueDate(): Date | undefined {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date | undefined {
    return this.licenseExpiryDate;
  }

  getLicenseFrontImage(): string | undefined {
    return this.licenseFrontImage;
  }

  getLicenseBackImage(): string | undefined {
    return this.licenseBackImage;
  }

  getLicenseImageUrls(): { front: string[]; back: string[] } | null {
    if (!this.licenseFrontImage && !this.licenseBackImage) {
      return null;
    }
    return {
      front: this.licenseFrontImage ? [this.licenseFrontImage] : [],
      back: this.licenseBackImage ? [this.licenseBackImage] : [],
    };
  }

  getIdType(): DocumentType | undefined {
    return this.idType;
  }

  getIdNumber(): string | undefined {
    return this.idNumber;
  }

  getIdIssueDate(): Date | undefined {
    return this.idIssueDate;
  }

  getIdExpiryDate(): Date | null | undefined {
    return this.idExpiryDate;
  }

  getIdFrontImage(): string | undefined {
    return this.idFrontImage;
  }

  getIdBackImage(): string | undefined {
    return this.idBackImage;
  }

  getIdImageUrls(): { front: string[]; back: string[] } | null {
    if (!this.idFrontImage && !this.idBackImage) {
      return null;
    }
    return {
      front: this.idFrontImage ? [this.idFrontImage] : [],
      back: this.idBackImage ? [this.idBackImage] : [],
    };
  }

  hasLicenseUpdate(): boolean {
    return !!(
      this.licenseNumber ||
      this.licenseCategory ||
      this.licenseIssueDate ||
      this.licenseExpiryDate
    );
  }

  hasIdUpdate(): boolean {
    return !!(this.idNumber || this.idType || this.idIssueDate);
  }

  hasImages(): boolean {
    return !!(
      this.licenseFrontImage ||
      this.licenseBackImage ||
      this.idFrontImage ||
      this.idBackImage
    );
  }
}
