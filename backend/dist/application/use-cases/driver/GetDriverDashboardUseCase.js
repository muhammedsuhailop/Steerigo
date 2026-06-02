"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverDashboardUseCase = void 0;
const inversify_1 = require("inversify");
const DriverDashboardMapper_1 = require("@infrastructure/database/mappers/DriverDashboardMapper");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
let GetDriverDashboardUseCase = class GetDriverDashboardUseCase {
    constructor(driverRepository, availabilityRepository, dashboardRepository, userRepository) {
        this.driverRepository = driverRepository;
        this.availabilityRepository = availabilityRepository;
        this.dashboardRepository = dashboardRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const driver = await this.driverRepository.findByUserId(userId);
            if (!driver) {
                Logger_1.Logger.warn("Driver not found for userId: ", { userId });
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(userId));
            }
            const driverUser = await this.userRepository.findById(driver.getUserId());
            if (!driverUser) {
                Logger_1.Logger.warn("Driver user not found", { userId: driver.getUserId() });
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver user not found"));
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
                currentRideRiderUser = await this.userRepository.findById(dashboardData.currentRide.getRiderId());
            }
            // Fetch rider users for pending requests
            const pendingRequestUsers = await Promise.all(dashboardData.pendingRequests.map((req) => this.userRepository.findById(req.getRiderId())));
            // Map to response DTO
            const response = DriverDashboardMapper_1.DriverDashboardMapper.toResponseDto(driver, driverUser, availability, dashboardData.currentRide, currentRideRiderUser, dashboardData.pendingRequests, pendingRequestUsers, dashboardData.statistics, dashboardData.performance, dashboardData.scheduledRidesCount);
            Logger_1.Logger.info("Driver dashboard fetched successfully", { driverId });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching driver dashboard", { error });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to fetch driver dashboard"));
        }
    }
};
exports.GetDriverDashboardUseCase = GetDriverDashboardUseCase;
exports.GetDriverDashboardUseCase = GetDriverDashboardUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.DriverDashboardRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetDriverDashboardUseCase);
//# sourceMappingURL=GetDriverDashboardUseCase.js.map