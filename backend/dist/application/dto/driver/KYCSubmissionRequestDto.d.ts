import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { DocumentType } from "@domain/value-objects/DocumentType";
interface LicenseKYCRequestBody {
    licenseCategory: LicenseCategory;
    docNumber: string;
    eligibleBodyTypes?: BodyType[];
    eligibleGearTypes?: GearType[];
    issueDate?: string;
    expiryDate?: string;
    frontImageUrls?: string[];
    backImageUrls?: string[];
}
interface GenericKYCRequestBody {
    docNumber: string;
    issueDate?: string;
    expiryDate?: string;
    frontImageUrls?: string[];
    backImageUrls?: string[];
}
export declare class KYCSubmissionRequestDto {
    private readonly userId;
    private readonly licenseCategory?;
    private readonly licenseNumber?;
    private readonly licenseBodyTypes?;
    private readonly licenseGearTypes?;
    private readonly licenseIssueDate?;
    private readonly licenseExpiryDate?;
    private readonly licenseFrontImage?;
    private readonly licenseBackImage?;
    private readonly idType?;
    private readonly idNumber?;
    private readonly idIssueDate?;
    private readonly idExpiryDate?;
    private readonly idFrontImage?;
    private readonly idBackImage?;
    constructor(userId: string, licenseCategory?: LicenseCategory | undefined, licenseNumber?: string | undefined, licenseBodyTypes?: BodyType[] | undefined, licenseGearTypes?: GearType[] | undefined, licenseIssueDate?: Date | undefined, licenseExpiryDate?: Date | undefined, licenseFrontImage?: string | undefined, licenseBackImage?: string | undefined, idType?: DocumentType | undefined, idNumber?: string | undefined, idIssueDate?: Date | undefined, idExpiryDate?: (Date | null) | undefined, idFrontImage?: string | undefined, idBackImage?: string | undefined);
    static fromLicenseRequest(userId: string, body: LicenseKYCRequestBody): KYCSubmissionRequestDto;
    static fromGenericRequest(userId: string, docType: DocumentType, body: GenericKYCRequestBody): KYCSubmissionRequestDto;
    validate(): string[];
    getUserId(): string;
    getLicenseCategory(): LicenseCategory | undefined;
    getLicenseNumber(): string | undefined;
    getEligibleBodyTypes(): BodyType[] | undefined;
    getEligibleGearTypes(): GearType[] | undefined;
    getLicenseIssueDate(): Date | undefined;
    getLicenseExpiryDate(): Date | undefined;
    getLicenseFrontImage(): string | undefined;
    getLicenseBackImage(): string | undefined;
    getLicenseImageUrls(): {
        front: string[];
        back: string[];
    } | null;
    getIdType(): DocumentType | undefined;
    getIdNumber(): string | undefined;
    getIdIssueDate(): Date | undefined;
    getIdExpiryDate(): Date | null | undefined;
    getIdFrontImage(): string | undefined;
    getIdBackImage(): string | undefined;
    getIdImageUrls(): {
        front: string[];
        back: string[];
    } | null;
    hasLicenseUpdate(): boolean;
    hasIdUpdate(): boolean;
    hasImages(): boolean;
}
export {};
//# sourceMappingURL=KYCSubmissionRequestDto.d.ts.map