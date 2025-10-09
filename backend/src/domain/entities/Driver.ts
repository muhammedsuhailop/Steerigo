import { DriverStatus } from "../value-objects/DriverStatus";
import { KYCStatus } from "../value-objects/KYCStatus";
import { LicenseCategory } from "../value-objects/LicenseCategory";
import { GearType, BodyType } from "../value-objects/VehicleType";

export class Driver {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private eligibleGearTypes: GearType[],
    private eligibleBodyTypes: BodyType[],
    private licenceCategory: LicenseCategory,
    private licenseIssueDate: Date,
    private licenseExpiryDate: Date,
    private kycStatus: KYCStatus,
    private status: DriverStatus,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Factory method for creating new drivers
  static create(
    id: string,
    userId: string,
    eligibleGearTypes: GearType[],
    eligibleBodyTypes: BodyType[],
    licenceCategory: LicenseCategory,
    licenseIssueDate: Date,
    licenseExpiryDate: Date
  ): Driver {
    return new Driver(
      id,
      userId,
      eligibleGearTypes,
      eligibleBodyTypes,
      licenceCategory,
      licenseIssueDate,
      licenseExpiryDate,
      KYCStatus.IN_REVIEW,
      DriverStatus.ACTIVE
    );
  }

  // Factory method for reconstructing from database
  static fromData(data: {
    id: string;
    userId: string;
    eligibleGearTypes: GearType[];
    eligibleBodyTypes: BodyType[];
    licenceCategory: LicenseCategory;
    licenseIssueDate: Date;
    licenseExpiryDate: Date;
    kycStatus: KYCStatus;
    status: DriverStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Driver {
    return new Driver(
      data.id,
      data.userId,
      data.eligibleGearTypes,
      data.eligibleBodyTypes,
      data.licenceCategory,
      data.licenseIssueDate,
      data.licenseExpiryDate,
      data.kycStatus,
      data.status,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getUserId(): string {
    return this.userId;
  }
  getEligibleGearTypes(): GearType[] {
    return [...this.eligibleGearTypes];
  }
  getEligibleBodyTypes(): BodyType[] {
    return [...this.eligibleBodyTypes];
  }
  getLicenceCategory(): LicenseCategory {
    return this.licenceCategory;
  }
  getLicenseIssueDate(): Date {
    return this.licenseIssueDate;
  }
  getLicenseExpiryDate(): Date {
    return this.licenseExpiryDate;
  }
  getKycStatus(): KYCStatus {
    return this.kycStatus;
  }
  getStatus(): DriverStatus {
    return this.status;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  block(reason?: string): void {
    if (this.status === DriverStatus.BLOCKED) {
      throw new Error("Driver is already blocked");
    }
    this.status = DriverStatus.BLOCKED;
    this.updatedAt = new Date();
  }

  suspend(reason?: string): void {
    if (this.status === DriverStatus.SUSPENDED) {
      throw new Error("Driver is already suspended");
    }
    this.status = DriverStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.status === DriverStatus.ACTIVE) {
      throw new Error("Driver is already active");
    }
    this.status = DriverStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  updateKycStatus(newStatus: KYCStatus): void {
    this.kycStatus = newStatus;
    this.updatedAt = new Date();
  }

  updateEligibleVehicles(gearTypes: GearType[], bodyTypes: BodyType[]): void {
    this.eligibleGearTypes = [...gearTypes];
    this.eligibleBodyTypes = [...bodyTypes];
    this.updatedAt = new Date();
  }

  updateLicenseInfo(
    category: LicenseCategory,
    issueDate: Date,
    expiryDate: Date
  ): void {
    this.licenceCategory = category;
    this.licenseIssueDate = issueDate;
    this.licenseExpiryDate = expiryDate;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === DriverStatus.ACTIVE;
  }

  isKycApproved(): boolean {
    return this.kycStatus === KYCStatus.APPROVED;
  }

  canBeActioned(): boolean {
    return true; // All drivers can be actioned in new schema
  }
}
