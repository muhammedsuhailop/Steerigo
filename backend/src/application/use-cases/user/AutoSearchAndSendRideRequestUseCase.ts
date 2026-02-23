import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { AutoSearchAndRequestDto } from "@application/dto/user/AutoSearchAndRequestDto";
import {
  AutoSearchAndRequestResponseDto,
  SuccessfulRequestInfo,
  FailedRequestInfo,
} from "@application/dto/user/AutoSearchAndRequestResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { IAvailabilityCheckService } from "@application/services/IAvailabilityCheckService";
import { SearchCriteria } from "@domain/value-objects/SearchCriteria";
import { DriverSearchFilter } from "@domain/value-objects/DriverSearchFilter";
import { RideRequest } from "@domain/entities/RideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { AppConstants } from "@shared/constants/AppConstants";
import { IEventBus } from "@application/services/IEventBus";
import { RideRequestCreatedEvent } from "@application/events/RideEvents";

@injectable()
export class AutoSearchAndSendRideRequestUseCase
  implements
    IUseCase<
      AutoSearchAndRequestDto,
      Promise<Result<AutoSearchAndRequestResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private driverAvailabilityRepository: IDriverAvailabilityRepository,

    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,

    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,

    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,

    @inject(TYPES.FareCalculationService)
    private fareCalculationService: IFareCalculationService,

    @inject(TYPES.AvailabilityCheckService)
    private availabilityCheckService: IAvailabilityCheckService,

    @inject(TYPES.EventBus)
    private eventBus: IEventBus,
  ) {}

  async execute(
    dto: AutoSearchAndRequestDto,
  ): Promise<Result<AutoSearchAndRequestResponseDto>> {
    const userId = dto.getRiderId();

    try {
      dto.validate();

      const rider = await this.userRepository.findById(userId);
      if (!rider) {
        return Result.failure(RideRequestErrors.userNotFound(userId));
      }

      const fareBreakdown = await this.fareCalculationService.calculateFare({
        durationMinutes: dto.timeRequired,
        searchDate: dto.searchDate,
      });

      const searchCriteria = SearchCriteria.create(
        { latitude: dto.latitude, longitude: dto.longitude },
        dto.searchDate,
        dto.radiusKm,
        dto.timeRequired,
      );

      const searchFilter = DriverSearchFilter.create(
        dto.gearType,
        dto.bodyType,
      );

      const fetchLimit = dto.maxRideRequests * AppConstants.FETCH_MULTIPLIER;

      const nearbyAvailabilities =
        await this.driverAvailabilityRepository.findNearbyAvailableDrivers(
          searchCriteria.getLatitude(),
          searchCriteria.getLongitude(),
          searchCriteria.getSearchDate(),
          searchCriteria.getRadiusKm(),
          searchCriteria.getTimeRequiredMinutes(),
          fetchLimit,
        );

      const successfulRequests: SuccessfulRequestInfo[] = [];
      const failedRequests: FailedRequestInfo[] = [];

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

      const pendingRequests =
        await this.rideRequestRepository.findPendingByRiderId(userId);

      for (const item of nearbyAvailabilities) {
        if (successfulRequests.length >= dto.maxRideRequests) break;

        const availability = item.driver;
        const driverId = availability.getDriverId();

        const startDate = searchCriteria.getSearchDate();
        const endDate = new Date(
          startDate.getTime() +
            searchCriteria.getTimeRequiredMinutes() * 60 * 1000,
        );

        const isAvailable =
          await this.availabilityCheckService.isAvailableDuring(
            driverId,
            startDate,
            endDate,
          );

        if (!isAvailable) {
          failedRequests.push({
            driverId,
            driverName: await this.getDriverName(driverId),
            reason: "Driver unavailable for requested duration",
          });
          continue;
        }

        const driver = await this.driverRepository.findById(driverId);
        if (!driver || driver.getStatus() !== DriverStatus.ACTIVE) {
          failedRequests.push({
            driverId,
            driverName: await this.getDriverName(driverId),
            reason: "Driver not active",
          });
          continue;
        }

        if (
          searchFilter.hasFilters() &&
          !searchFilter.matches(
            driver.getEligibleGearTypes(),
            driver.getEligibleBodyTypes(),
            0,
          )
        ) {
          failedRequests.push({
            driverId,
            driverName: await this.getDriverName(driverId),
            reason: "Does not match vehicle preferences",
          });
          continue;
        }

        if (pendingRequests.some((r) => r.getDriverId() === driverId)) {
          failedRequests.push({
            driverId,
            driverName: await this.getDriverName(driverId),
            reason: "Request already pending",
          });
          continue;
        }

        const rideRequest = RideRequest.create(
          driverId,
          userId,
          dto.requestGroupId,
          pickup,
          drop,
          dto.searchDate,
          dto.rideType as RideType,
          fareBreakdown,
          `${item.etaMinutes} mins`,
        );

        const saved = await this.rideRequestRepository.save(rideRequest);
        if (!saved) {
          failedRequests.push({
            driverId,
            driverName: await this.getDriverName(driverId),
            reason: "Failed to create request",
          });
          continue;
        }

        const rideRequestCreatedEvent: RideRequestCreatedEvent = {
          type: "RideRequestCreated",
          occurredAt: new Date(),
          payload: {
            requestId: saved.getId(),
            requestGroupId: dto.requestGroupId,
            riderId: userId,
            driverId,
            pickup: {
              latitude: pickup.getLatitude(),
              longitude: pickup.getLongitude(),
              address: pickup.getAddress(),
            },
            drop: {
              latitude: drop.getLatitude(),
              longitude: drop.getLongitude(),
              address: drop.getAddress(),
            },
            pickupTime: dto.searchDate.toISOString(),
            rideType: dto.rideType,
            pickupETA: `${item.etaMinutes} mins`,
            fare: {
              amount: fareBreakdown.getTotalFare().getAmount(),
              currency: fareBreakdown.getTotalFare().getCurrency(),
            },
            searchedAt: new Date().toISOString(),
          },
        };

        await this.eventBus.publish(rideRequestCreatedEvent);

        successfulRequests.push({
          requestId: saved.getId(),
          driverId,
          driverName: await this.getDriverName(driverId),
          pickupETA: `${item.etaMinutes} mins`,
          totalFare: fareBreakdown.getTotalFare().getAmount(),
          currency: fareBreakdown.getTotalFare().getCurrency(),
        });
      }

      return Result.success(
        AutoSearchAndRequestResponseDto.create(
          dto.requestGroupId,
          successfulRequests,
          failedRequests,
          nearbyAvailabilities.length,
        ),
      );
    } catch (error) {
      Logger.error("Auto search failed", { error });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      return Result.failure(
        RideRequestErrors.rideRequestCreationFailed(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  private async getDriverName(driverId: string): Promise<string> {
    try {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) return "Unknown Driver";

      const user = await this.userRepository.findById(driver.getUserId());
      return user?.getName?.() ?? "Unknown Driver";
    } catch {
      return "Unknown Driver";
    }
  }
}
