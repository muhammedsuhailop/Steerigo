import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverRidesDto } from "@application/dto/driver/GetDriverRidesDto";
import {
  GetDriverRidesResponseDto,
  RideData,
} from "@application/dto/driver/GetDriverRidesResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";

@injectable()
export class GetDriverRidesUseCase
  implements
    IUseCase<GetDriverRidesDto, Promise<Result<GetDriverRidesResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute(
    dto: GetDriverRidesDto,
  ): Promise<Result<GetDriverRidesResponseDto>> {
    try {
      Logger.info("Fetching driver rides", {
        userId: dto.getUserId(),
        page: dto.getPage(),
        limit: dto.getLimit(),
        status: dto.getStatus(),
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

      const paginatedResult = await this.rideRepository.findPaginatedByDriverId(
        driverId,
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

      Logger.info("Driver rides fetched successfully", {
        driverId,
        total: paginatedResult.total,
        page: paginatedResult.page,
      });

      // Fetch rider information for all rides
      const riderIds = [
        ...new Set(paginatedResult.data.map((ride) => ride.getRiderId())),
      ];

      const riders = await Promise.all(
        riderIds.map((riderId) => this.userRepository.findById(riderId)),
      );

      const riderMap = new Map(
        riders
          .filter((rider) => rider !== null)
          .map((rider) => [rider!.getId(), rider!]),
      );

      Logger.debug("Rider information fetched", {
        riderCount: riderMap.size,
      });

      const ridesData: RideData[] = paginatedResult.data.map((ride) => {
        const rider = riderMap.get(ride.getRiderId());

        return {
          id: ride.getId(),
          rideId: ride.getRideId(),
          riderId: ride.getRiderId(),
          riderInfo: {
            name: rider?.getName() || "Unknown",
            email: rider?.getEmailValue() || "N/A",
            profilePicture: rider?.getProfilePicture(),
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
            arrivedAt: ride.getTimeline().getArrivedAt()?.toISOString(),
            startedAt: ride.getTimeline().getStartedAt()?.toISOString(),
            completedAt: ride.getTimeline().getCompletedAt()?.toISOString(),
            cancelledAt: ride.getTimeline().getCancelledAt()?.toISOString(),
          },
          createdAt: ride.getCreatedAt().toISOString(),
          updatedAt: ride.getUpdatedAt().toISOString(),
        };
      });

      const response: GetDriverRidesResponseDto = {
        rides: ridesData,
        pagination: {
          total: paginatedResult.total,
          page: paginatedResult.page,
          limit: paginatedResult.limit,
          totalPages: paginatedResult.totalPages,
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver rides", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
