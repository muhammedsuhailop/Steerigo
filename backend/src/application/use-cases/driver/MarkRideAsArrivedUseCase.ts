import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { MarkRideAsArrivedDto } from "@application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "@application/dto/driver/MarkRideAsArrivedResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideErrors } from "@domain/errors/RideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";

@injectable()
export class MarkRideAsArrivedUseCase
  implements
    IUseCase<
      MarkRideAsArrivedDto,
      Promise<Result<MarkRideAsArrivedResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
  ) {}

  async execute(
    dto: MarkRideAsArrivedDto,
  ): Promise<Result<MarkRideAsArrivedResponseDto>> {
    const rideId = dto.getRideId();

    try {
      Logger.info("Marking ride as driver arrived", {
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

      if (!ride.isAccepted()) {
        return Result.failure(
          RideErrors.invalidRideStatusTransition(
            ride.getStatus(),
            "ARRIVED",
            rideId,
          ),
        );
      }

      ride.setStatusToArrived();

      const updatedRide = await this.rideRepository.save(ride);

      Logger.info("Ride marked as driver arrived successfully", {
        rideId: updatedRide.getRideId(),
        driverId,
        arrivedAt: updatedRide.getArrivedAt()?.toISOString(),
      });

      const response: MarkRideAsArrivedResponseDto = {
        success: true,
        message: RIDE_MESSAGES.DRIVER_ARRIVED_AT_PICKUP,
        data: {
          rideId: updatedRide.getRideId(),
          status: updatedRide.getStatus(),
          arrivedAt: updatedRide.getArrivedAt()!.toISOString(),
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
      Logger.error("Error marking ride as driver arrived", {
        userId: dto.getUserId(),
        rideId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return Result.failure(error as Error);
    }
  }
}
