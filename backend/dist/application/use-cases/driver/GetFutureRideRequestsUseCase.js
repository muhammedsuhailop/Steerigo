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
exports.GetFutureRideRequestsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const FutureRideMessages_1 = require("../../../shared/constants/FutureRideMessages");
let GetFutureRideRequestsUseCase = class GetFutureRideRequestsUseCase {
    constructor(driverRepository, futureRideRequestRepository) {
        this.driverRepository = driverRepository;
        this.futureRideRequestRepository = futureRideRequestRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching future ride requests for driver", {
                userId: dto.getUserId(),
                status: dto.getStatus(),
                page: dto.getPage(),
                limit: dto.getLimit(),
            });
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const { requests, total } = await this.futureRideRequestRepository.findByDriverIdWithFilters(driverId, {
                status: dto.getStatus(),
                offset: dto.getOffset(),
                limit: dto.getLimit(),
            });
            Logger_1.Logger.info("Future ride requests fetched", {
                driverId,
                count: requests.length,
                total,
                status: dto.getStatus(),
            });
            const requestsData = requests.map((request) => ({
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
            const response = {
                success: true,
                message: FutureRideMessages_1.FUTURE_RIDE_SUCCESS_MESSAGES.REQUESTS_FETCHED,
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
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching future ride requests", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetFutureRideRequestsUseCase = GetFutureRideRequestsUseCase;
exports.GetFutureRideRequestsUseCase = GetFutureRideRequestsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetFutureRideRequestsUseCase);
//# sourceMappingURL=GetFutureRideRequestsUseCase.js.map