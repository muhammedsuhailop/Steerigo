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
exports.GetAdminRidesUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideMessages_1 = require("@shared/constants/RideMessages");
let GetAdminRidesUseCase = class GetAdminRidesUseCase {
    constructor(rideRepository, driverRepository, userRepository) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Admin fetching all rides", {
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
            const normalize = (id) => id.toString().trim();
            const uniqueDriverIds = [
                ...new Set(paginatedResult.data.map((ride) => normalize(ride.getDriverId()))),
            ];
            const drivers = await this.driverRepository.findByIds(uniqueDriverIds);
            const driverIdToUserIdMap = new Map(drivers.map((driver) => [
                normalize(driver.getId()),
                normalize(driver.getUserId()),
            ]));
            const uniqueRiderIds = [
                ...new Set(paginatedResult.data.map((ride) => normalize(ride.getRiderId()))),
            ];
            const uniqueDriverUserIds = [
                ...new Set(Array.from(driverIdToUserIdMap.values())),
            ];
            const [riderUsers, driverUsers] = await Promise.all([
                this.userRepository.findByIds(uniqueRiderIds),
                this.userRepository.findByIds(uniqueDriverUserIds),
            ]);
            const riderUserMap = new Map(riderUsers.map((u) => [normalize(u.getId()), u]));
            const driverUserMap = new Map(driverUsers.map((u) => [normalize(u.getId()), u]));
            Logger_1.Logger.debug("Participants resolved for admin rides", {
                totalRides: paginatedResult.total,
                uniqueDrivers: uniqueDriverIds.length,
                uniqueRiders: uniqueRiderIds.length,
            });
            const ridesData = paginatedResult.data.map((ride) => {
                const rideDriverId = normalize(ride.getDriverId());
                const rideRiderId = normalize(ride.getRiderId());
                const driverUserId = driverIdToUserIdMap.get(rideDriverId);
                const driverUser = driverUserId
                    ? driverUserMap.get(normalize(driverUserId))
                    : undefined;
                const riderUser = riderUserMap.get(rideRiderId);
                const driverInfo = {
                    userId: driverUser?.getId() ?? "N/A",
                    driverId: rideDriverId,
                    name: driverUser?.getName() ?? "Unknown",
                    email: driverUser?.getEmailValue() ?? "N/A",
                    profilePicture: driverUser?.getProfilePicture(),
                };
                const riderInfo = {
                    userId: riderUser?.getId() ?? "N/A",
                    name: riderUser?.getName() ?? "Unknown",
                    email: riderUser?.getEmailValue() ?? "N/A",
                    profilePicture: riderUser?.getProfilePicture(),
                };
                const couponData = ride.getCouponDetails();
                const couponDetails = couponData
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
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDES_FETCHED_SUCCESSFULLY,
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
            Logger_1.Logger.info("Admin rides fetched successfully", {
                total: paginatedResult.total,
                page: paginatedResult.page,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin rides", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminRidesUseCase = GetAdminRidesUseCase;
exports.GetAdminRidesUseCase = GetAdminRidesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetAdminRidesUseCase);
//# sourceMappingURL=GetAdminRidesUseCase.js.map