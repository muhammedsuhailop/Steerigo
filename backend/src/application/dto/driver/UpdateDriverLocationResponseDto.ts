export class LocationCoordinatesDto {
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;

  constructor(latitude: number, longitude: number, address?: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
  }
}

export class UpdateDriverLocationResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  readonly updatedAt: string;

  constructor(
    id: string,
    driverId: string,
    currentLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    },
    updatedAt: string
  ) {
    this.id = id;
    this.driverId = driverId;
    this.currentLocation = currentLocation;
    this.updatedAt = updatedAt;
  }
}
