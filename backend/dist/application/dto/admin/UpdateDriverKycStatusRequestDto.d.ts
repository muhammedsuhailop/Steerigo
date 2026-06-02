import { KYCStatus } from "../../../domain/value-objects/KYCStatus";
export declare class UpdateDriverKycStatusRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(driverId: string, requestBody: unknown): UpdateDriverKycStatusRequestDto;
    getDriverId(): string;
    getKycStatus(): KYCStatus;
    getComments(): string | undefined;
    validate(): string[];
}
//# sourceMappingURL=UpdateDriverKycStatusRequestDto.d.ts.map