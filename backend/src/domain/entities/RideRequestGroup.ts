import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";

export class RideRequestGroup {
  private constructor(
    private readonly id: string,
    private readonly riderId: string,
    private readonly pickup: Location,
    private readonly drop: Location,
    private readonly timeRequired: number,
    private readonly rideType: RideType,
    private readonly estimatedFareAmount: number,
    private readonly estimatedFareCurrency: string,
    private candidateDriverIds: string[],
    private currentIndex: number,
    private status: RideRequestGroupStatus,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    riderId: string,
    pickup: Location,
    drop: Location,
    timeRequired: number,
    rideType: RideType,
    estimatedFareAmount: number,
    estimatedFareCurrency: string,
    candidateDriverIds: string[],
  ): RideRequestGroup {
    if (!id) {
      throw new Error("RideRequestGroup id is required");
    }

    if (candidateDriverIds.length === 0) {
      throw new Error(
        "RideRequestGroup must have at least one candidate driver",
      );
    }

    return new RideRequestGroup(
      id,
      riderId,
      pickup,
      drop,
      timeRequired,
      rideType,
      estimatedFareAmount,
      estimatedFareCurrency,
      [...candidateDriverIds],
      0,
      RideRequestGroupStatus.SEARCHING,
    );
  }

  static fromData(data: {
    id: string;
    riderId: string;
    pickup: Location;
    drop: Location;
    timeRequired: number;
    rideType: RideType;
    estimatedFareAmount: number;
    estimatedFareCurrency: string;
    candidateDriverIds: string[];
    currentIndex: number;
    status: RideRequestGroupStatus;
    createdAt: Date;
    updatedAt: Date;
  }): RideRequestGroup {
    return new RideRequestGroup(
      data.id,
      data.riderId,
      data.pickup,
      data.drop,
      data.timeRequired,
      data.rideType,
      data.estimatedFareAmount,
      data.estimatedFareCurrency,
      [...data.candidateDriverIds],
      data.currentIndex,
      data.status,
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

  getPickup(): Location {
    return this.pickup;
  }

  getDrop(): Location {
    return this.drop;
  }

  getTimeRequired(): number {
    return this.timeRequired;
  }

  getRideType(): RideType {
    return this.rideType;
  }

  getEstimatedFareAmount(): number {
    return this.estimatedFareAmount;
  }

  getEstimatedFareCurrency(): string {
    return this.estimatedFareCurrency;
  }

  getCandidateDriverIds(): string[] {
    return [...this.candidateDriverIds];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getStatus(): RideRequestGroupStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  markCompleted(): void {
    if (this.status === RideRequestGroupStatus.COMPLETED) {
      return;
    }
    this.status = RideRequestGroupStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  markExpired(): void {
    if (this.status === RideRequestGroupStatus.EXPIRED) {
      return;
    }
    this.status = RideRequestGroupStatus.EXPIRED;
    this.updatedAt = new Date();
  }

  markCancelled(): void {
    if (this.status === RideRequestGroupStatus.CANCELLED) {
      return;
    }
    this.status = RideRequestGroupStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  incrementCurrentIndex(): void {
    if (this.currentIndex < this.candidateDriverIds.length - 1) {
      this.currentIndex += 1;
      this.updatedAt = new Date();
    }
  }

  replaceCandidateDriverIds(candidateDriverIds: string[]): void {
    if (candidateDriverIds.length === 0) {
      throw new Error("candidateDriverIds cannot be empty");
    }
    this.candidateDriverIds = [...candidateDriverIds];
    this.currentIndex = 0;
    this.updatedAt = new Date();
  }
}
