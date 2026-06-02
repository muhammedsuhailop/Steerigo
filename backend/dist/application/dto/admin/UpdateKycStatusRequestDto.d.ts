import { KYCStatus } from "@domain/value-objects/KYCStatus";
export declare class UpdateKycStatusRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(kycId: string, requestBody: unknown): UpdateKycStatusRequestDto;
    getKycId(): string;
    getVerificationStatus(): KYCStatus;
    getComments(): string | undefined;
    getDocImageUrlsFront(): string[] | undefined;
    getDocImageUrlsBack(): string[] | undefined;
    validate(): string[];
}
//# sourceMappingURL=UpdateKycStatusRequestDto.d.ts.map