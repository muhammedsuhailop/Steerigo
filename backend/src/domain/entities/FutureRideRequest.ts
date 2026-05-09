import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

export class FutureRideRequest {
  private constructor(
    private id: string,
    private readonly riderId: string,
    private driverId: string | null,
    private readonly requestGroupId: string,
    private readonly pickup: Location,
    private readonly drop: Location,
    private readonly pickupTime: Date,
    private readonly rideType: RideType,
    private readonly fareBreakdown: FareBreakdown,
    private status: FutureRideRequestStatus,
    private readonly pickupETA: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    riderId: string;
    requestGroupId: string;
    pickup: Location;
    drop: Location;
    pickupTime: Date;
    searchStartTime: Date;
    rideType: RideType;
    fareBreakdown: FareBreakdown;
    pickupETA: string;
  }): FutureRideRequest {
    if (params.pickupTime <= new Date()) {
      throw new Error("Pickup time must be future date");
    }

    if (params.searchStartTime >= params.pickupTime) {
      throw new Error("Search start time must be before pickup time");
    }

    if (params.fareBreakdown.getTotalFare().getAmount() <= 0) {
      throw new Error("Total fare must be positive");
    }

    return new FutureRideRequest(
      "",
      params.riderId,
      null,
      params.requestGroupId,
      params.pickup,
      params.drop,
      params.pickupTime,
      params.rideType,
      params.fareBreakdown,
      FutureRideRequestStatus.PENDING,
      params.pickupETA,
    );
  }

  static fromData(data: {
    id: string;
    riderId: string;
    driverId: string | null;
    requestGroupId: string;
    pickup: Location;
    drop: Location;
    pickupTime: Date;
    rideType: RideType;
    fareBreakdown: FareBreakdown;
    status: FutureRideRequestStatus;
    pickupETA: string;
    createdAt: Date;
    updatedAt: Date;
  }): FutureRideRequest {
    return new FutureRideRequest(
      data.id,
      data.riderId,
      data.driverId,
      data.requestGroupId,
      data.pickup,
      data.drop,
      data.pickupTime,
      data.rideType,
      data.fareBreakdown,
      data.status,
      data.pickupETA,
      data.createdAt,
      data.updatedAt,
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getRiderId(): string {
    return this.riderId;
  }

  getDriverId(): string | null {
    return this.driverId;
  }

  getRequestGroupId(): string {
    return this.requestGroupId;
  }

  getPickup(): Location {
    return this.pickup;
  }

  getDrop(): Location {
    return this.drop;
  }

  getPickupTime(): Date {
    return this.pickupTime;
  }

  getRideType(): RideType {
    return this.rideType;
  }

  getFareBreakdown(): FareBreakdown {
    return this.fareBreakdown;
  }

  getStatus(): FutureRideRequestStatus {
    return this.status;
  }

  getPickupETA(): string {
    return this.pickupETA;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Behaviors

  assignDriver(driverId: string): void {
    if (this.status !== FutureRideRequestStatus.PENDING) {
      throw new Error("Only pending request can assign driver");
    }

    this.driverId = driverId;
    this.status = FutureRideRequestStatus.MATCHED;
    this.updatedAt = new Date();
  }

  markAccepted(): void {
    this.status = FutureRideRequestStatus.ACCEPTED;
    this.updatedAt = new Date();
  }

  markRejected(): void {
    this.status = FutureRideRequestStatus.REJECTED;
    this.updatedAt = new Date();
  }

  markExpired(): void {
    this.status = FutureRideRequestStatus.EXPIRED;
    this.updatedAt = new Date();
  }

  markCancelled(): void {
    this.status = FutureRideRequestStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  markCompleted(): void {
    this.status = FutureRideRequestStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  setId(id: string): void {
    this.id = id;
  }
}
