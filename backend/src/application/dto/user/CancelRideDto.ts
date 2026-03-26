import { RideCancellationErrors } from "@domain/errors/RideCancellationErrors";
import { RideCancellationReason } from "@domain/value-objects/RideCancellationReason";

interface CancelRideRequestBody {
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
    const reason = parsedBody.reason as RideCancellationReason;
    const effectiveRideId = params.rideId;

    const dto = new CancelRideDto(riderId, effectiveRideId as string, reason);
    dto.validate();
    return dto;
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw RideCancellationErrors.unauthorizedCancellation("unknown");
    }

    if (!this.rideId || this.rideId.trim().length === 0) {
      throw RideCancellationErrors.rideNotFound("unknown");
    }

    if (
      !this.reason ||
      !Object.values(RideCancellationReason).includes(this.reason)
    ) {
      throw RideCancellationErrors.invalidCancellationReason(this.reason ?? "");
    }
  }
}
