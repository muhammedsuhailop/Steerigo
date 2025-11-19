export class SendRideRequestDto {
  constructor(
    public readonly riderId: string,
    public readonly driverId: string,
    public readonly pickupLatitude: number,
    public readonly pickupLongitude: number,
    public readonly pickupAddress: string | undefined,
    public readonly dropLatitude: number,
    public readonly dropLongitude: number,
    public readonly dropAddress: string | undefined,
    public readonly pickupTime: Date,
    public readonly rideType: string,
    public readonly fare: number,
    public readonly pickupETA: string
  ) {}

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw new Error("Rider ID is required");
    }

    if (!this.driverId || this.driverId.trim().length === 0) {
      throw new Error("Driver ID is required");
    }

    if (this.fare <= 0) {
      throw new Error("Fare must be positive");
    }

    if (
      this.pickupLatitude < -90 ||
      this.pickupLatitude > 90 ||
      this.pickupLongitude < -180 ||
      this.pickupLongitude > 180
    ) {
      throw new Error("Invalid pickup location coordinates");
    }

    if (
      this.dropLatitude < -90 ||
      this.dropLatitude > 90 ||
      this.dropLongitude < -180 ||
      this.dropLongitude > 180
    ) {
      throw new Error("Invalid drop location coordinates");
    }

    if (!["One Way", "Round Trip"].includes(this.rideType)) {
      throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
    }

    if (this.pickupTime < new Date()) {
      throw new Error("Pickup time must be in the future");
    }

    if (!this.pickupETA || this.pickupETA.trim().length === 0) {
      throw new Error("Pickup ETA is required");
    }
  }
}
