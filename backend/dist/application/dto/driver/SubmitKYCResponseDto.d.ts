export declare class KycDocumentsDto {
    readonly license?: string;
    readonly id?: string;
    constructor(license?: string, id?: string);
}
export declare class SubmitKYCResponseDto {
    readonly message: string;
    readonly kycDocuments: {
        [key: string]: string;
    };
    readonly licenseUpdated: boolean;
    readonly idUpdated: boolean;
    readonly driverUpdated: boolean;
    constructor(message: string, kycDocuments: {
        [key: string]: string;
    }, licenseUpdated: boolean, idUpdated: boolean, driverUpdated: boolean);
}
//# sourceMappingURL=SubmitKYCResponseDto.d.ts.map