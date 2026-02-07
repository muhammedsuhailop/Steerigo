import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetPendingRideRequestsDto } from "@application/dto/driver/GetPendingRideRequestsDto";
import {
  GetPendingRideRequestsResponseDto,
  PendingRideRequestData,
} from "@application/dto/driver/GetPendingRideRequestsResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";

@injectable()
export class GetPendingRideRequestsUseCase
  implements
    IUseCase<
      GetPendingRideRequestsDto,
      Promise<Result<GetPendingRideRequestsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,
  ) {}

  async execute(
    dto: GetPendingRideRequestsDto,
  ): Promise<Result<GetPendingRideRequestsResponseDto>> {
    try {
      Logger.info("Fetching pending ride requests", {
        userId: dto.getUserId(),
        limit: dto.getLimit(),
        offset: dto.getOffset(),
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

      const pendingRequests =
        await this.rideRequestRepository.findPendingByDriverId(driverId);

      Logger.info("Pending ride requests fetched", {
        driverId,
        count: pendingRequests.length,
      });

      // Apply pagination
      const offset = dto.getOffset();
      const limit = dto.getLimit();
      const paginatedRequests = pendingRequests.slice(offset, offset + limit);

      const requestsData: PendingRideRequestData[] = paginatedRequests.map(
        (request) => ({
          requestId: request.getId(),
          riderId: request.getRiderId(),
          pickup: {
            latitude: request.getPickup().getLatitude(),
            longitude: request.getPickup().getLongitude(),
            address: request.getPickup().getAddress(),
          },
          drop: {
            latitude: request.getDrop().getLatitude(),
            longitude: request.getDrop().getLongitude(),
            address: request.getDrop().getAddress(),
          },
          rideType: request.getRideType(),
          fare: request.getFare(),
          currency: "INR",
          pickupTime: request.getPickupTime().toISOString(),
          pickupETA: request.getPickupETA(),
          status: request.getStatus(),
          createdAt: request.getCreatedAt().toISOString(),
        }),
      );

      const response: GetPendingRideRequestsResponseDto = {
        success: true,
        message: RIDE_MESSAGES.PENDING_REQUESTS_FETCHED,
        data: {
          requests: requestsData,
          total: pendingRequests.length,
          limit: dto.getLimit(),
          offset: dto.getOffset(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching pending ride requests", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
