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
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { SearchCriteria } from "@domain/value-objects/SearchCriteria";
import { DriverSearchFilter } from "@domain/value-objects/DriverSearchFilter";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";

export interface DriverSearchResult {
  driverId: string;
  userId: string;
  distance: number;
  eta: number;
}

@injectable()
export class FindNearbyDriversUseCase {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private driverAvailabilityRepository: DriverAvailabilityRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: DriverRepository,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async execute(
    requestDto: FindNearbyDriversRequestDto
  ): Promise<Result<FindNearbyDriversResponseDto>> {
    try {
      Logger.info("Find nearby drivers use case started", {
        latitude: requestDto.latitude,
        longitude: requestDto.longitude,
        radiusKm: requestDto.radiusKm,
        timeRequired: requestDto.timeRequired,
        gearType: requestDto.gearType,
        bodyType: requestDto.bodyType,
      });

      const validationErrors = requestDto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

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

      const nearbyAvailabilities =
        await this.driverAvailabilityRepository.findNearbyAvailableDrivers(
          searchCriteria.getLatitude(),
          searchCriteria.getLongitude(),
          searchCriteria.getRadiusKm(),
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
          FindNearbyDriversResponseDto.create([], 0, {
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
          })
        );
      }

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
        }
      );

      Logger.info("Find nearby drivers use case completed successfully", {
        driversFound: validDrivers.length,
      });

      return Result.success(responseDto);
    } catch (error) {
      Logger.error("Find nearby drivers use case failed", { error });
      return Result.failure(error as Error);
    }
  }

  private isDriverAvailableForDuration(
    driverAvailability: any,
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
