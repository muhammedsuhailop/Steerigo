export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    address?: string;
}
export declare class Location {
    private readonly latitude;
    private readonly longitude;
    private readonly address?;
    private constructor();
    static create(coordinates: LocationCoordinates): Location;
    static createDummy(): Location;
    private static validateCoordinates;
    getLatitude(): number;
    getLongitude(): number;
    getAddress(): string | undefined;
    getCoordinates(): LocationCoordinates;
    equals(other: Location): boolean;
    distanceTo(other: Location): number;
    private toRad;
    toString(): string;
}
//# sourceMappingURL=Location.d.ts.map