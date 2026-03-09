import { LocationCoordinates } from "@domain/value-objects/Location";

export interface DriverLocationSnapshot {
  driverUserId: string;
  coordinates: LocationCoordinates;
  bearing?: number;
  speedKph?: number;
  accuracy?: number;
  updatedAt: Date;
}

export interface IDriverLocationRepository {
  saveDriverLocation(location: DriverLocationSnapshot): Promise<void>;
  getDriverLocation(
    driverUserId: string,
  ): Promise<DriverLocationSnapshot | null>;
}
