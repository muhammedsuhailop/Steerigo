import { DriverStatus } from "../value-objects/DriverStatus";

export class Driver {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private name: string,
    private email: string,
    private mobile: string,
    private licenseNumber: string,
    private vehicleNumber: string,
    private status: DriverStatus,
    private profilePicture?: string,
    private licenseDocument?: string,
    private vehicleDocument?: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Factory method for creating new drivers
  static create(
    id: string,
    userId: string,
    name: string,
    email: string,
    mobile: string,
    licenseNumber: string,
    vehicleNumber: string
  ): Driver {
    return new Driver(
      id,
      userId,
      name,
      email,
      mobile,
      licenseNumber,
      vehicleNumber,
      DriverStatus.PENDING_VERIFICATION
    );
  }

  // Factory method for reconstructing from database
  static fromData(data: {
    id: string;
    userId: string;
    name: string;
    email: string;
    mobile: string;
    licenseNumber: string;
    vehicleNumber: string;
    status: DriverStatus;
    profilePicture?: string;
    licenseDocument?: string;
    vehicleDocument?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Driver {
    return new Driver(
      data.id,
      data.userId,
      data.name,
      data.email,
      data.mobile,
      data.licenseNumber,
      data.vehicleNumber,
      data.status,
      data.profilePicture,
      data.licenseDocument,
      data.vehicleDocument,
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
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getMobile(): string {
    return this.mobile;
  }
  getLicenseNumber(): string {
    return this.licenseNumber;
  }
  getVehicleNumber(): string {
    return this.vehicleNumber;
  }
  getStatus(): DriverStatus {
    return this.status;
  }
  getProfilePicture(): string | undefined {
    return this.profilePicture;
  }
  getLicenseDocument(): string | undefined {
    return this.licenseDocument;
  }
  getVehicleDocument(): string | undefined {
    return this.vehicleDocument;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  approve(): void {
    if (this.status !== DriverStatus.PENDING_VERIFICATION) {
      throw new Error(
        "Can only approve drivers with pending verification status"
      );
    }
    this.status = DriverStatus.ACTIVE;
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

  reject(): void {
    if (this.status !== DriverStatus.PENDING_VERIFICATION) {
      throw new Error(
        "Can only reject drivers with pending verification status"
      );
    }
    this.status = DriverStatus.REJECTED;
    this.updatedAt = new Date();
  }

  updateProfile(data: {
    name?: string;
    email?: string;
    mobile?: string;
    licenseNumber?: string;
    vehicleNumber?: string;
    profilePicture?: string;
    licenseDocument?: string;
    vehicleDocument?: string;
  }): void {
    if (data.name) this.name = data.name;
    if (data.email) this.email = data.email;
    if (data.mobile) this.mobile = data.mobile;
    if (data.licenseNumber) this.licenseNumber = data.licenseNumber;
    if (data.vehicleNumber) this.vehicleNumber = data.vehicleNumber;
    if (data.profilePicture) this.profilePicture = data.profilePicture;
    if (data.licenseDocument) this.licenseDocument = data.licenseDocument;
    if (data.vehicleDocument) this.vehicleDocument = data.vehicleDocument;
    this.updatedAt = new Date();
  }

  canBeActioned(): boolean {
    return this.status !== DriverStatus.REJECTED;
  }

  isActive(): boolean {
    return this.status === DriverStatus.ACTIVE;
  }
}
