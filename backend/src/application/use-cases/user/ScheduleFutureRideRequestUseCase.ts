import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { ScheduleFutureRideDto } from "@application/dto/user/ScheduleFutureRideDto";
import {
  ScheduleFutureRideResponseDto,
  ScheduledRequestInfo,
} from "@application/dto/user/ScheduleFutureRideResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { IEventBus } from "@application/services/IEventBus";
import { FutureRideRequest } from "@domain/entities/FutureRideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { FutureRideErrors } from "@domain/errors/FutureRideErrors";
import { AppConstants } from "@shared/constants/AppConstants";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

@injectable()
export class ScheduleFutureRideRequestUseCase implements IUseCase<
  ScheduleFutureRideDto,
  Promise<Result<ScheduleFutureRideResponseDto>>
> {
  constructor(
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private readonly driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.FareCalculationService)
    private readonly fareCalculationService: IFareCalculationService,
    @inject(TYPES.FutureRideExpiryService)
    private readonly futureRideExpiryService: IFutureRideExpiryService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: ScheduleFutureRideDto,
  ): Promise<Result<ScheduleFutureRideResponseDto>> {
    try {
      dto.validate();

      const availableFrom = dto.getAvailabilityCheckTime();

      const nearbyAvailabilities =
        await this.driverAvailabilityRepository.findNearbyAvailableDriversByBaseLocation(
          dto.latitude,
          dto.longitude,
          availableFrom,
          dto.radiusKm,
          dto.maxCandidates,
        );

      if (nearbyAvailabilities.length === 0) {
        return Result.failure(FutureRideErrors.noDriversFound());
      }

      const fareBreakdown = await this.fareCalculationService.calculateFare({
        durationMinutes: AppConstants.FUTURE_RIDE_DEFAULT_DURATION_MINUTES,
        searchDate: dto.pickupTime,
      });

      const pickup = Location.create({
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.pickupAddress,
      });

      const drop = Location.create({
        latitude: dto.dropLatitude,
        longitude: dto.dropLongitude,
        address: dto.dropAddress,
      });

      const saveResults = await Promise.allSettled(
        nearbyAvailabilities.map(async (availability) => {
          const driverId = availability.driver.getDriverId();
          const driverUserId = availability.driverUserId;

          const request = FutureRideRequest.create({
            riderId: dto.getRiderId(),
            requestGroupId: dto.requestGroupId,
            pickup,
            drop,
            pickupTime: dto.pickupTime,
            requiredDuration: dto.requiredDuration,
            rideType: dto.rideType as RideType,
            fareBreakdown,
            pickupETA: AppConstants.FUTURE_RIDE_DEFAULT_ETA_LABEL,
          });

          request.assignDriver(driverId, driverUserId);

          const saved = await this.futureRideRequestRepository.save(request);

          return {
            requestId: saved.getId(),
            driverId,
            driverUserId,
            pickupETA: AppConstants.FUTURE_RIDE_DEFAULT_ETA_LABEL,
            totalFare: fareBreakdown.getTotalFare().getAmount(),
            currency: fareBreakdown.getTotalFare().getCurrency(),
          } satisfies ScheduledRequestInfo;
        }),
      );

      saveResults.forEach((result, index) => {
        if (result.status === "rejected") {
          Logger.error("Future ride request save failed", {
            index,
            requestGroupId: dto.requestGroupId,
            error:
              result.reason instanceof Error
                ? {
                    name: result.reason.name,
                    message: result.reason.message,
                    stack: result.reason.stack,
                  }
                : result.reason,
          });
        }
      });

      const successfulRequests: ScheduledRequestInfo[] = saveResults
        .filter(
          (r): r is PromiseFulfilledResult<ScheduledRequestInfo> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);

      const failedCount = saveResults.filter(
        (r) => r.status === "rejected",
      ).length;

      if (failedCount > 0) {
        Logger.warn("Some future ride requests failed to save", {
          requestGroupId: dto.requestGroupId,
          failedCount,
        });
      }

      if (successfulRequests.length === 0) {
        return Result.failure(
          FutureRideErrors.scheduleFailed("All driver request saves failed"),
        );
      }

      const expiresAt = new Date(
        Date.now() + AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS,
      ).toISOString();

      const notifyResults = await Promise.allSettled(
        successfulRequests.map((req) =>
          this.eventBus.publish({
            type: "FutureRideRequestSentToDriver",
            occurredAt: new Date(),
            payload: {
              requestId: req.requestId,
              requestGroupId: dto.requestGroupId,
              driverId: req.driverId,
              driverUserId: req.driverUserId,
              riderId: dto.getRiderId(),
              pickup: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                address: dto.pickupAddress,
              },
              drop: {
                latitude: dto.dropLatitude,
                longitude: dto.dropLongitude,
                address: dto.dropAddress,
              },
              pickupTime: dto.pickupTime.toISOString(),
              pickupETA: dto.pickupTime.toISOString(),
              rideType: dto.rideType,
              fare: fareBreakdown.getTotalFare().getAmount(),
              currency: fareBreakdown.getTotalFare().getCurrency(),
              status: FutureRideRequestStatus.MATCHED,
              requiredDuration: dto.requiredDuration,
              createdAt: new Date().toISOString(),
              expiresAt,
            },
          }),
        ),
      );

      notifyResults.forEach((result, index) => {
        if (result.status === "rejected") {
          Logger.warn("Failed to notify driver of future ride request", {
            index,
            requestGroupId: dto.requestGroupId,
            driverId: successfulRequests[index]?.driverId,
            error:
              result.reason instanceof Error
                ? result.reason.message
                : result.reason,
          });
        }
      });

      await this.futureRideExpiryService.scheduleGroupExpiry(
        dto.requestGroupId,
      );

      Logger.info("Future ride scheduled successfully", {
        requestGroupId: dto.requestGroupId,
        riderId: dto.getRiderId(),
        driverCount: successfulRequests.length,
        pickupTime: dto.pickupTime,
        availableFrom,
      });

      return Result.success(
        ScheduleFutureRideResponseDto.create(
          dto.requestGroupId,
          successfulRequests,
          dto.pickupTime,
          AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS,
        ),
      );
    } catch (error) {
      Logger.error("Schedule future ride failed", {
        error,
        requestGroupId: dto.requestGroupId,
        riderId: dto.getRiderId(),
      });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      return Result.failure(
        FutureRideErrors.scheduleFailed(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }
}
