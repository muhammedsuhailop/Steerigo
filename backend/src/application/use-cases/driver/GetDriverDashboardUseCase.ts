import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverDashboardRepository } from "@domain/repositories/IDriverDashboardRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { DriverDashboardMapper } from "@infrastructure/database/mappers/DriverDashboardMapper";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetDriverDashboardUseCase
  implements
    IUseCase<GetDriverDashboardDto, Promise<Result<DriverDashboardResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: IDriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.DriverDashboardRepository)
    private dashboardRepository: IDriverDashboardRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    dto: GetDriverDashboardDto
  ): Promise<Result<DriverDashboardResponseDto>> {
    try {
      const userId = dto.getUserId();

      const driver = await this.driverRepository.findByUserId(userId);

      if (!driver) {
        Logger.warn("Driver not found for userId: ", { userId });
        return Result.failure(new DriverNotFoundError(userId));
      }

      const driverUser = await this.userRepository.findById(driver.getUserId());
      if (!driverUser) {
        Logger.warn("Driver user not found", { userId: driver.getUserId() });
        return Result.failure(new DomainError("Driver user not found"));
      }

      const driverId = driver.getId();

      // Fetch all dashboard data in parallel
      const [dashboardData, availability] = await Promise.all([
        this.dashboardRepository.getDashboardData(driverId),
        this.availabilityRepository.findByDriverId(driverId),
      ]);

      // Fetch rider user for current ride if exists
      let currentRideRiderUser = null;
      if (dashboardData.currentRide) {
        currentRideRiderUser = await this.userRepository.findById(
          dashboardData.currentRide.getRiderId()
        );
      }

      // Fetch rider users for pending requests
      const pendingRequestUsers = await Promise.all(
        dashboardData.pendingRequests.map((req) =>
          this.userRepository.findById(req.getRiderId())
        )
      );

      // Map to response DTO
      const response = DriverDashboardMapper.toResponseDto(
        driver,
        driverUser,
        availability,
        dashboardData.currentRide,
        currentRideRiderUser,
        dashboardData.pendingRequests,
        pendingRequestUsers,
        dashboardData.statistics,
        dashboardData.performance,
        dashboardData.scheduledRidesCount
      );

      Logger.info("Driver dashboard fetched successfully", { driverId });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver dashboard", { error });
      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to fetch driver dashboard")
      );
    }
  }
}
