import { AvailabilityStatus } from "../value-objects/AvailabilityStatus";
import { Location } from "../value-objects/Location";

export class DriverAvailability {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private status: AvailabilityStatus,
    private availableFrom: Date,
    private availableTill: Date,
    private currentLocation: Location,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  static create(
    id: string,
    driverId: string,
    availableFrom: Date,
    availableTill: Date,
    currentLocation: Location
  ): DriverAvailability {
    this.validateSchedule(availableFrom, availableTill);

    return new DriverAvailability(
      id,
      driverId,
      AvailabilityStatus.AVAILABLE,
      availableFrom,
      availableTill,
      currentLocation
    );
  }

  // Factory method for reconstructing from database
  static fromData(data: {
    id: string;
    driverId: string;
    status: AvailabilityStatus;
    availableFrom: Date;
    availableTill: Date;
    currentLocation: Location;
    createdAt: Date;
    updatedAt: Date;
  }): DriverAvailability {
    return new DriverAvailability(
      data.id,
      data.driverId,
      data.status,
      data.availableFrom,
      data.availableTill,
      data.currentLocation,
      data.createdAt,
      data.updatedAt
    );
  }

  private static validateSchedule(
    availableFrom: Date,
    availableTill: Date
  ): void {
    const now = new Date();

    if (availableFrom < now) {
      throw new Error("Available from time cannot be in the past");
    }

    if (availableTill <= availableFrom) {
      throw new Error("Available till time must be after available from time");
    }

    const maxDuration = 24 * 60 * 60 * 1000; // 24 hours
    if (availableTill.getTime() - availableFrom.getTime() > maxDuration) {
      throw new Error("Availability duration cannot exceed 24 hours");
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getDriverId(): string {
    return this.driverId;
  }

  getStatus(): AvailabilityStatus {
    return this.status;
  }

  getAvailableFrom(): Date {
    return this.availableFrom;
  }

  getAvailableTill(): Date {
    return this.availableTill;
  }

  getCurrentLocation(): Location {
    return this.currentLocation;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateStatus(newStatus: AvailabilityStatus): void {
    if (this.status === newStatus) {
      throw new Error(`Driver is already ${newStatus.toLowerCase()}`);
    }

    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  updateLocation(newLocation: Location): void {
    if (this.currentLocation.equals(newLocation)) {
      throw new Error("Location is already up to date");
    }

    this.currentLocation = newLocation;
    this.updatedAt = new Date();
  }

  updateSchedule(availableFrom: Date, availableTill: Date): void {
    DriverAvailability.validateSchedule(availableFrom, availableTill);

    this.availableFrom = availableFrom;
    this.availableTill = availableTill;
    this.updatedAt = new Date();
  }

  private canTransitionTo(newStatus: AvailabilityStatus): boolean {
    const allowedTransitions = {
      [AvailabilityStatus.OFFLINE]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.SCHEDULED,
      ],
      [AvailabilityStatus.AVAILABLE]: [
        AvailabilityStatus.BUSY,
        AvailabilityStatus.OFFLINE,
      ],
      [AvailabilityStatus.BUSY]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.OFFLINE,
      ],
      [AvailabilityStatus.SCHEDULED]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.BUSY,
        AvailabilityStatus.OFFLINE,
      ],
    };

    return allowedTransitions[this.status]?.includes(newStatus) ?? false;
  }

  // Query methods
  isAvailable(): boolean {
    return (
      this.status === AvailabilityStatus.AVAILABLE && this.isWithinSchedule()
    );
  }

  isBusy(): boolean {
    return this.status === AvailabilityStatus.BUSY;
  }

  isOffline(): boolean {
    return this.status === AvailabilityStatus.OFFLINE;
  }

  isWithinSchedule(): boolean {
    const now = new Date();
    return now >= this.availableFrom && now <= this.availableTill;
  }

  isExpired(): boolean {
    return new Date() > this.availableTill;
  }

  getRemainingTime(): number {
    const now = new Date();
    return Math.max(0, this.availableTill.getTime() - now.getTime());
  }
}
