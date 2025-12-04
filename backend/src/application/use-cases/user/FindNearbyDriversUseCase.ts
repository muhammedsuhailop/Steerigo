import { injectable, inject } from "inversify";
import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import {
  FindNearbyDriversResponseDto,
  DriverInfoResponse,
} from "@application/dto/user/FindNearbyDriversResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IDriverAvailabilityRepository } from "@application/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@application/repositories/IDriverRepository";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { SearchCriteria } from "@domain/value-objects/SearchCriteria";
import { DriverSearchFilter } from "@domain/value-objects/DriverSearchFilter";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { IUseCase } from "../interfaces/IUseCase";
import { DriverAvailability } from "@domain/entities/DriverAvailability";

@injectable()
export class FindNearbyDriversUseCase
  implements
    IUseCase<
      FindNearbyDriversRequestDto,
      Promise<Result<FindNearbyDriversResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.FareCalculationService)
    private fareCalculationService: IFareCalculationService
  ) {}

  async execute(
    requestDto: FindNearbyDriversRequestDto
  ): Promise<Result<FindNearbyDriversResponseDto>> {
    try {
      Logger.info("Find nearby drivers use case started", {
        latitude: requestDto.latitude,
        longitude: requestDto.longitude,
        searchDate: requestDto.searchDate,
        radiusKm: requestDto.radiusKm,
        timeRequired: requestDto.timeRequired,
        gearType: requestDto.gearType,
        bodyType: requestDto.bodyType,
      });

      requestDto.validate();

      const searchCriteria = SearchCriteria.create(
        { latitude: requestDto.latitude, longitude: requestDto.longitude },
        requestDto.searchDate,
        requestDto.radiusKm,
        requestDto.timeRequired
      );

      const searchFilter = DriverSearchFilter.create(
        requestDto.gearType,
        requestDto.bodyType
      );

      const fareBreakdown = await this.fareCalculationService.calculateFare({
        durationMinutes: requestDto.timeRequired,
        searchDate: requestDto.searchDate,
      });

      const nearbyAvailabilities =
        await this.driverAvailabilityRepository.findNearbyAvailableDrivers(
          searchCriteria.getLatitude(),
          searchCriteria.getLongitude(),
          searchCriteria.getSearchDate(),
          searchCriteria.getRadiusKm(),
          searchCriteria.getTimeRequiredMinutes(),
          requestDto.limit
        );

      Logger.debug(
        "Get available drivers within radius result",
        nearbyAvailabilities
      );

      Logger.info("Found nearby driver availabilities", {
        count: nearbyAvailabilities.length,
      });

      if (nearbyAvailabilities.length === 0) {
        return Result.success(
          FindNearbyDriversResponseDto.create(
            [],
            0,
            {
              location: {
                latitude: searchCriteria.getLatitude(),
                longitude: searchCriteria.getLongitude(),
              },
              radiusKm: searchCriteria.getRadiusKm(),
              searchDate: searchCriteria.getSearchDate(),
              timeRequiredMinutes: searchCriteria.getTimeRequiredMinutes(),
              filters: {
                gearType: searchFilter.getGearType(),
                bodyType: searchFilter.getBodyType(),
              },
            },
            fareBreakdown
          )
        );
      }

      Logger.info("Fare calculated for driver search", {
        durationMinutes: requestDto.timeRequired,
        totalFare: fareBreakdown.getTotalFare().getAmount(),
      });

      const driverResponses = await Promise.all(
        nearbyAvailabilities.map(async (availability, index) => {
          const driverId = availability?.driver?.getDriverId?.() || "Unknown";
          const availabilityId = availability?.driver.getId() || "N/A";

          Logger.debug("Processing driver candidate", {
            index,
            driverId,
            availabilityId,
            distanceKm: availability.distanceKm,
            etaMinutes: availability.etaMinutes,
          });

          try {
            const available = this.isDriverAvailableForDuration(
              availability.driver,
              searchCriteria.getSearchDate(),
              searchCriteria.getTimeRequiredMinutes()
            );

            if (!available) {
              Logger.info(
                "Driver filtered out - insufficient availability window",
                {
                  driverId,
                  availabilityId,
                  availableFrom:
                    availability.driver.getAvailableFrom?.() || "unknown",
                  availableTill:
                    availability.driver.getAvailableTill?.() || "unknown",
                  searchDate: searchCriteria.getSearchDate(),
                  requiredMinutes: searchCriteria.getTimeRequiredMinutes(),
                }
              );
              return null;
            }

            const driver = await this.driverRepository.findById(
              availability.driver.getDriverId()
            );

            if (!driver) {
              Logger.warn("Driver filtered out - driver profile not found", {
                driverId,
                availabilityId,
              });
              return null;
            }

            if (driver.getStatus() !== "Active") {
              Logger.info("Driver filtered out - status not Active", {
                driverId,
                status: driver.getStatus(),
              });
              return null;
            }

            if (searchFilter.hasFilters()) {
              const matches = searchFilter.matches(
                driver.getEligibleGearTypes(),
                driver.getEligibleBodyTypes(),
                0
              );

              if (!matches) {
                Logger.info("Driver filtered out - filter mismatch", {
                  driverId,
                  requiredGearType: searchFilter.getGearType(),
                  requiredBodyType: searchFilter.getBodyType(),
                  driverGearTypes: driver.getEligibleGearTypes(),
                  driverBodyTypes: driver.getEligibleBodyTypes(),
                });
                return null;
              }
            }

            const user = await this.userRepository.findById(driver.getUserId());

            if (!user) {
              Logger.warn("Driver filtered out - linked user not found", {
                driverId,
                userId: driver.getUserId(),
              });
              return null;
            }

            const response: DriverInfoResponse = {
              id: driver.getId(),
              userId: user.getId(),
              name: user.getName(),
              mobile: user.getMobile() as string,
              profilePicture: user.getProfilePicture(),
              rating: 4.5,
              totalRides: 50,
              status: driver.getStatus(),
              gearType: driver.getEligibleGearTypes()[0],
              bodyType: driver.getEligibleBodyTypes()[0],
              distance: {
                value: availability.distanceKm,
                unit: "km",
              },
              eta: {
                value: availability.etaMinutes,
                unit: "minutes",
              },
              currentLocation: {
                latitude: availability.driver
                  .getCurrentLocation()
                  .getLatitude(),
                longitude: availability.driver
                  .getCurrentLocation()
                  .getLongitude(),
                address: availability.driver.getCurrentLocation().getAddress(),
              },
              availabilityStatus: availability.driver.getStatus().toString(),
            };

            Logger.debug("Driver passed all checks and added to results", {
              driverId,
              userId: user.getId(),
              distanceKm: availability.distanceKm,
              etaMinutes: availability.etaMinutes,
            });

            return response;
          } catch (error) {
            Logger.error("Error processing driver in search", {
              driverId,
              availabilityId,
              error,
            });
            return null;
          }
        })
      );

      const validDrivers = driverResponses.filter(
        (driver): driver is DriverInfoResponse => driver !== null
      );

      Logger.info("Filtered drivers after applying criteria", {
        total: nearbyAvailabilities.length,
        matched: validDrivers.length,
      });

      const responseDto = FindNearbyDriversResponseDto.create(
        validDrivers,
        validDrivers.length,
        {
          location: {
            latitude: searchCriteria.getLatitude(),
            longitude: searchCriteria.getLongitude(),
          },
          radiusKm: searchCriteria.getRadiusKm(),
          searchDate: searchCriteria.getSearchDate(),
          timeRequiredMinutes: searchCriteria.getTimeRequiredMinutes(),
          filters: searchFilter.hasFilters()
            ? {
                gearType: searchFilter.getGearType(),
                bodyType: searchFilter.getBodyType(),
              }
            : undefined,
        },
        fareBreakdown
      );

      Logger.info("Find nearby drivers use case completed successfully", {
        driversFound: validDrivers.length,
      });

      return Result.success(responseDto);
    } catch (error) {
      if (error instanceof DomainError) {
        Logger.warn("Find nearby drivers validation failed", {
          errorName: error.constructor.name,
          message: error.message,
        });
        return Result.failure(error);
      }

      Logger.error("Find nearby drivers use case failed", { error });
      return Result.failure(error as Error);
    }
  }

  private isDriverAvailableForDuration(
    driverAvailability: DriverAvailability,
    searchDate: Date,
    timeRequiredMinutes: number
  ): boolean {
    const availableFrom = new Date(driverAvailability.getAvailableFrom());
    const availableTill = new Date(driverAvailability.getAvailableTill());

    const rideEndTime = new Date(searchDate);
    rideEndTime.setMinutes(rideEndTime.getMinutes() + timeRequiredMinutes);

    return availableFrom <= searchDate && availableTill >= rideEndTime;
  }
}
