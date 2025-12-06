export class DriverProfileDto {
  readonly id: string;
  readonly userId: string;
  readonly eligibleGearTypes: string[];
  readonly eligibleBodyTypes: string[];
  readonly kycStatus: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    eligibleGearTypes: string[],
    eligibleBodyTypes: string[],
    kycStatus: string,
    status: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.eligibleGearTypes = eligibleGearTypes;
    this.eligibleBodyTypes = eligibleBodyTypes;
    this.kycStatus = kycStatus;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class UpdateDriverProfileResponseDto {
  readonly driver: DriverProfileDto;
  readonly userUpdated: boolean;
  readonly vehiclesUpdated: boolean;
  readonly kycStatusUpdated: boolean;
  readonly updatedFields: string[];

  constructor(
    driver: DriverProfileDto,
    userUpdated: boolean,
    vehiclesUpdated: boolean,
    kycStatusUpdated: boolean,
    updatedFields: string[]
  ) {
    this.driver = driver;
    this.userUpdated = userUpdated;
    this.vehiclesUpdated = vehiclesUpdated;
    this.kycStatusUpdated = kycStatusUpdated;
    this.updatedFields = updatedFields;
  }
}
