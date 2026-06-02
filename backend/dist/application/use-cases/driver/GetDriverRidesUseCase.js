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
exports.GetDriverRidesUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
const RideMessages_1 = require("@shared/constants/RideMessages");
let GetDriverRidesUseCase = class GetDriverRidesUseCase {
    constructor(driverRepository, rideRepository, userRepository) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching driver rides", {
                userId: dto.getUserId(),
                page: dto.getPage(),
                limit: dto.getLimit(),
                status: dto.getStatus(),
            });
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            Logger_1.Logger.debug("Driver found for user", {
                userId: dto.getUserId(),
                driverId,
            });
            const paginatedResult = await this.rideRepository.findPaginatedByDriverId(driverId, {
                page: dto.getPage(),
                limit: dto.getLimit(),
                sortBy: dto.getSortBy(),
                sortOrder: dto.getSortOrder(),
                status: dto.getStatus(),
                fromDate: dto.getFromDate(),
                toDate: dto.getToDate(),
            });
            Logger_1.Logger.info("Driver rides fetched successfully", {
                driverId,
                total: paginatedResult.total,
                page: paginatedResult.page,
            });
            // Fetch rider information for all rides
            const riderIds = [
                ...new Set(paginatedResult.data.map((ride) => ride.getRiderId())),
            ];
            const riders = await Promise.all(riderIds.map((riderId) => this.userRepository.findById(riderId)));
            const riderMap = new Map(riders
                .filter((rider) => rider !== null)
                .map((rider) => [rider.getId(), rider]));
            Logger_1.Logger.debug("Rider information fetched", {
                riderCount: riderMap.size,
            });
            const ridesData = paginatedResult.data.map((ride) => {
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
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching driver rides", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetDriverRidesUseCase = GetDriverRidesUseCase;
exports.GetDriverRidesUseCase = GetDriverRidesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetDriverRidesUseCase);
//# sourceMappingURL=GetDriverRidesUseCase.js.map