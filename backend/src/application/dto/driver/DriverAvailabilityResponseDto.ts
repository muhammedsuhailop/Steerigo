export class DriverAvailabilityLocationDto {
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;

  constructor(latitude: number, longitude: number, address?: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
  }
}

export class DriverAvailabilityResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly availabilityStatus: string;
  readonly availableFrom: string;
  readonly availableTill: string;
  readonly currentLocation: DriverAvailabilityLocationDto;
  readonly createdAt: string;

  constructor(params: {
    id: string;
    driverId: string;
    availabilityStatus: string;
    availableFrom: string;
    availableTill: string;
    currentLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    createdAt: string;
  }) {
    this.id = params.id;
    this.driverId = params.driverId;
    this.availabilityStatus = params.availabilityStatus;
    this.availableFrom = params.availableFrom;
    this.availableTill = params.availableTill;
    this.currentLocation = new DriverAvailabilityLocationDto(
      params.currentLocation.latitude,
      params.currentLocation.longitude,
      params.currentLocation.address
    );
    this.createdAt = params.createdAt;
  }
}
