export declare class UpdateLocationRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(requestBody: unknown): UpdateLocationRequestDto;
    getLocationData(): {
        latitude: number;
        longitude: number;
        address?: string;
    };
    getDriverId(): string;
}
//# sourceMappingURL=UpdateLocationRequestDto.d.ts.map