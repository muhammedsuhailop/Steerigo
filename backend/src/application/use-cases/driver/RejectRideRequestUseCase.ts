import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RejectRideRequestDto } from "@application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "@application/dto/driver/RejectRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";

@injectable()
export class RejectRideRequestUseCase
  implements
    IUseCase<
      RejectRideRequestDto,
      Promise<Result<RejectRideRequestResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,
  ) {}

  async execute(
    dto: RejectRideRequestDto,
  ): Promise<Result<RejectRideRequestResponseDto>> {
    try {
      Logger.info("Rejecting ride request", {
        userId: dto.getUserId(),
        requestId: dto.getRequestId(),
        reason: dto.getReason(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();
      Logger.debug("Driver found for user", {
        userId: dto.getUserId(),
        driverId,
      });

      const rideRequest = await this.rideRequestRepository.findById(
        dto.getRequestId(),
      );

      if (!rideRequest) {
        return Result.failure(
          RideRequestErrors.rideRequestNotFound(dto.getRequestId()),
        );
      }

      const requestDriverId = rideRequest.getDriverId().toString();
      Logger.debug("Comparing driver IDs", {
        driverId,
        requestDriverId,
        match: driverId === requestDriverId,
      });

      if (requestDriverId !== driverId) {
        return Result.failure(
          RideRequestErrors.rideRequestNotForDriver(
            dto.getRequestId(),
            driverId,
          ),
        );
      }

      if (!rideRequest.isPending()) {
        return Result.failure(
          RideRequestErrors.rideRequestNotPending(
            dto.getRequestId(),
            rideRequest.getStatus(),
          ),
        );
      }

      rideRequest.markAsRejected();
      await this.rideRequestRepository.save(rideRequest);

      Logger.info("Ride request rejected successfully", {
        requestId: dto.getRequestId(),
        driverId,
        reason: dto.getReason(),
      });

      const response: RejectRideRequestResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDE_REQUEST_REJECTED,
        data: {
          requestId: rideRequest.getId(),
          status: rideRequest.getStatus(),
          rejectedAt: new Date().toISOString(),
          reason: dto.getReason(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error rejecting ride request", {
        userId: dto.getUserId(),
        requestId: dto.getRequestId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
