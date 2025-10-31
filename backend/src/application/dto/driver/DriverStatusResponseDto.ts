export class DriverStatusResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly status: string;
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
    status: string,
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
    this.status = status;
    this.availableFrom = availableFrom;
    this.availableTill = availableTill;
    this.currentLocation = currentLocation;
    this.updatedAt = updatedAt;
  }
}
