import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

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

export class KycDocumentSummaryDto {
  readonly id: string;
  readonly docType: DocumentType;
  readonly docNumber: string;
  readonly issueDate: string | null;
  readonly expiryDate: string | null;
  readonly verificationStatus: KYCStatus;
  readonly comments: string | null;
  readonly docImageUrlsFront: string[];
  readonly docImageUrlsBack: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isExpired: boolean;

  constructor(
    id: string,
    docType: DocumentType,
    docNumber: string,
    issueDate: string | null,
    expiryDate: string | null,
    verificationStatus: KYCStatus,
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

export class KycDriverInfoDto {
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

export class KycRequestListItemDto {
  readonly kyc: KycDocumentSummaryDto;
  readonly driver: KycDriverInfoDto;

  constructor(kyc: KycDocumentSummaryDto, driver: KycDriverInfoDto) {
    this.kyc = kyc;
    this.driver = driver;
  }
}

export class PaginationDto {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages?: number;

  constructor(
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages?: number
  ) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
  }
}

export class KycRequestsAppliedFiltersDto {
  readonly sortBy: string | null;
  readonly sortOrder: string | null;
  readonly verificationStatus: KYCStatus | null;
  readonly docType: DocumentType | null;
  readonly driverId: string | null;
  readonly dateFrom: string | null;
  readonly dateTo: string | null;

  constructor(
    sortBy: string | null,
    sortOrder: string | null,
    verificationStatus: KYCStatus | null,
    docType: DocumentType | null,
    driverId: string | null,
    dateFrom: string | null,
    dateTo: string | null
  ) {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.verificationStatus = verificationStatus;
    this.docType = docType;
    this.driverId = driverId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }
}

export class GetKycRequestsResponseDto {
  readonly kycDocuments: KycRequestListItemDto[];
  readonly pagination: PaginationDto;
  readonly appliedFilters: KycRequestsAppliedFiltersDto;

  constructor(
    kycDocuments: KycRequestListItemDto[],
    pagination: PaginationDto,
    appliedFilters: KycRequestsAppliedFiltersDto
  ) {
    this.kycDocuments = kycDocuments;
    this.pagination = pagination;
    this.appliedFilters = appliedFilters;
  }
}
