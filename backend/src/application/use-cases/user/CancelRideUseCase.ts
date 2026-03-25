import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { CancelRideDto } from "@application/dto/user/CancelRideDto";
import { CancelRideResponseDto } from "@application/dto/user/CancelRideResponseDto";
import {
  ICancellationChargeService,
  RiderCancellationContext,
} from "@application/services/ICancellationChargeService";
import { IEventBus } from "@application/services/IEventBus";
import { Logger } from "@shared/utils/Logger";
import { Money } from "@domain/value-objects/Money";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";

@injectable()
export class CancelRideUseCase
  implements IUseCase<CancelRideDto, Promise<Result<CancelRideResponseDto>>>
{
  private static readonly GRACE_PERIOD_MINUTES = 2;

  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,

    @inject(TYPES.CancellationChargeService)
    private readonly cancellationChargeService: ICancellationChargeService,

    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(dto: CancelRideDto): Promise<Result<CancelRideResponseDto>> {
    const riderId = dto.getRiderId();
    const rideId = dto.rideId;
    const reason = dto.reason;
    const now = new Date();

    try {
      Logger.info("Rider cancellation requested", { riderId, rideId, reason });

      const ride = await this.rideRepository.findByRideId(rideId);

      if (!ride) {
        return Result.failure(new DomainError("Ride not found"));
      }

      if (ride.getRiderId() !== riderId) {
        return Result.failure(
          new DomainError("You are not authorized to cancel this ride"),
        );
      }

      if (ride.isCancelled()) {
        return Result.failure(new DomainError("Ride is already cancelled"));
      }

      if (ride.isCompleted()) {
        return Result.failure(
          new DomainError("Completed rides cannot be cancelled"),
        );
      }

      if (ride.isStarted()) {
        return Result.failure(
          new DomainError("Started rides cannot be cancelled by rider"),
        );
      }

      const arrivedAt = ride.getArrivedAt();
      const isDriverArrived = !!arrivedAt;

      let waitTimeMinutes = 0;
      if (arrivedAt) {
        const diffMs = now.getTime() - arrivedAt.getTime();
        waitTimeMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      }

      const isWithinGracePeriod =
        isDriverArrived &&
        waitTimeMinutes <= CancelRideUseCase.GRACE_PERIOD_MINUTES;

      const context: RiderCancellationContext = {
        isBeforeMatch: ride.isRequested(),
        isWithinGracePeriod,
        isDriverArrived,
        waitTimeMinutes,
        isDriverDelayed: false,
      };

      Logger.debug("Ride FareBreakdown before cancellation", {
        rideId,
        baseFare: ride.getFareBreakdown()?.getBaseFare()?.getAmount(),
        totalFare: ride.getFareBreakdown()?.getTotalFare()?.getAmount(),
      });

      const fareBreakdown = ride.getFareBreakdown();
      const cancellationFee: Money =
        await this.cancellationChargeService.calculateRiderCancellationCharge({
          fareBreakdown,
          context,
          searchDate: now,
        });

      const resolvedFareBreakdown: FareBreakdown =
        cancellationFee.getAmount() === 0
          ? FareBreakdown.zero(cancellationFee.getCurrency())
          : FareBreakdown.forCancellation(cancellationFee);

      ride.cancelWithFareBreakdown(resolvedFareBreakdown);

      if (cancellationFee.getAmount() === 0) {
        ride.updatePaymentStatus(PaymentStatus.SUCCESS);
      }

      await this.rideRepository.save(ride);

      let driverUserId: string | null = null;
      const driverId = ride.getDriverId();

      if (driverId) {
        const driver = await this.driverRepository.findById(driverId);
        driverUserId = driver?.getUserId() ?? null;
      }

      await this.eventBus.publish({
        type: "RideCancelled",
        occurredAt: now,
        payload: {
          rideId: ride.getRideId(),
          riderId: ride.getRiderId(),
          driverId,
          driverUserId: driverUserId as string,
          status: ride.getStatus(),
          reason,
          cancellationFeeAmount: cancellationFee.getAmount(),
          cancellationFeeCurrency: cancellationFee.getCurrency(),
          cancelledAt: now.toISOString(),
          pickup: {
            latitude: ride.getPickup().getLatitude(),
            longitude: ride.getPickup().getLongitude(),
            address: ride.getPickup().getAddress(),
          },
          drop: {
            latitude: ride.getDrop().getLatitude(),
            longitude: ride.getDrop().getLongitude(),
            address: ride.getDrop().getAddress(),
          },
        },
      });

      Logger.info("Ride cancelled by rider", {
        riderId,
        rideId: ride.getRideId(),
        status: ride.getStatus(),
        paymentStatus: ride.getPaymentStatus(),
        fee: cancellationFee.getAmount(),
        currency: cancellationFee.getCurrency(),
      });

      return Result.success({
        rideId: ride.getRideId(),
        status: ride.getStatus(),
        reason,
        cancellationFee: {
          amount: cancellationFee.getAmount(),
          currency: cancellationFee.getCurrency(),
        },
        feeCharged: false,
        addedToArrears: false,
        message:
          cancellationFee.getAmount() > 0
            ? "Ride cancelled. A cancellation fee may be charged."
            : "Ride cancelled successfully with no cancellation fee.",
      });
    } catch (error) {
      Logger.error("Error processing rider ride cancellation", {
        riderId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as DomainError);
    }
  }
}
