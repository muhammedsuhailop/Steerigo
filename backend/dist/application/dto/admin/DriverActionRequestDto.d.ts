export declare class DriverActionRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(driverId: string, requestBody: unknown): DriverActionRequestDto;
    getDriverId(): string;
    getAction(): "block" | "suspend" | "activate";
    getReason(): string | undefined;
    validate(): string[];
}
//# sourceMappingURL=DriverActionRequestDto.d.ts.map