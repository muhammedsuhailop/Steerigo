import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { RideRequest } from "@domain/entities/RideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class SendRideRequestUseCase
  implements
    IUseCase<SendRideRequestDto, Promise<Result<SendRideRequestResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRequestRepository)
    private readonly rideRequestRepository: IRideRequestRepository,

    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,

    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    dto: SendRideRequestDto,
  ): Promise<Result<SendRideRequestResponseDto>> {
    try {
      try {
        dto.validate();
      } catch (validationError: unknown) {
        Logger.warn("SendRideRequestUseCase: DTO validation failed", {
          error: validationError,
          riderId: dto.riderId,
          driverId: dto.driverId,
        });

        if (validationError instanceof DomainError) {
          return Result.failure(validationError);
        }

        if (validationError instanceof Error) {
          return Result.failure(
            RideRequestErrors.rideRequestCreationFailed(
              validationError.message,
            ),
          );
        }

        return Result.failure(
          RideRequestErrors.rideRequestCreationFailed("Validation failed"),
        );
      }

      Logger.info("SendRideRequestUseCase: Starting execution", {
        riderId: dto.riderId,
        driverId: dto.driverId,
        requestGroupId: dto.requestGroupId,
        totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
      });

      const rider = await this.userRepository.findById(dto.riderId);

      if (!rider) {
        Logger.warn("SendRideRequestUseCase: Rider not found", {
          riderId: dto.riderId,
        });

        return Result.failure(RideRequestErrors.userNotFound(dto.riderId));
      }

      const driver = await this.driverRepository.findById(dto.driverId);

      if (!driver) {
        Logger.warn("SendRideRequestUseCase: Driver not found", {
          driverId: dto.driverId,
        });

        return Result.failure(RideRequestErrors.driverNotFound(dto.driverId));
      }

      if (!driver.getisAvailable()) {
        Logger.warn("SendRideRequestUseCase: Driver not available", {
          driverId: dto.driverId,
          status: driver.getStatus(),
        });

        return Result.failure(
          RideRequestErrors.driverNotAvailable(dto.driverId),
        );
      }

      const existingRequest =
        await this.rideRequestRepository.findByGroupAndDriver(
          dto.requestGroupId,
          dto.driverId,
        );

      if (existingRequest) {
        Logger.warn(
          "SendRideRequestUseCase: Duplicate group-driver request detected",
          {
            riderId: dto.riderId,
            driverId: dto.driverId,
            requestGroupId: dto.requestGroupId,
          },
        );

        return Result.failure(
          RideRequestErrors.duplicateRideRequest(dto.riderId, dto.driverId),
        );
      }

      const pendingRequests =
        await this.rideRequestRepository.findPendingByRiderId(dto.riderId);

      const hasPendingRequestToDriver = pendingRequests.some(
        (req) => req.getDriverId() === dto.driverId,
      );

      if (hasPendingRequestToDriver) {
        Logger.warn(
          "SendRideRequestUseCase: Duplicate pending request detected",
          {
            riderId: dto.riderId,
            driverId: dto.driverId,
          },
        );

        return Result.failure(
          RideRequestErrors.duplicateRideRequest(dto.riderId, dto.driverId),
        );
      }

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

      const rideType = dto.rideType;

      const rideRequest = RideRequest.create(
        dto.driverId,
        dto.riderId,
        dto.requestGroupId,
        pickup,
        drop,
        dto.pickupTime,
        dto.rideType as RideType,
        dto.fareBreakdown,
        dto.pickupETA,
      );

      const savedRequest = await this.rideRequestRepository.save(rideRequest);

      if (!savedRequest) {
        Logger.error("SendRideRequestUseCase: Failed to save ride request", {
          requestGroupId: dto.requestGroupId,
          riderId: dto.riderId,
          driverId: dto.driverId,
        });

        return Result.failure(
          RideRequestErrors.rideRequestCreationFailed(
            "Failed to persist request",
          ),
        );
      }

      Logger.info("SendRideRequestUseCase: Ride request created successfully", {
        requestId: savedRequest.getId(),
        riderId: dto.riderId,
        driverId: dto.driverId,
        requestGroupId: dto.requestGroupId,
        status: savedRequest.getStatus(),
        totalFare: savedRequest.getFare(),
      });

      const responseDto = SendRideRequestResponseDto.fromDomain(savedRequest);

      return Result.success(responseDto);
    } catch (error: unknown) {
      Logger.error("SendRideRequestUseCase: Execution failed", {
        error,
        riderId: dto.riderId,
        driverId: dto.driverId,
      });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      if (error instanceof Error) {
        return Result.failure(
          RideRequestErrors.rideRequestCreationFailed(error.message),
        );
      }

      return Result.failure(
        RideRequestErrors.rideRequestCreationFailed("Unknown error occurred"),
      );
    }
  }
}
