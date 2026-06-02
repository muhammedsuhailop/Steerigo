export interface RegisterDriverInput {
    name?: string;
    mobile?: string;
    dob?: string;
    gender?: string;
    state?: string;
    pin?: string;
    address?: string;
    bodyTypes?: string[] | string;
    gearTypes?: string[] | string;
    licenseNumber?: string;
    licenseCategory?: string[] | string;
    licenseIssueDate?: string;
    licenseExpiryDate?: string;
    idType?: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
    idNumber?: string;
    idIssueDate?: string;
    idExpiryDate?: string;
    licenseFrontImage?: string;
    licenseBackImage?: string;
    idFrontImage?: string;
    idBackImage?: string;
}
export declare class RegisterDriverDto {
    readonly name: string;
    readonly mobile: string;
    readonly dob: string;
    readonly gender: string;
    readonly state: string;
    readonly pin: string;
    readonly address: string;
    readonly bodyTypes: string[];
    readonly gearTypes: string[];
    readonly licenseNumber: string;
    readonly licenseCategory: string[];
    readonly licenseIssueDate: string;
    readonly licenseExpiryDate: string;
    readonly idType: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
    readonly idNumber: string;
    readonly idIssueDate: string;
    readonly idExpiryDate: string;
    readonly licenseFrontImage: string;
    readonly licenseBackImage: string;
    readonly idFrontImage: string;
    readonly idBackImage: string;
    constructor(data: unknown);
    getFullAddress(): string;
}
//# sourceMappingURL=RegisterDriverDto.d.ts.map