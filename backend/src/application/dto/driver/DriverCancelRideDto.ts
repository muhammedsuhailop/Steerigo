import { RideCancellationErrors } from "@domain/errors/RideCancellationErrors";
import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";

interface DriverCancelRideRequestBody {
  reason?: DriverCancellationReason | string;
}

export class DriverCancelRideDto {
  private readonly userId: string;
  public readonly rideId: string;
  public readonly reason: DriverCancellationReason;

  private constructor(
    userId: string,
    rideId: string,
    reason: DriverCancellationReason,
  ) {
    this.userId = userId;
    this.rideId = rideId;
    this.reason = reason;
  }

  static fromRequest(
    userId: string,
    params: { rideId?: string },
    body: unknown,
  ): DriverCancelRideDto {
    const parsedBody = (body ?? {}) as DriverCancelRideRequestBody;
    const reason = parsedBody.reason as DriverCancellationReason;
    const dto = new DriverCancelRideDto(
      userId,
      params.rideId as string,
      reason,
    );
    dto.validate();
    return dto;
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }

  validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw RideCancellationErrors.unauthorizedCancellation(
        this.rideId ?? "unknown",
      );
    }

    if (!this.rideId || this.rideId.trim().length === 0) {
      throw RideCancellationErrors.rideNotFound("unknown");
    }

    if (
      !this.reason ||
      !Object.values(DriverCancellationReason).includes(this.reason)
    ) {
      throw RideCancellationErrors.invalidCancellationReason(
        this.reason ? String(this.reason) : "undefined",
      );
    }
  }
}
