export class DriverStatusResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly availabilityStatus: string;
  readonly availableFrom: Date;
  readonly availableTill: Date | null;
  readonly currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  readonly updatedAt: Date;

  constructor(
    id: string,
    driverId: string,
    availabilityStatus: string,
    availableFrom: Date,
    availableTill: Date | null,
    currentLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    },
    updatedAt: Date
  ) {
    this.id = id;
    this.driverId = driverId;
    this.availabilityStatus = availabilityStatus;
    this.availableFrom = availableFrom;
    this.availableTill = availableTill;
    this.currentLocation = currentLocation;
    this.updatedAt = updatedAt;
  }
}
