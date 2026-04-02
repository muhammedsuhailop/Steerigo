import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetAdminRidesDto } from "@application/dto/admin/GetAdminRidesDto";
import {
  GetAdminRidesResponseDto,
  AdminRideData,
  DriverDetails,
  RiderDetails,
  CouponDetails,
} from "@application/dto/admin/GetAdminRidesResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { Ride } from "@domain/entities/Ride";
import { Driver } from "@domain/entities/Driver";
import { User } from "@domain/entities/User";

@injectable()
export class GetAdminRidesUseCase
  implements
    IUseCase<GetAdminRidesDto, Promise<Result<GetAdminRidesResponseDto>>>
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
    dto: GetAdminRidesDto,
  ): Promise<Result<GetAdminRidesResponseDto>> {
    try {
      Logger.info("Admin fetching all rides", {
        page: dto.getPage(),
        limit: dto.getLimit(),
        status: dto.getStatus(),
        riderId: dto.getRiderId(),
        driverId: dto.getDriverId(),
      });

      const paginatedResult = await this.rideRepository.findPaginatedAll({
        page: dto.getPage(),
        limit: dto.getLimit(),
        sortBy: dto.getSortBy(),
        sortOrder: dto.getSortOrder(),
        status: dto.getStatus(),
        fromDate: dto.getFromDate(),
        toDate: dto.getToDate(),
        riderId: dto.getRiderId(),
        driverId: dto.getDriverId(),
      });

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

      const uniqueRiderIds = [
        ...new Set(
          paginatedResult.data.map((ride) => normalize(ride.getRiderId())),
        ),
      ];

      const uniqueDriverUserIds = [
        ...new Set(Array.from(driverIdToUserIdMap.values())),
      ];

      const [riderUsers, driverUsers] = await Promise.all([
        this.userRepository.findByIds(uniqueRiderIds),
        this.userRepository.findByIds(uniqueDriverUserIds),
      ]);

      const riderUserMap = new Map<string, User>(
        riderUsers.map((u) => [normalize(u.getId()), u]),
      );

      const driverUserMap = new Map<string, User>(
        driverUsers.map((u) => [normalize(u.getId()), u]),
      );

      Logger.debug("Participants resolved for admin rides", {
        totalRides: paginatedResult.total,
        uniqueDrivers: uniqueDriverIds.length,
        uniqueRiders: uniqueRiderIds.length,
      });

      const ridesData: AdminRideData[] = paginatedResult.data.map(
        (ride: Ride) => {
          const rideDriverId = normalize(ride.getDriverId());
          const rideRiderId = normalize(ride.getRiderId());

          const driverUserId = driverIdToUserIdMap.get(rideDriverId);
          const driverUser = driverUserId
            ? driverUserMap.get(normalize(driverUserId))
            : undefined;

          const riderUser = riderUserMap.get(rideRiderId);

          const driverInfo: DriverDetails = {
            userId: driverUser?.getId() ?? "N/A",
            driverId: rideDriverId,
            name: driverUser?.getName() ?? "Unknown",
            email: driverUser?.getEmailValue() ?? "N/A",
            profilePicture: driverUser?.getProfilePicture(),
          };

          const riderInfo: RiderDetails = {
            userId: riderUser?.getId() ?? "N/A",
            name: riderUser?.getName() ?? "Unknown",
            email: riderUser?.getEmailValue() ?? "N/A",
            profilePicture: riderUser?.getProfilePicture(),
          };

          const couponData = ride.getCouponDetails();

          const couponDetails: CouponDetails | undefined = couponData
            ? {
                couponCode: couponData.code,
                discountType: couponData.discountType,
                discountAmount: couponData.discountAmount,
              }
            : undefined;

          return {
            id: ride.getId(),
            rideId: ride.getRideId(),
            driverId: ride.getDriverId(),
            riderId: ride.getRiderId(),
            driverInfo,
            riderInfo,
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
            couponDetails: couponDetails,
            createdAt: ride.getCreatedAt().toISOString(),
            updatedAt: ride.getUpdatedAt().toISOString(),
          };
        },
      );

      const response: GetAdminRidesResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDES_FETCHED_SUCCESSFULLY,
        data: {
          rides: ridesData,
          pagination: {
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
          },
        },
      };

      Logger.info("Admin rides fetched successfully", {
        total: paginatedResult.total,
        page: paginatedResult.page,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching admin rides", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
