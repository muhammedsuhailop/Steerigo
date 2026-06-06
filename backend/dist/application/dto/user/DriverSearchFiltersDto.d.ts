export declare class DriverSearchFiltersDto {
    readonly gearType?: string | undefined;
    readonly bodyType?: string | undefined;
    readonly minRating?: number | undefined;
    constructor(gearType?: string | undefined, bodyType?: string | undefined, minRating?: number | undefined);
    hasFilters(): boolean;
    validate(): string[];
}
//# sourceMappingURL=DriverSearchFiltersDto.d.ts.map