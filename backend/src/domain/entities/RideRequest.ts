import { Location } from "@domain/value-objects/Location";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { RideType } from "@domain/value-objects/RideType";

export class RideRequest {
  private constructor(
    private readonly id: string,
    private readonly requestId: string,
    private readonly driverId: string,
    private readonly riderId: string,
    private readonly pickup: Location,
    private readonly drop: Location,
    private readonly pickupTime: Date,
    private readonly rideType: RideType,
    private readonly fare: number,
    private status: RideRequestStatus,
    private readonly pickupETA: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  static create(
    id: string,
    requestId: string,
    driverId: string,
    riderId: string,
    pickup: Location,
    drop: Location,
    pickupTime: Date,
    rideType: RideType,
    fare: number,
    pickupETA: string
  ): RideRequest {
    if (fare < 0) {
      throw new Error("Fare cannot be negative");
    }

    return new RideRequest(
      id,
      requestId,
      driverId,
      riderId,
      pickup,
      drop,
      pickupTime,
      rideType,
      fare,
      RideRequestStatus.PENDING,
      pickupETA
    );
  }

  static fromData(data: {
    id: string;
    requestId: string;
    driverId: string;
    riderId: string;
    pickup: Location;
    drop: Location;
    pickupTime: Date;
    rideType: RideType;
    fare: number;
    status: RideRequestStatus;
    pickupETA: string;
    createdAt: Date;
    updatedAt: Date;
  }): RideRequest {
    return new RideRequest(
      data.id,
      data.requestId,
      data.driverId,
      data.riderId,
      data.pickup,
      data.drop,
      data.pickupTime,
      data.rideType,
      data.fare,
      data.status,
      data.pickupETA,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getRequestId(): string {
    return this.requestId;
  }

  getDriverId(): string {
    return this.driverId;
  }

  getRiderId(): string {
    return this.riderId;
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

  getRideType(): string {
    return this.rideType;
  }

  getFare(): number {
    return this.fare;
  }

  getStatus(): RideRequestStatus {
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

  // Status check methods
  isPending(): boolean {
    return this.status === RideRequestStatus.PENDING;
  }

  isAccepted(): boolean {
    return this.status === RideRequestStatus.ACCEPTED;
  }

  isRejected(): boolean {
    return this.status === RideRequestStatus.REJECTED;
  }

  isExpired(): boolean {
    return this.status === RideRequestStatus.EXPIRED;
  }

  // Status mutation methods
  markAsAccepted(): void {
    if (!this.isPending()) {
      throw new Error("Only pending requests can be accepted");
    }
    this.status = RideRequestStatus.ACCEPTED;
    this.updatedAt = new Date();
  }

  markAsRejected(): void {
    if (!this.isPending()) {
      throw new Error("Only pending requests can be rejected");
    }
    this.status = RideRequestStatus.REJECTED;
    this.updatedAt = new Date();
  }

  markAsExpired(): void {
    if (!this.isPending()) {
      throw new Error("Only pending requests can be expired");
    }
    this.status = RideRequestStatus.EXPIRED;
    this.updatedAt = new Date();
  }
}
