import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { RideRequest } from "@domain/entities/RideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { Logger } from "@shared/utils/Logger";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { RideType } from "@domain/value-objects/RideType";
import { IUseCase } from "../interfaces/IUseCase";
import mongoose from "mongoose";

@injectable()
export class SendRideRequestUseCase
  implements
    IUseCase<SendRideRequestDto, Promise<Result<SendRideRequestResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(
    dto: SendRideRequestDto
  ): Promise<Result<SendRideRequestResponseDto>> {
    try {
      try {
        dto.validate();
      } catch (validationError) {
        Logger.warn("SendRideRequestUseCase: DTO validation failed", {
          error: validationError,
          riderId: dto.riderId,
          driverId: dto.driverId,
        });
        if (validationError instanceof DomainError) {
          return Result.failure(validationError);
        }

        return Result.failure(
          RideRequestErrors.rideRequestCreationFailed(
            (validationError as Error)?.message || "Validation failed"
          )
        );
      }

      Logger.info("SendRideRequestUseCase: Starting execution", {
        riderId: dto.riderId,
        driverId: dto.driverId,
        totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
      });

      // Verify rider exists
      const rider = await this.userRepository.findById(dto.riderId);
      if (!rider) {
        Logger.warn("SendRideRequestUseCase: Rider not found", {
          riderId: dto.riderId,
        });
        return Result.failure(RideRequestErrors.userNotFound(dto.riderId));
      }

      // Verify driver exists
      const driver = await this.driverRepository.findById(dto.driverId);
      if (!driver) {
        Logger.warn("SendRideRequestUseCase: Driver not found", {
          driverId: dto.driverId,
        });
        return Result.failure(RideRequestErrors.driverNotFound(dto.driverId));
      }

      //Verify driver is available
      if (!driver.getisAvailable()) {
        Logger.warn("SendRideRequestUseCase: Driver not available", {
          driverId: dto.driverId,
          status: driver.getStatus(),
        });
        return Result.failure(
          RideRequestErrors.driverNotAvailable(dto.driverId)
        );
      }

      // Check for duplicate pending requests
      const pendingRequests =
        await this.rideRequestRepository.findPendingByRiderId(dto.riderId);

      const hasPendingRequestToDriver = pendingRequests.some(
        (req) => req.getDriverId() === dto.driverId
      );

      if (hasPendingRequestToDriver) {
        Logger.warn(
          "SendRideRequestUseCase: Duplicate pending request detected",
          {
            riderId: dto.riderId,
            driverId: dto.driverId,
          }
        );
        return Result.failure(
          RideRequestErrors.duplicateRideRequest(dto.riderId, dto.driverId)
        );
      }

      // Create location value objects
      const pickup = Location.create({
        latitude: dto.pickupLatitude,
        longitude: dto.pickupLongitude,
        address: dto.pickupAddress,
      });

      const drop = Location.create({
        latitude: dto.dropLatitude,
        longitude: dto.dropLongitude,
        address: dto.dropAddress,
      });

      //Create ride request entity with fareBreakdown
      const requestGroupId = new mongoose.Types.ObjectId().toString();
      const rideRequest = RideRequest.create(
        dto.driverId,
        requestGroupId,
        dto.riderId,
        pickup,
        drop,
        dto.pickupTime,
        dto.rideType as RideType,
        dto.fareBreakdown,
        dto.pickupETA
      );

      //  Save ride request
      const savedRequest = await this.rideRequestRepository.save(rideRequest);

      if (!savedRequest) {
        Logger.error("SendRideRequestUseCase: Failed to save ride request", {
          requestGroupId,
          riderId: dto.riderId,
          driverId: dto.driverId,
        });
        return Result.failure(
          RideRequestErrors.rideRequestCreationFailed(
            "Failed to persist request"
          )
        );
      }

      Logger.info("SendRideRequestUseCase: Ride request created successfully", {
        requestId: savedRequest.getRequestId?.() ?? savedRequest.getId?.(),
        riderId: dto.riderId,
        driverId: dto.driverId,
        status: savedRequest.getStatus(),
        totalFare: savedRequest.getFare(),
      });

      // Return success response DTO
      const responseDto = SendRideRequestResponseDto.fromDomain(savedRequest);
      return Result.success(responseDto);
    } catch (error) {
      Logger.error("SendRideRequestUseCase: Execution failed", {
        error,
        riderId: dto.riderId,
        driverId: dto.driverId,
      });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      const msg =
        error instanceof Error ? error.message : "Unknown error occurred";
      return Result.failure(RideRequestErrors.rideRequestCreationFailed(msg));
    }
  }
}
