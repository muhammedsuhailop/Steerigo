import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { AutoSearchAndRequestDto } from "@application/dto/user/AutoSearchAndRequestDto";
import { AutoSearchAndRequestResponseDto } from "@application/dto/user/AutoSearchAndRequestResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { SearchCriteria } from "@domain/value-objects/SearchCriteria";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { AppConstants } from "@shared/constants/AppConstants";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";

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
    private readonly driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.FareCalculationService)
    private readonly fareCalculationService: IFareCalculationService,
    @inject(TYPES.RideRequestGroupRepository)
    private readonly rideRequestGroupRepository: IRideRequestGroupRepository,
    @inject(TYPES.RideSearchDispatchService)
    private readonly rideSearchDispatchService: IRideSearchDispatchService,
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
        durationMinutes: dto.timeRequired * 60 ,
        searchDate: dto.searchDate,
      });

      const searchCriteria = SearchCriteria.create(
        { latitude: dto.latitude, longitude: dto.longitude },
        dto.searchDate,
        dto.radiusKm,
        dto.timeRequired,
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

      const candidateDriverIds = nearbyAvailabilities.map((item) =>
        item.driver.getDriverId(),
      );

      if (candidateDriverIds.length === 0) {
        Logger.info("No nearby candidate drivers found for search session", {
          riderId: userId,
          requestGroupId: dto.requestGroupId,
        });

        return Result.success(
          AutoSearchAndRequestResponseDto.create(dto.requestGroupId, [], [], 0),
        );
      }

      const rideRequestGroup = RideRequestGroup.create(
        dto.requestGroupId,
        userId,
        pickup,
        drop,
        dto.timeRequired,
        dto.rideType as RideType,
        fareBreakdown,
        candidateDriverIds,
      );

      const savedGroup =
        await this.rideRequestGroupRepository.save(rideRequestGroup);

      Logger.info("Ride search group created", {
        requestGroupId: savedGroup.getId(),
        riderId: savedGroup.getRiderId(),
        candidateCount: savedGroup.getCandidateDriverIds().length,
        candidateDriverIds: savedGroup.getCandidateDriverIds(),
      });

      await this.rideSearchDispatchService.scheduleGroupGuards(
        savedGroup.getId(),
      );
      await this.rideSearchDispatchService.dispatchNextRequest(
        savedGroup.getId(),
        0,
      );

      return Result.success(
        AutoSearchAndRequestResponseDto.create(
          savedGroup.getId(),
          [],
          [],
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
}
