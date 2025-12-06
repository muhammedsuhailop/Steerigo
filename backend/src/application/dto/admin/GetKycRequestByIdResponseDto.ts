export class KycDocumentImages {
  readonly docImageUrlsFront: string[];
  readonly docImageUrlsBack: string[];

  constructor(docImageUrlsFront: string[], docImageUrlsBack: string[]) {
    this.docImageUrlsFront = docImageUrlsFront;
    this.docImageUrlsBack = docImageUrlsBack;
  }
}

export class KycDocumentDates {
  readonly issueDate: string | null;
  readonly expiryDate: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    issueDate: string | null,
    expiryDate: string | null,
    createdAt: string,
    updatedAt: string
  ) {
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class KycDocumentInfo {
  readonly id: string;
  readonly docType: string;
  readonly docNumber: string;
  readonly verificationStatus: string;
  readonly comments: string | null;
  readonly isExpired: boolean;

  constructor(
    id: string,
    docType: string,
    docNumber: string,
    verificationStatus: string,
    comments: string | null,
    isExpired: boolean
  ) {
    this.id = id;
    this.docType = docType;
    this.docNumber = docNumber;
    this.verificationStatus = verificationStatus;
    this.comments = comments;
    this.isExpired = isExpired;
  }
}

export class KycDocumentDto {
  readonly id: string;
  readonly docType: string;
  readonly docNumber: string;
  readonly issueDate: string | null;
  readonly expiryDate: string | null;
  readonly verificationStatus: string;
  readonly comments: string | null;
  readonly docImageUrlsFront: string[];
  readonly docImageUrlsBack: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isExpired: boolean;

  constructor(
    id: string,
    docType: string,
    docNumber: string,
    issueDate: string | null,
    expiryDate: string | null,
    verificationStatus: string,
    comments: string | null,
    docImageUrlsFront: string[],
    docImageUrlsBack: string[],
    createdAt: string,
    updatedAt: string,
    isExpired: boolean
  ) {
    this.id = id;
    this.docType = docType;
    this.docNumber = docNumber;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.verificationStatus = verificationStatus;
    this.comments = comments;
    this.docImageUrlsFront = docImageUrlsFront;
    this.docImageUrlsBack = docImageUrlsBack;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isExpired = isExpired;
  }
}

export class DriverInfoDto {
  readonly driverId: string;
  readonly userId: string;
  readonly userName: string;
  readonly userEmail: string;
  readonly userMobile: string;
  readonly driverStatus: string;

  constructor(
    driverId: string,
    userId: string,
    userName: string,
    userEmail: string,
    userMobile: string,
    driverStatus: string
  ) {
    this.driverId = driverId;
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userMobile = userMobile;
    this.driverStatus = driverStatus;
  }
}

export class GetKycRequestByIdResponseDto {
  readonly kyc: KycDocumentDto;
  readonly driver: DriverInfoDto;

  constructor(kyc: KycDocumentDto, driver: DriverInfoDto) {
    this.kyc = kyc;
    this.driver = driver;
  }
}
