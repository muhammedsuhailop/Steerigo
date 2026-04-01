import { RideErrors } from "@domain/errors/RideErrors";

export class RemoveCouponDto {
  private readonly riderId: string;
  public readonly rideId: string;

  private constructor(riderId: string, rideId: string) {
    this.riderId = riderId;
    this.rideId = rideId;
  }

  static fromRequest(
    riderId: string,
    params: { rideId?: string },
  ): RemoveCouponDto {
    const dto = new RemoveCouponDto(riderId, params.rideId as string);
    dto.validate();
    return dto;
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw RideErrors.unauthorizedRideAccess(this.rideId ?? "unknown");
    }

    if (!this.rideId || this.rideId.trim().length === 0) {
      throw RideErrors.rideNotFound("unknown");
    }
  }
}
