import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsCompletedDto } from "@application/dto/driver/MarkRideAsCompletedDto";
import { MarkRideAsCompletedResponseDto } from "@application/dto/driver/MarkRideAsCompletedResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideErrors } from "@domain/errors/RideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";

@injectable()
export class MarkRideAsCompletedUseCase
  implements
    IUseCase<
      MarkRideAsCompletedDto,
      Promise<Result<MarkRideAsCompletedResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.FareCalculationService)
    private fareCalculationService: IFareCalculationService,
  ) {}

  async execute(
    dto: MarkRideAsCompletedDto,
  ): Promise<Result<MarkRideAsCompletedResponseDto>> {
    const rideId = dto.getRideId();

    try {
      Logger.info("Marking ride as completed", {
        userId: dto.getUserId(),
        rideId,
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      if (ride.getDriverId() !== driverId) {
        return Result.failure(RideErrors.unauthorizedRideAccess(rideId));
      }

      if (!ride.isStarted()) {
        return Result.failure(
          RideErrors.invalidRideStatusTransition(
            ride.getStatus(),
            RideStatus.COMPLETED,
            rideId,
          ),
        );
      }

      const startedAt = ride.getStartedAt();
      if (!startedAt) {
        return Result.failure(
          RideErrors.invalidRideStatusTransition(
            ride.getStatus(),
            RideStatus.COMPLETED,
            rideId,
          ),
        );
      }

      const completedAt = new Date();
      const actualDurationMinutes = Math.ceil(
        (completedAt.getTime() - startedAt.getTime()) / (1000 * 60),
      );

      Logger.debug("Calculating final fare based on actual duration", {
        rideId,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        actualDurationMinutes,
      });

      const finalFareBreakdown =
        await this.fareCalculationService.calculateFare({
          durationMinutes: actualDurationMinutes,
          searchDate: completedAt,
        });

      ride.completeWithFareBreakdown(finalFareBreakdown);

      const updatedRide = await this.rideRepository.save(ride);

      Logger.info("Ride completed successfully", {
        rideId: updatedRide.getRideId(),
        driverId,
        actualDurationMinutes,
        durationHours: finalFareBreakdown.getDurationHours(),
        totalFare: updatedRide.getFare(),
      });

      await this.markDriverAsScheduled(driverId);

      const fareBreakdown = updatedRide.getFareBreakdown();

      const response: MarkRideAsCompletedResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDE_COMPLETED,
        data: {
          rideId: updatedRide.getRideId(),
          status: updatedRide.getStatus(),
          arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
          startedAt: updatedRide.getStartedAt()!.toISOString(),
          completedAt: updatedRide.getCompletedAt()!.toISOString(),
          fareBreakdown: {
            baseFare: fareBreakdown.getBaseFare().toJSON(),
            platformFee: fareBreakdown.getPlatformFee().toJSON(),
            taxes: {
              fare: {
                name: fareBreakdown.getFareTax().name,
                amount: fareBreakdown.getFareTax().amount.toJSON(),
              },
              platformFee: {
                name: fareBreakdown.getPlatformFeeTax().name,
                amount: fareBreakdown.getPlatformFeeTax().amount.toJSON(),
              },
            },
            totalFare: fareBreakdown.getTotalFare().toJSON(),
            durationHours: fareBreakdown.getDurationHours(),
            actualDurationMinutes,
          },
          riderId: updatedRide.getRiderId(),
          driverId: updatedRide.getDriverId(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error marking ride as completed", {
        userId: dto.getUserId(),
        rideId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return Result.failure(error as Error);
    }
  }

  private async markDriverAsScheduled(driverId: string): Promise<void> {
    try {
      const availability =
        await this.driverAvailabilityRepository.findActiveByDriverId(driverId);

      if (!availability) {
        Logger.warn(
          "No active availability record found when reverting driver to scheduled",
          {
            driverId,
          },
        );
        return;
      }

      if (availability.getStatus() === AvailabilityStatus.SCHEDULED) {
        Logger.debug("Driver availability already Scheduled", { driverId });
        return;
      }

      availability.updateStatus(AvailabilityStatus.SCHEDULED);
      await this.driverAvailabilityRepository.save(availability);

      Logger.info(
        "Driver availability reverted to SCHEDULED after ride completion",
        {
          driverId,
        },
      );
    } catch (error) {
      Logger.error("Failed to revert driver availability to SCHEDULED", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
