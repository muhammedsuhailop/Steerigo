import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetUserRidesDto } from "@application/dto/user/GetUserRidesDto";
import {
  GetUserRidesResponseDto,
  UserRideData,
} from "@application/dto/user/GetUserRidesResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { Ride } from "@domain/entities/Ride";
import { Driver } from "@domain/entities/Driver";
import { User } from "@domain/entities/User";

@injectable()
export class GetUserRidesUseCase
  implements IUseCase<GetUserRidesDto, Promise<Result<GetUserRidesResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    dto: GetUserRidesDto,
  ): Promise<Result<GetUserRidesResponseDto>> {
    try {
      Logger.info("Fetching user rides", {
        userId: dto.getUserId(),
        page: dto.getPage(),
        limit: dto.getLimit(),
        status: dto.getStatus(),
      });

      const paginatedResult = await this.rideRepository.findPaginatedByRiderId(
        dto.getUserId(),
        {
          page: dto.getPage(),
          limit: dto.getLimit(),
          sortBy: dto.getSortBy(),
          sortOrder: dto.getSortOrder(),
          status: dto.getStatus(),
          fromDate: dto.getFromDate(),
          toDate: dto.getToDate(),
        },
      );

      const normalize = (id: string): string => id.toString().trim();

      const uniqueDriverIds = [
        ...new Set(
          paginatedResult.data.map((ride) => normalize(ride.getDriverId())),
        ),
      ];

      const drivers: Driver[] =
        await this.driverRepository.findByIds(uniqueDriverIds);

      const driverIdToUserIdMap = new Map<string, string>(
        drivers.map((driver) => [
          normalize(driver.getId()),
          normalize(driver.getUserId()),
        ]),
      );

      const uniqueDriverUserIds = [
        ...new Set(Array.from(driverIdToUserIdMap.values())),
      ];

      const driverUsers: User[] =
        await this.userRepository.findByIds(uniqueDriverUserIds);

      const userIdToUserMap = new Map<string, User>(
        driverUsers.map((u) => [normalize(u.getId()), u]),
      );

      Logger.debug("Driver info resolved for user rides", {
        userId: dto.getUserId(),
        totalRides: paginatedResult.total,
        uniqueDrivers: uniqueDriverIds.length,
        resolvedDriverUsers: driverUsers.length,
      });

      const ridesData: UserRideData[] = paginatedResult.data.map(
        (ride: Ride) => {
          const rideDriverId = normalize(ride.getDriverId());
          const driverUserId = driverIdToUserIdMap.get(rideDriverId);
          const driverUser = driverUserId
            ? userIdToUserMap.get(normalize(driverUserId))
            : undefined;

          return {
            id: ride.getId(),
            rideId: ride.getRideId(),
            driverId: ride.getDriverId(),
            riderId: ride.getRiderId(),
            driverInfo: {
              name: driverUser?.getName() ?? "Unknown",
              profilePicture: driverUser?.getProfilePicture(),
            },
            status: ride.getStatus(),
            pickup: {
              latitude: ride.getPickup().getLatitude(),
              longitude: ride.getPickup().getLongitude(),
              address: ride.getPickup().getAddress(),
            },
            drop: {
              latitude: ride.getDrop().getLatitude(),
              longitude: ride.getDrop().getLongitude(),
              address: ride.getDrop().getAddress(),
            },
            rideType: ride.getRideType(),
            fare: ride.getFare(),
            currency: ride.getCurrency(),
            paymentStatus: ride.getPaymentStatus(),
            timeline: {
              requestedAt: ride.getTimeline().getRequestedAt().toISOString(),
              acceptedAt: ride.getTimeline().getAcceptedAt()?.toISOString(),
              startedAt: ride.getTimeline().getStartedAt()?.toISOString(),
              completedAt: ride.getTimeline().getCompletedAt()?.toISOString(),
              cancelledAt: ride.getTimeline().getCancelledAt()?.toISOString(),
            },
            durationFormatted: ride.isCompleted()
              ? ride.getFormattedRideDuration()
              : undefined,
            createdAt: ride.getCreatedAt().toISOString(),
            updatedAt: ride.getUpdatedAt().toISOString(),
          };
        },
      );

      const response: GetUserRidesResponseDto = {
        rides: ridesData,
        pagination: {
          total: paginatedResult.total,
          page: paginatedResult.page,
          limit: paginatedResult.limit,
          totalPages: paginatedResult.totalPages,
        },
      };

      Logger.info("User rides fetched successfully", {
        userId: dto.getUserId(),
        total: paginatedResult.total,
        page: paginatedResult.page,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching user rides", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
