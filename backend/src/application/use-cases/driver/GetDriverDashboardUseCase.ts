import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverDashboardRepository } from "@application/repositories/DriverDashboardRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { DriverDashboardMapper } from "@infrastructure/database/mappers/DriverDashboardMapper";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetDriverDashboardUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: DriverAvailabilityRepository,
    @inject(TYPES.DriverDashboardRepository)
    private dashboardRepository: DriverDashboardRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(
    dto: GetDriverDashboardDto
  ): Promise<Result<DriverDashboardResponseDto>> {
    try {
      const userId = dto.getUserId();

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DomainError("Driver profile not found"));
      }

      if (!driver) {
        Logger.warn("Driver not found for userId: ", { userId });
        return Result.failure(new DomainError("Driver not found"));
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
