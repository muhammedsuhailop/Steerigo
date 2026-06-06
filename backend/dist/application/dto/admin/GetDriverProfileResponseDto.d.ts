export declare class AdminLicenseInfo {
    readonly licenseNumber: string;
    readonly licenceCategory: string;
    readonly licenseIssueDate: Date;
    readonly licenseExpiryDate: Date;
    readonly licenseVerified: boolean;
    constructor(licenseNumber: string, licenceCategory: string, licenseIssueDate: Date, licenseExpiryDate: Date, licenseVerified: boolean);
}
export declare class AdminKycDocument {
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
    constructor(id: string, docType: string, docNumber: string, issueDate: Date | null, expiryDate: Date | null, verificationStatus: string, comments: string | null, isExpired: boolean, createdAt: Date, updatedAt: Date);
}
export declare class DriverStatistics {
    readonly totalRides: number;
    readonly totalEarnings: number;
    readonly rating: number;
    readonly lastRideDate: Date | null;
    constructor(totalRides: number, totalEarnings: number, rating: number, lastRideDate: Date | null);
}
export declare class AdminUserInfo {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly mobile: string;
    readonly profilePicture: string | undefined;
    constructor(id: string, name: string, email: string, mobile: string, profilePicture?: string);
}
export declare class AdminDriverInfo {
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
    constructor(id: string, userId: string, status: string, kycStatus: string, licenceCategory: string, eligibleGearTypes: string[], eligibleBodyTypes: string[], licenseIssueDate: Date, licenseExpiryDate: Date, createdAt: Date, updatedAt: Date);
}
export declare class AdminDriverProfileData {
    readonly driver: AdminDriverInfo;
    readonly user: AdminUserInfo;
    readonly stats: DriverStatistics;
    readonly kycDocuments: AdminKycDocument[];
    constructor(driver: AdminDriverInfo, user: AdminUserInfo, stats: DriverStatistics, kycDocuments: AdminKycDocument[]);
}
export declare class AdminGetDriverProfileResponseDto extends AdminDriverProfileData {
    constructor(driver: AdminDriverInfo, user: AdminUserInfo, stats: DriverStatistics, kycDocuments: AdminKycDocument[]);
}
//# sourceMappingURL=GetDriverProfileResponseDto.d.ts.map