import { DomainError } from "@domain/errors/DomainError";
import { RideCancellationReason } from "@domain/value-objects/RideCancellationReason";

interface CancelRideRequestBody {
  rideId?: string;
  reason?: RideCancellationReason | string;
}

export class CancelRideDto {
  private readonly riderId: string;
  public readonly rideId: string;
  public readonly reason: RideCancellationReason;

  private constructor(
    riderId: string,
    rideId: string,
    reason: RideCancellationReason,
  ) {
    this.riderId = riderId;
    this.rideId = rideId;
    this.reason = reason;
  }

  static fromRequest(
    riderId: string,
    params: { rideId?: string },
    body: unknown,
  ): CancelRideDto {
    const parsedBody = (body ?? {}) as CancelRideRequestBody;

    const paramRideId = params.rideId;
    const bodyRideId = parsedBody.rideId;
    const reason = parsedBody.reason as RideCancellationReason;

    const effectiveRideId = paramRideId ?? bodyRideId;

    const dto = new CancelRideDto(riderId, effectiveRideId as string, reason);

    dto.validate();

    return dto;
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw new DomainError("Rider ID is required to cancel a ride");
    }

    if (!this.rideId || this.rideId.trim().length === 0) {
      throw new DomainError("Ride ID is required to cancel a ride");
    }

    if (!this.reason) {
      throw new DomainError("Cancellation reason is required");
    }

    const validReasons = Object.values(RideCancellationReason);
    if (!validReasons.includes(this.reason)) {
      throw new DomainError("Invalid ride cancellation reason");
    }
  }
}
