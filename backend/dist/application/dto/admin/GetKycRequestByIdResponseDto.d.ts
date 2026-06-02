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
export declare class KycDocumentInfo {
    readonly id: string;
    readonly docType: string;
    readonly docNumber: string;
    readonly verificationStatus: string;
    readonly comments: string | null;
    readonly isExpired: boolean;
    constructor(id: string, docType: string, docNumber: string, verificationStatus: string, comments: string | null, isExpired: boolean);
}
export declare class KycDocumentDto {
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
    constructor(id: string, docType: string, docNumber: string, issueDate: string | null, expiryDate: string | null, verificationStatus: string, comments: string | null, docImageUrlsFront: string[], docImageUrlsBack: string[], createdAt: string, updatedAt: string, isExpired: boolean);
}
export declare class DriverInfoDto {
    readonly driverId: string;
    readonly userId: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly userMobile: string;
    readonly driverStatus: string;
    constructor(driverId: string, userId: string, userName: string, userEmail: string, userMobile: string, driverStatus: string);
}
export declare class GetKycRequestByIdResponseDto {
    readonly kyc: KycDocumentDto;
    readonly driver: DriverInfoDto;
    constructor(kyc: KycDocumentDto, driver: DriverInfoDto);
}
//# sourceMappingURL=GetKycRequestByIdResponseDto.d.ts.map