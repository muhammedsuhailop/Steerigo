export interface SearchLocation {
    latitude: number;
    longitude: number;
}
export declare class SearchCriteria {
    private readonly location;
    private readonly searchDate;
    private readonly radiusKm;
    private readonly timeRequiredMinutes;
    private constructor();
    static create(location: SearchLocation, searchDate: Date, radiusKm?: number, timeRequiredMinutes?: number): SearchCriteria;
    private static validateLocation;
    private static validateSearchDate;
    private static validateRadius;
    private static validateTimeRequired;
    getLocation(): SearchLocation;
    getLatitude(): number;
    getLongitude(): number;
    getSearchDate(): Date;
    getRadiusKm(): number;
    getTimeRequiredMinutes(): number;
    getSearchWindow(): {
        startTime: Date;
        endTime: Date;
    };
}
//# sourceMappingURL=SearchCriteria.d.ts.map