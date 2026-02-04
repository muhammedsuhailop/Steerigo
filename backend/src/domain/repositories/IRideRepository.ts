import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { Ride } from "@domain/entities/Ride";
import { RideStatus } from "@domain/value-objects/RideStatus";

export interface IRideRepository
  extends IReadOnlyRepository<Ride, string>,
    IWriteOnlyRepository<Ride, string> {
  findByRideId(rideId: string): Promise<Ride | null>;

  findActiveRideByDriverId(driverId: string): Promise<Ride | null>;

  findActiveRideByRiderId(riderId: string): Promise<Ride | null>;

  findByDriverId(driverId: string, status?: RideStatus): Promise<Ride[]>;

  findByRiderId(riderId: string, status?: RideStatus): Promise<Ride[]>;
}
