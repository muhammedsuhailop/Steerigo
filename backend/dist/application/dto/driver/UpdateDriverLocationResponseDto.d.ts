export declare class LocationCoordinatesDto {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
    constructor(latitude: number, longitude: number, address?: string);
}
export declare class UpdateDriverLocationResponseDto {
    readonly id: string;
    readonly driverId: string;
    readonly currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    readonly updatedAt: string;
    constructor(id: string, driverId: string, currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    }, updatedAt: string);
}
//# sourceMappingURL=UpdateDriverLocationResponseDto.d.ts.map