import { AvailabilityStatus } from "../../../domain/value-objects/AvailabilityStatus";
export declare class UpdateStatusRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(requestBody: unknown): UpdateStatusRequestDto;
    getStatus(): AvailabilityStatus;
    getDriverId(): string;
}
//# sourceMappingURL=UpdateStatusRequestDto.d.ts.map