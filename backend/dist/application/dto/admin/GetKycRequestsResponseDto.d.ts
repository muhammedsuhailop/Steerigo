import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
export declare class KycDocumentImages {
    readonly docImageUrlsFront: string[];
    readonly docImageUrlsBack: string[];
    constructor(docImageUrlsFront: string[], docImageUrlsBack: string[]);
}
export declare class KycDocumentDates {
    readonly issueDate: string | null;
    readonly expiryDate: string | null;
    readonly createdAt: string;
    readonly updatedAt: string;
    constructor(issueDate: string | null, expiryDate: string | null, createdAt: string, updatedAt: string);
}
export declare class KycDocumentSummaryDto {
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
    constructor(id: string, docType: DocumentType, docNumber: string, issueDate: string | null, expiryDate: string | null, verificationStatus: KYCStatus, comments: string | null, docImageUrlsFront: string[], docImageUrlsBack: string[], createdAt: string, updatedAt: string, isExpired: boolean);
}
export declare class KycDriverInfoDto {
    readonly driverId: string;
    readonly userId: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly userMobile: string;
    readonly driverStatus: string;
    constructor(driverId: string, userId: string, userName: string, userEmail: string, userMobile: string, driverStatus: string);
}
export declare class KycRequestListItemDto {
    readonly kyc: KycDocumentSummaryDto;
    readonly driver: KycDriverInfoDto;
    constructor(kyc: KycDocumentSummaryDto, driver: KycDriverInfoDto);
}
export declare class PaginationDto {
    readonly currentPage: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages?: number;
    constructor(currentPage: number, pageSize: number, totalItems: number, totalPages?: number);
}
export declare class KycRequestsAppliedFiltersDto {
    readonly sortBy: string | null;
    readonly sortOrder: string | null;
    readonly verificationStatus: KYCStatus | null;
    readonly docType: DocumentType | null;
    readonly driverId: string | null;
    readonly dateFrom: string | null;
    readonly dateTo: string | null;
    constructor(sortBy: string | null, sortOrder: string | null, verificationStatus: KYCStatus | null, docType: DocumentType | null, driverId: string | null, dateFrom: string | null, dateTo: string | null);
}
export declare class GetKycRequestsResponseDto {
    readonly kycDocuments: KycRequestListItemDto[];
    readonly pagination: PaginationDto;
    readonly appliedFilters: KycRequestsAppliedFiltersDto;
    constructor(kycDocuments: KycRequestListItemDto[], pagination: PaginationDto, appliedFilters: KycRequestsAppliedFiltersDto);
}
//# sourceMappingURL=GetKycRequestsResponseDto.d.ts.map