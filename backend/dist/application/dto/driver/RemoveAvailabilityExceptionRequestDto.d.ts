export declare class RemoveAvailabilityExceptionRequestDto {
    private readonly userId;
    private readonly exceptionId;
    constructor(userId: string, exceptionId: string);
    static fromRequest(userId: string, exceptionId: string): RemoveAvailabilityExceptionRequestDto;
    getUserId(): string;
    getExceptionId(): string;
    validate(): string[];
}
//# sourceMappingURL=RemoveAvailabilityExceptionRequestDto.d.ts.map