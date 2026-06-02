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
exports.RejectRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideRequestErrors_1 = require("@domain/errors/RideRequestErrors");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
const RideMessages_1 = require("@shared/constants/RideMessages");
const RedisLockKeys_1 = require("@shared/constants/RedisLockKeys");
let RejectRideRequestUseCase = class RejectRideRequestUseCase {
    constructor(driverRepository, rideRequestRepository, rideRequestGroupRepository, rideSearchDispatchService, lockService) {
        this.driverRepository = driverRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.rideRequestGroupRepository = rideRequestGroupRepository;
        this.rideSearchDispatchService = rideSearchDispatchService;
        this.lockService = lockService;
        this.LOCK_TTL_SECONDS = Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
        this.LOCK_KEY_PREFIX = RedisLockKeys_1.REDIS_LOCK_KEYS.RIDE_ACCEPT;
    }
    async execute(dto) {
        const requestId = dto.getRequestId();
        const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
        let lockToken = null;
        try {
            Logger_1.Logger.info("Rejecting ride request", {
                userId: dto.getUserId(),
                requestId,
                reason: dto.getReason(),
            });
            lockToken = await this.lockService.acquireLock(lockKey, this.LOCK_TTL_SECONDS);
            if (!lockToken) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.requestAlreadyBeingProcessed(requestId));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const rideRequest = await this.rideRequestRepository.findById(requestId);
            if (!rideRequest) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotFound(requestId));
            }
            if (rideRequest.getDriverId().toString() !== driverId) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotForDriver(requestId, driverId));
            }
            if (!rideRequest.isPending()) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestNotPending(requestId, rideRequest.getStatus()));
            }
            rideRequest.markAsRejected();
            await this.rideRequestRepository.save(rideRequest);
            const groupId = rideRequest.getRequestGroupId();
            const group = await this.rideRequestGroupRepository.findActiveById(groupId);
            if (group) {
                const nextIndex = group.getCurrentIndex() + 1;
                await this.rideRequestGroupRepository.updateCurrentIndex(groupId, nextIndex);
                await this.rideSearchDispatchService.publishSearchProgress({
                    requestGroupId: groupId,
                    riderId: group.getRiderId(),
                    currentIndex: nextIndex,
                    totalCandidates: group.getCandidateDriverIds().length,
                    message: "Finding another nearby driver...",
                    status: "SEARCHING",
                });
                await this.rideSearchDispatchService.dispatchNextRequest(groupId, nextIndex);
            }
            Logger_1.Logger.info("Ride request rejected successfully", {
                requestId,
                driverId,
                reason: dto.getReason(),
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_REQUEST_REJECTED,
                data: {
                    requestId: rideRequest.getId(),
                    status: rideRequest.getStatus(),
                    rejectedAt: new Date().toISOString(),
                    reason: dto.getReason(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error rejecting ride request", {
                userId: dto.getUserId(),
                requestId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
        finally {
            if (lockToken) {
                await this.lockService.releaseLock(lockKey, lockToken);
            }
        }
    }
};
exports.RejectRideRequestUseCase = RejectRideRequestUseCase;
exports.RejectRideRequestUseCase = RejectRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestGroupRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.RideSearchDispatchService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RejectRideRequestUseCase);
//# sourceMappingURL=RejectRideRequestUseCase.js.map