export declare class ScheduleAvailabilityRequestDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): ScheduleAvailabilityRequestDto;
    getUserId(): string;
    getAvailableFrom(): Date;
    getAvailableTill(): Date;
    getLocationData(): {
        latitude: number;
        longitude: number;
        address?: string;
    };
    validate(): string[];
}
//# sourceMappingURL=ScheduleAvailabilityRequestDto.d.ts.map