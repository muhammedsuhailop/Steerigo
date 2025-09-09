import { DomainError } from "../errors/DomainError";

export class Driver {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private licenseNumber: string,
    private licenseIssueDate: Date,
    private licenseExpiryDate: Date,
    private rto: string,
    private licenseCategory: string[],
    private kycStatus: "Pending" | "Verified" | "Rejected" = "Pending",
    private status: "Active" | "Blocked" | "InReview" = "InReview",
    private eligibleVehicleType: string[] = [],
    private eligibleGearType: string[] = [],
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    userId: string;
    licenseNumber: string;
    licenseIssueDate: Date;
    licenseExpiryDate: Date;
    rto: string;
    licenseCategory: string[];
    eligibleVehicleType: string[];
    eligibleGearType: string[];
  }): Driver {
    if (!props.licenseNumber) {
      throw new DomainError("License number is required");
    }

    return new Driver(
      props.id,
      props.userId,
      props.licenseNumber,
      props.licenseIssueDate,
      props.licenseExpiryDate,
      props.rto,
      props.licenseCategory,
      "Pending",
      "InReview",
      props.eligibleVehicleType,
      props.eligibleGearType
    );
  }

  static reconstruct(props: {
    id: string;
    userId: string;
    licenseNumber: string;
    licenseIssueDate: Date;
    licenseExpiryDate: Date;
    rto: string;
    licenseCategory: string[];
    kycStatus: "Pending" | "Verified" | "Rejected";
    status: "Active" | "Blocked" | "InReview";
    eligibleVehicleType: string[];
    eligibleGearType: string[];
    createdAt: Date;
    updatedAt: Date;
  }): Driver {
    return new Driver(
      props.id,
      props.userId,
      props.licenseNumber,
      props.licenseIssueDate,
      props.licenseExpiryDate,
      props.rto,
      props.licenseCategory,
      props.kycStatus,
      props.status,
      props.eligibleVehicleType,
      props.eligibleGearType,
      props.createdAt,
      props.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getLicenseNumber(): string {
    return this.licenseNumber;
  }

  getLicenseIssueDate(): Date {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date {
    return this.licenseExpiryDate;
  }

  getRto(): string {
    return this.rto;
  }

  getLicenseCategory(): string[] {
    return this.licenseCategory;
  }

  getKycStatus(): "Pending" | "Verified" | "Rejected" {
    return this.kycStatus;
  }

  getStatus(): "Active" | "Blocked" | "InReview" {
    return this.status;
  }

  getEligibleVehicleType(): string[] {
    return this.eligibleVehicleType;
  }

  getEligibleGearType(): string[] {
    return this.eligibleGearType;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
