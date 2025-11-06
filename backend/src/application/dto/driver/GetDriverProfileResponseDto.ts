export interface LicenseInfo {
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  licenseVerified: boolean;
}

export interface KycDocument {
  docId: string;
  docType: string;
  docNumberMasked: string;
  issueDate?: Date;
  expiryDate?: Date;
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KycInfo {
  overallStatus: string;
  docs: KycDocument[];
}

export interface ProfileMeta {
  lastUpdated: Date;
  serverTime: Date;
}

export interface DriverProfileData {
  driverId: string;
  userId: string;
  name: string;
  profileImageUrl: string;
  email: string;
  mobile: string;
  dob: Date;
  gender: string;
  address: string;
  role: string;
  status: string;
  isVerified: boolean;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
  license: LicenseInfo;
  kyc: KycInfo;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  meta: ProfileMeta;
}

export class GetDriverProfileResponseDto {
  readonly success: boolean = true;
  readonly message: string = "Driver profile fetched successfully";

  constructor(public readonly data: DriverProfileData) {}
}
