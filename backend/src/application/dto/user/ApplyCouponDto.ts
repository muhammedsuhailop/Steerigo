import { RideErrors } from "@domain/errors/RideErrors";
import { CouponErrors } from "@domain/errors/CouponErrors";

interface ApplyCouponRequestBody {
  couponCode?: string;
}

export class ApplyCouponDto {
  private readonly riderId: string;
  public readonly rideId: string;
  public readonly couponCode: string;

  private constructor(riderId: string, rideId: string, couponCode: string) {
    this.riderId = riderId;
    this.rideId = rideId;
    this.couponCode = couponCode;
  }

  static fromRequest(
    riderId: string,
    params: { rideId?: string },
    body: unknown,
  ): ApplyCouponDto {
    const parsedBody = (body ?? {}) as ApplyCouponRequestBody;
    const couponCode = parsedBody.couponCode?.trim().toUpperCase() ?? "";

    const dto = new ApplyCouponDto(
      riderId,
      params.rideId as string,
      couponCode,
    );
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

    if (!this.couponCode || this.couponCode.trim().length === 0) {
      throw CouponErrors.invalidCouponData("Coupon code is required");
    }
  }
}
