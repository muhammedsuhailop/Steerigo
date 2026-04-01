import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { RideErrors } from "@domain/errors/RideErrors";
import { CouponErrors } from "@domain/errors/CouponErrors";
import { RemoveCouponDto } from "@application/dto/user/RemoveCouponDto";
import { RemoveCouponResponseDto } from "@application/dto/user/RemoveCouponResponseDto";

@injectable()
export class RemoveCouponUseCase
  implements IUseCase<RemoveCouponDto, Promise<Result<RemoveCouponResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
  ) {}

  async execute(
    dto: RemoveCouponDto,
  ): Promise<Result<RemoveCouponResponseDto>> {
    const riderId = dto.getRiderId();
    const rideId = dto.rideId;

    try {
      Logger.info("Remove coupon requested", { riderId, rideId });

      const ride = await this.rideRepository.findByRideId(rideId);

      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      if (ride.getRiderId() !== riderId) {
        return Result.failure(RideErrors.unauthorizedRideAccess(rideId));
      }

      if (!ride.isAccepted() && !ride.isArrived() && !ride.isStarted()) {
        return Result.failure(
          RideErrors.rideNotEligibleForCoupon(rideId, ride.getStatus()),
        );
      }

      if (!ride.hasCouponApplied()) {
        return Result.failure(CouponErrors.noCouponApplied(rideId));
      }

      try {
        ride.removeCoupon();
      } catch (removeError) {
        return Result.failure(
          new DomainError(
            removeError instanceof Error
              ? removeError.message
              : String(removeError),
            "COUPON_REMOVE_FAILED",
            {
              statusCode: 400,
              errorType: "VALIDATION_ERROR" as never,
              shouldLog: false,
              isOperational: true,
              category: "VALIDATION",
            },
          ),
        );
      }

      await this.rideRepository.save(ride);

      Logger.info("Coupon removed successfully", {
        riderId,
        rideId,
        payableAmount: ride.getPayableAmount(),
      });

      return Result.success({
        rideId,
        originalFare: ride.getFare(),
        payableAmount: ride.getPayableAmount(),
        currency: ride.getCurrency(),
        message: "Coupon removed successfully",
      });
    } catch (error) {
      Logger.error("Unexpected error removing coupon", {
        riderId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as DomainError);
    }
  }
}
