export declare class FindNearbyDriversRequestDto {
    readonly latitude: number;
    readonly longitude: number;
    readonly searchDate: Date;
    readonly timeRequired: number;
    readonly radiusKm: number;
    readonly gearType: string;
    readonly bodyType: string;
    readonly limit: number;
    constructor(latitude: number, longitude: number, searchDate: Date, timeRequired: number, radiusKm?: number, gearType?: string, bodyType?: string, limit?: number);
    static fromRequest(requestBody: unknown): FindNearbyDriversRequestDto;
    validate(): void;
    getSearchWindow(): {
        startTime: Date;
        endTime: Date;
    };
    getTotalDurationMinutes(): number;
}
//# sourceMappingURL=FindNearbyDriversRequestDto.d.ts.map