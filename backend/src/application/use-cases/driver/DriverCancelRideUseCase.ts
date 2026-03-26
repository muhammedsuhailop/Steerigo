import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { DriverCancelRideDto } from "@application/dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "@application/dto/driver/DriverCancelRideResponseDto";
import {
  ICancellationChargeService,
  DriverCancellationContext,
} from "@application/services/ICancellationChargeService";
import { IEventBus } from "@application/services/IEventBus";
import { Logger } from "@shared/utils/Logger";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { RideCancellationErrors } from "@domain/errors/RideCancellationErrors";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";

@injectable()
export class DriverCancelRideUseCase
  implements
    IUseCase<DriverCancelRideDto, Promise<Result<DriverCancelRideResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,

    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,

    @inject(TYPES.CancellationChargeService)
    private readonly cancellationChargeService: ICancellationChargeService,

    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: DriverCancelRideDto,
  ): Promise<Result<DriverCancelRideResponseDto>> {
    const userId = dto.getUserId();
    const rideId = dto.getRideId();
    const reason = dto.reason;
    const now = new Date();

    try {
      Logger.info("Driver cancellation requested", { userId, rideId, reason });

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(RideCancellationErrors.driverNotFound(userId));
      }
      const driverId = driver.getId().toString();

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(RideCancellationErrors.rideNotFound(rideId));
      }

      if (ride.getDriverId() !== driverId) {
        return Result.failure(
          RideCancellationErrors.unauthorizedCancellation(rideId),
        );
      }

      if (ride.isCancelled()) {
        return Result.failure(
          RideCancellationErrors.rideAlreadyCancelled(rideId),
        );
      }

      if (ride.isCompleted()) {
        return Result.failure(
          RideCancellationErrors.cannotCancelCompletedRide(rideId),
        );
      }

      const arrivedAt = ride.getArrivedAt();
      const isDriverArrived = !!arrivedAt;

      let waitTimeMinutes = 0;
      if (arrivedAt) {
        const diffMs = now.getTime() - arrivedAt.getTime();
        waitTimeMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      }

      const context: DriverCancellationContext = {
        isDriverArrived,
        isTripStarted: ride.isStarted(),
        waitTimeMinutes,
      };

      Logger.debug("Driver cancellation context built", { rideId, ...context });

      let outcome;
      try {
        outcome =
          await this.cancellationChargeService.calculateDriverCancellationOutcome(
            {
              fareBreakdown: ride.getFareBreakdown(),
              context,
              searchDate: now,
            },
          );
      } catch (err) {
        return Result.failure(
          RideCancellationErrors.chargeCalculationFailed(
            rideId,
            err instanceof Error ? err.message : String(err),
          ),
        );
      }

      const { riderCharge, driverPenalty } = outcome;

      const resolvedFareBreakdown: FareBreakdown =
        riderCharge.getAmount() === 0
          ? FareBreakdown.zero(riderCharge.getCurrency())
          : FareBreakdown.forCancellation(riderCharge);

      try {
        ride.cancelByDriver(resolvedFareBreakdown);
      } catch (err) {
        return Result.failure(
          RideCancellationErrors.fareResetFailed(
            rideId,
            err instanceof Error ? err.message : String(err),
          ),
        );
      }

      if (riderCharge.getAmount() === 0) {
        ride.updatePaymentStatus(PaymentStatus.SUCCESS);
      }

      await this.rideRepository.save(ride);

      let penaltyDeducted = false;
      let penaltyAddedToArrears = false;

      if (driverPenalty.getAmount() > 0) {
        try {
          const wallet = await this.walletRepository.findByOwner(
            driverId,
            WalletOwnerType.DRIVER,
          );

          if (!wallet) {
            Logger.warn(
              "Driver wallet not found, penalty flagged for arrears",
              {
                driverId,
                rideId,
              },
            );
            penaltyAddedToArrears = true;
          } else {
            const hasSufficientBalance =
              wallet.getAvailableBalance().getAmount() >=
              driverPenalty.getAmount();

            if (hasSufficientBalance) {
              wallet.debit(driverPenalty);
              await this.walletRepository.save(wallet);
              penaltyDeducted = true;

              Logger.info("Driver penalty deducted from wallet", {
                driverId,
                rideId,
                penaltyAmount: driverPenalty.getAmount(),
                currency: driverPenalty.getCurrency(),
                remainingBalance: wallet.getAvailableBalance().getAmount(),
              });
            } else {
                //TODO
              penaltyAddedToArrears = true;
              Logger.warn("Insufficient available balance for driver penalty", {
                driverId,
                rideId,
                penaltyAmount: driverPenalty.getAmount(),
                availableBalance: wallet.getAvailableBalance().getAmount(),
              });
            }
          }
        } catch (err) {
          penaltyAddedToArrears = true;
          Logger.error("Driver wallet deduction failed unexpectedly", {
            driverId,
            rideId,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      await this.eventBus.publish({
        type: "RideCancelledByDriver",
        occurredAt: now,
        payload: {
          rideId: ride.getRideId(),
          riderId: ride.getRiderId(),
          driverId,
          driverUserId: userId,
          status: ride.getStatus(),
          reason,
          riderChargeAmount: riderCharge.getAmount(),
          riderChargeCurrency: riderCharge.getCurrency(),
          driverPenaltyAmount: driverPenalty.getAmount(),
          driverPenaltyCurrency: driverPenalty.getCurrency(),
          penaltyDeducted,
          penaltyAddedToArrears,
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

      Logger.info("Ride cancelled by driver", {
        userId,
        driverId,
        rideId: ride.getRideId(),
        status: ride.getStatus(),
        paymentStatus: ride.getPaymentStatus(),
        resolvedRiderFare: ride.getFareBreakdown().getTotalFare().getAmount(),
        driverPenalty: driverPenalty.getAmount(),
        penaltyDeducted,
        penaltyAddedToArrears,
      });

      const message =
        driverPenalty.getAmount() > 0
          ? penaltyDeducted
            ? "Ride cancelled. A cancellation penalty has been deducted from your wallet."
            : "Ride cancelled. A cancellation penalty could not be deducted and will be applied later."
          : "Ride cancelled with no penalty applied.";

      return Result.success({
        rideId: ride.getRideId(),
        status: ride.getStatus(),
        reason,
        riderCharge: {
          amount: riderCharge.getAmount(),
          currency: riderCharge.getCurrency(),
        },
        driverPenalty: {
          amount: driverPenalty.getAmount(),
          currency: driverPenalty.getCurrency(),
        },
        penaltyDeducted,
        penaltyAddedToArrears,
        message,
      });
    } catch (error) {
      Logger.error("Unexpected error during driver ride cancellation", {
        userId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as DomainError);
    }
  }
}
