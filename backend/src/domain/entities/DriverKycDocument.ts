export class DriverKycDocument {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private docType: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport",
    private docNumber: string,
    private issueDate: Date,
    private expiryDate: Date,
    private docImageUrls: string[],
    private isVerified: boolean = false,
    private verifiedAt?: Date,
    private comments?: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    driverId: string;
    docType: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
    docNumber: string;
    issueDate: Date;
    expiryDate: Date;
    docImageUrls: string[];
    isVerified?: boolean;
    verifiedAt?: Date;
    comments?: string;
  }): DriverKycDocument {
    return new DriverKycDocument(
      props.id,
      props.driverId,
      props.docType,
      props.docNumber,
      props.issueDate,
      props.expiryDate,
      props.docImageUrls,
      props.isVerified ?? false,
      props.verifiedAt,
      props.comments
    );
  }

  static reconstruct(props: {
    id: string;
    driverId: string;
    docType: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
    docNumber: string;
    issueDate: Date;
    expiryDate: Date;
    docImageUrls: string[];
    isVerified: boolean;
    verifiedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
  }): DriverKycDocument {
    return new DriverKycDocument(
      props.id,
      props.driverId,
      props.docType,
      props.docNumber,
      props.issueDate,
      props.expiryDate,
      props.docImageUrls,
      props.isVerified,
      props.verifiedAt,
      props.comments,
      props.createdAt,
      props.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getDriverId(): string {
    return this.driverId;
  }

  getDocType(): "PAN" | "Aadhaar" | "DrivingLicense" | "Passport" {
    return this.docType;
  }

  getDocNumber(): string {
    return this.docNumber;
  }

  getIssueDate(): Date {
    return this.issueDate;
  }

  getExpiryDate(): Date {
    return this.expiryDate;
  }

  getDocImageUrls(): string[] {
    return this.docImageUrls;
  }

  getIsVerified(): boolean {
    return this.isVerified;
  }

  getVerifiedAt(): Date | undefined {
    return this.verifiedAt;
  }

  getComments(): string | undefined {
    return this.comments;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
