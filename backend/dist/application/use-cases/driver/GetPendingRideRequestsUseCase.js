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
exports.GetPendingRideRequestsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
let GetPendingRideRequestsUseCase = class GetPendingRideRequestsUseCase {
    constructor(driverRepository, rideRequestRepository) {
        this.driverRepository = driverRepository;
        this.rideRequestRepository = rideRequestRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching pending ride requests", {
                userId: dto.getUserId(),
                limit: dto.getLimit(),
                offset: dto.getOffset(),
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
            const pendingRequests = await this.rideRequestRepository.findPendingByDriverId(driverId);
            Logger_1.Logger.info("Pending ride requests fetched", {
                driverId,
                count: pendingRequests.length,
            });
            const offset = dto.getOffset();
            const limit = dto.getLimit();
            const paginatedRequests = pendingRequests.slice(offset, offset + limit);
            const requestsData = paginatedRequests.map((request) => ({
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
                fareBreakdown: request.getFareBreakdown(),
                pickupTime: request.getPickupTime().toISOString(),
                pickupETA: request.getPickupETA(),
                status: request.getStatus(),
                createdAt: request.getCreatedAt().toISOString(),
            }));
            const response = {
                requests: requestsData,
                total: pendingRequests.length,
                limit: dto.getLimit(),
                offset: dto.getOffset(),
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching pending ride requests", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetPendingRideRequestsUseCase = GetPendingRideRequestsUseCase;
exports.GetPendingRideRequestsUseCase = GetPendingRideRequestsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetPendingRideRequestsUseCase);
//# sourceMappingURL=GetPendingRideRequestsUseCase.js.map