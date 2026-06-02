"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDriverLocationResponseDto = exports.LocationCoordinatesDto = void 0;
class LocationCoordinatesDto {
    constructor(latitude, longitude, address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }
}
exports.LocationCoordinatesDto = LocationCoordinatesDto;
class UpdateDriverLocationResponseDto {
    constructor(id, driverId, currentLocation, updatedAt) {
        this.id = id;
        this.driverId = driverId;
        this.currentLocation = currentLocation;
        this.updatedAt = updatedAt;
    }
}
exports.UpdateDriverLocationResponseDto = UpdateDriverLocationResponseDto;
//# sourceMappingURL=UpdateDriverLocationResponseDto.js.map