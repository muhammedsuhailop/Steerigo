export class AdminLicenseInfo {
  readonly licenseNumber: string;
  readonly licenceCategory: string;
  readonly licenseIssueDate: Date;
  readonly licenseExpiryDate: Date;
  readonly licenseVerified: boolean;

  constructor(
    licenseNumber: string,
    licenceCategory: string,
    licenseIssueDate: Date,
    licenseExpiryDate: Date,
    licenseVerified: boolean
  ) {
    this.licenseNumber = licenseNumber;
    this.licenceCategory = licenceCategory;
    this.licenseIssueDate = licenseIssueDate;
    this.licenseExpiryDate = licenseExpiryDate;
    this.licenseVerified = licenseVerified;
  }
}

export class AdminKycDocument {
  readonly id: string;
  readonly docType: string;
  readonly docNumber: string;
  readonly issueDate: Date | null;
  readonly expiryDate: Date | null;
  readonly verificationStatus: string;
  readonly comments: string | null;
  readonly isExpired: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: string,
    docType: string,
    docNumber: string,
    issueDate: Date | null,
    expiryDate: Date | null,
    verificationStatus: string,
    comments: string | null,
    isExpired: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.docType = docType;
    this.docNumber = docNumber;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.verificationStatus = verificationStatus;
    this.comments = comments;
    this.isExpired = isExpired;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class DriverStatistics {
  readonly totalRides: number;
  readonly totalEarnings: number;
  readonly rating: number;
  readonly lastRideDate: Date | null;

  constructor(
    totalRides: number,
    totalEarnings: number,
    rating: number,
    lastRideDate: Date | null
  ) {
    this.totalRides = totalRides;
    this.totalEarnings = totalEarnings;
    this.rating = rating;
    this.lastRideDate = lastRideDate;
  }
}

export class AdminUserInfo {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly mobile: string;
  readonly profilePicture: string | undefined;

  constructor(
    id: string,
    name: string,
    email: string,
    mobile: string,
    profilePicture?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.profilePicture = profilePicture;
  }
}

export class AdminDriverInfo {
  readonly id: string;
  readonly userId: string;
  readonly status: string;
  readonly kycStatus: string;
  readonly licenceCategory: string;
  readonly eligibleGearTypes: string[];
  readonly eligibleBodyTypes: string[];
  readonly licenseIssueDate: Date;
  readonly licenseExpiryDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    status: string,
    kycStatus: string,
    licenceCategory: string,
    eligibleGearTypes: string[],
    eligibleBodyTypes: string[],
    licenseIssueDate: Date,
    licenseExpiryDate: Date,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.kycStatus = kycStatus;
    this.licenceCategory = licenceCategory;
    this.eligibleGearTypes = eligibleGearTypes;
    this.eligibleBodyTypes = eligibleBodyTypes;
    this.licenseIssueDate = licenseIssueDate;
    this.licenseExpiryDate = licenseExpiryDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class AdminDriverProfileData {
  readonly driver: AdminDriverInfo;
  readonly user: AdminUserInfo;
  readonly stats: DriverStatistics;
  readonly kycDocuments: AdminKycDocument[];

  constructor(
    driver: AdminDriverInfo,
    user: AdminUserInfo,
    stats: DriverStatistics,
    kycDocuments: AdminKycDocument[]
  ) {
    this.driver = driver;
    this.user = user;
    this.stats = stats;
    this.kycDocuments = kycDocuments;
  }
}

export class AdminGetDriverProfileResponseDto extends AdminDriverProfileData {
  constructor(
    driver: AdminDriverInfo,
    user: AdminUserInfo,
    stats: DriverStatistics,
    kycDocuments: AdminKycDocument[]
  ) {
    super(driver, user, stats, kycDocuments);
  }
}
