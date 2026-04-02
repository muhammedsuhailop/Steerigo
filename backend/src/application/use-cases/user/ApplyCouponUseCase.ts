import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import {
  ICouponValidationService,
  CouponValidationResult,
} from "@application/services/ICouponValidationService";
import { RideErrors } from "@domain/errors/RideErrors";
import { CouponErrors } from "@domain/errors/CouponErrors";
import { ApplyCouponDto } from "@application/dto/user/ApplyCouponDto";
import { ApplyCouponResponseDto } from "@application/dto/user/ApplyCouponResponseDto";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { IEventBus } from "@application/services/IEventBus";
import { RideFareUpdatedEvent } from "@application/events/RideEvents";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";

@injectable()
export class ApplyCouponUseCase
  implements IUseCase<ApplyCouponDto, Promise<Result<ApplyCouponResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.CouponValidationService)
    private readonly couponValidationService: ICouponValidationService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(dto: ApplyCouponDto): Promise<Result<ApplyCouponResponseDto>> {
    const riderId = dto.getRiderId();
    const rideId = dto.rideId;
    const couponCode = dto.couponCode;

    try {
      Logger.info("Apply coupon requested", { riderId, rideId, couponCode });

      const ride = await this.rideRepository.findByRideId(rideId);

      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      if (ride.getRiderId() !== riderId) {
        return Result.failure(RideErrors.unauthorizedRideAccess(rideId));
      }

      const isRecalculation = ride.isCompleted();

      const isEligibleForCoupon =
        ride.isAccepted() ||
        ride.isArrived() ||
        ride.isStarted() ||
        ride.isCompleted();

      if (!isEligibleForCoupon) {
        return Result.failure(
          RideErrors.rideNotEligibleForCoupon(rideId, ride.getStatus()),
        );
      }

      if (ride.getPaymentStatus() !== PaymentStatus.PENDING) {
        return Result.failure(
          CouponErrors.cannotApplyCouponAfterPayment(rideId),
        );
      }

      if (ride.hasCouponApplied() && !isRecalculation) {
        return Result.failure(CouponErrors.couponAlreadyAppliedToRide(rideId));
      }

      const now = new Date();
      const rideAmount = ride.getFare();

      let validationResult: CouponValidationResult;

      try {
        validationResult =
          await this.couponValidationService.validateAndCalculate(
            couponCode,
            rideAmount,
            riderId,
            now,
          );
      } catch (validationError) {
        return Result.failure(validationError as DomainError);
      }

      const { coupon, discountAmount } = validationResult;

      try {
        ride.applyCoupon(
          coupon.getId(),
          coupon.getCode(),
          discountAmount,
          coupon.getDiscountType(),
          isRecalculation,
        );
      } catch (applyError) {
        return Result.failure(
          new DomainError(
            applyError instanceof Error
              ? applyError.message
              : String(applyError),
            "COUPON_APPLY_FAILED",
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

      const driver = await this.driverRepository.findById(ride.getDriverId());
      const driverUserId = driver?.getUserId() ?? "";

      if (isRecalculation) {
        const fareUpdatedEvent: RideFareUpdatedEvent = {
          type: "RideFareUpdated",
          occurredAt: new Date(),
          payload: {
            rideId: ride.getRideId(),
            driverUserId: driverUserId,
            driverId: ride.getDriverId(),
            couponCode: coupon.getCode(),
            discountAmount: discountAmount,
            payableAmount: ride.getPayableAmount(),
            totalFare: ride.getFare(),
            currency: ride.getCurrency(),
            couponType: coupon.getDiscountType(),
          },
        };
        await this.eventBus.publish(fareUpdatedEvent);
      }

      Logger.info("Coupon applied successfully", {
        riderId,
        rideId,
        couponCode,
        discountAmount,
        payableAmount: ride.getPayableAmount(),
      });

      return Result.success({
        rideId,
        couponCode: coupon.getCode(),
        discountType: coupon.getDiscountType(),
        originalFare: ride.getFare(),
        discountAmount,
        payableAmount: ride.getPayableAmount(),
        currency: ride.getCurrency(),
        message: "Coupon applied successfully",
      });
    } catch (error) {
      Logger.error("Unexpected error applying coupon", {
        riderId,
        rideId,
        couponCode,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as DomainError);
    }
  }
}
