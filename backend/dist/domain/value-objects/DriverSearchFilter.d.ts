import { GearType, BodyType } from "./VehicleType";
export declare class DriverSearchFilter {
    private readonly gearType;
    private readonly bodyType;
    private readonly minRating;
    private constructor();
    static create(gearType?: GearType | string, bodyType?: BodyType | string, minRating?: number): DriverSearchFilter;
    static empty(): DriverSearchFilter;
    private static validateRating;
    hasFilters(): boolean;
    getGearType(): GearType | null;
    getBodyType(): BodyType | null;
    getMinRating(): number;
    matches(driverGearTypes: GearType[], driverBodyTypes: BodyType[], driverRating: number): boolean;
}
//# sourceMappingURL=DriverSearchFilter.d.ts.map