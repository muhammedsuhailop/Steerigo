import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsStartedDto } from "@application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "@application/dto/driver/MarkRideAsStartedResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideErrors } from "@domain/errors/RideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { RideStatus } from "@domain/value-objects/RideStatus";

@injectable()
export class MarkRideAsStartedUseCase
  implements
    IUseCase<
      MarkRideAsStartedDto,
      Promise<Result<MarkRideAsStartedResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
  ) {}

  async execute(
    dto: MarkRideAsStartedDto,
  ): Promise<Result<MarkRideAsStartedResponseDto>> {
    const rideId = dto.getRideId();

    try {
      Logger.info("Marking ride as started", {
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

      if (!ride.isAccepted() && !ride.isArrived()) {
        return Result.failure(
          RideErrors.invalidRideStatusTransition(
            ride.getStatus(),
            RideStatus.STARTED,
            rideId,
          ),
        );
      }

      const wasArrivedAutoSet = ride.isAccepted() && !ride.getArrivedAt();

      ride.setStatusToStarted();

      const updatedRide = await this.rideRepository.save(ride);

      Logger.info("Ride marked as started successfully", {
        rideId: updatedRide.getRideId(),
        driverId,
        wasArrivedAutoSet,
        arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
        startedAt: updatedRide.getStartedAt()?.toISOString(),
      });

      const response: MarkRideAsStartedResponseDto = {
        success: true,
        message: wasArrivedAutoSet
          ? RIDE_MESSAGES.RIDE_STARTED_WITH_AUTO_ARRIVED
          : RIDE_MESSAGES.RIDE_STARTED,
        data: {
          rideId: updatedRide.getRideId(),
          status: updatedRide.getStatus(),
          arrivedAt: updatedRide.getArrivedAt()!.toISOString(),
          startedAt: updatedRide.getStartedAt()!.toISOString(),
          wasArrivedAutoSet,
          pickup: {
            latitude: updatedRide.getPickup().getLatitude(),
            longitude: updatedRide.getPickup().getLongitude(),
            address: updatedRide.getPickup().getAddress(),
          },
          drop: {
            latitude: updatedRide.getDrop().getLatitude(),
            longitude: updatedRide.getDrop().getLongitude(),
            address: updatedRide.getDrop().getAddress(),
          },
          riderId: updatedRide.getRiderId(),
          driverId: updatedRide.getDriverId(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error marking ride as started", {
        userId: dto.getUserId(),
        rideId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return Result.failure(error as Error);
    }
  }
}
