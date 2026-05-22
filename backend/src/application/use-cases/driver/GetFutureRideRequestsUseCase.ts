import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetFutureRideRequestsDto } from "@application/dto/driver/GetFutureRideRequestsDto";
import {
  GetFutureRideRequestsResponseDto,
  FutureRideRequestData,
} from "@application/dto/driver/GetFutureRideRequestsResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { FUTURE_RIDE_SUCCESS_MESSAGES } from "@shared/constants/FutureRideMessages";

@injectable()
export class GetFutureRideRequestsUseCase implements IUseCase<
  GetFutureRideRequestsDto,
  Promise<Result<GetFutureRideRequestsResponseDto>>
> {
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
  ) {}

  async execute(
    dto: GetFutureRideRequestsDto,
  ): Promise<Result<GetFutureRideRequestsResponseDto>> {
    try {
      Logger.info("Fetching future ride requests for driver", {
        userId: dto.getUserId(),
        status: dto.getStatus(),
        page: dto.getPage(),
        limit: dto.getLimit(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());

      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const { requests, total } =
        await this.futureRideRequestRepository.findByDriverIdWithFilters(
          driverId,
          {
            status: dto.getStatus(),
            offset: dto.getOffset(),
            limit: dto.getLimit(),
          },
        );

      Logger.info("Future ride requests fetched", {
        driverId,
        count: requests.length,
        total,
        status: dto.getStatus(),
      });

      const requestsData: FutureRideRequestData[] = requests.map((request) => ({
        requestId: request.getId(),
        requestGroupId: request.getRequestGroupId(),
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
        fare: request.getFareBreakdown().getTotalFare().getAmount(),
        currency: request.getFareBreakdown().getTotalFare().getCurrency(),
        pickupTime: request.getPickupTime().toISOString(),
        pickupETA: request.getPickupETA(),
        status: request.getStatus(),
        requiredDuration: request.getrequiredDuration(),
        createdAt: request.getCreatedAt().toISOString(),
      }));

      const totalPages = Math.ceil(total / dto.getLimit());

      const response: GetFutureRideRequestsResponseDto = {
        success: true,
        message: FUTURE_RIDE_SUCCESS_MESSAGES.REQUESTS_FETCHED,
        data: {
          requests: requestsData,
          pagination: {
            total,
            page: dto.getPage(),
            limit: dto.getLimit(),
            totalPages,
          },
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching future ride requests", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
