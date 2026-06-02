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
exports.RejectFutureRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const FutureRideErrors_1 = require("@domain/errors/FutureRideErrors");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
const DomainError_1 = require("@domain/errors/DomainError");
const FutureRideRequestStatus_1 = require("@domain/value-objects/FutureRideRequestStatus");
const RedisLockKeys_1 = require("@shared/constants/RedisLockKeys");
const FutureRideMessages_1 = require("@shared/constants/FutureRideMessages");
let RejectFutureRideRequestUseCase = class RejectFutureRideRequestUseCase {
    constructor(driverRepository, futureRideRequestRepository, lockService, eventBus, futureRideExpiryService) {
        this.driverRepository = driverRepository;
        this.futureRideRequestRepository = futureRideRequestRepository;
        this.lockService = lockService;
        this.eventBus = eventBus;
        this.futureRideExpiryService = futureRideExpiryService;
        this.LOCK_TTL_SECONDS = Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
        this.LOCK_KEY_PREFIX = RedisLockKeys_1.REDIS_LOCK_KEYS.FUTURE_RIDE_ACCEPT;
    }
    async execute(dto) {
        const requestId = dto.getRequestId();
        const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
        let lockToken = null;
        try {
            Logger_1.Logger.info("Rejecting future ride request", {
                userId: dto.getUserId(),
                requestId,
            });
            lockToken = await this.lockService.acquireLock(lockKey, this.LOCK_TTL_SECONDS);
            if (!lockToken) {
                Logger_1.Logger.warn("Failed to acquire lock for future ride rejection — already being processed", { requestId });
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed("Request is already being processed"));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const futureRequest = await this.futureRideRequestRepository.findById(requestId);
            if (!futureRequest) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.requestGroupNotFound(requestId));
            }
            if (futureRequest.getDriverId() !== driverId) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.unauthorizedCancellation(requestId));
            }
            if (futureRequest.getStatus() !== FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.cannotCancelRequest(requestId, futureRequest.getStatus()));
            }
            const requestGroupId = futureRequest.getRequestGroupId();
            futureRequest.markRejected();
            await this.futureRideRequestRepository.save(futureRequest);
            Logger_1.Logger.info("Future ride request rejected by driver", {
                requestId,
                requestGroupId,
                driverId,
                riderId: futureRequest.getRiderId(),
            });
            const hasActiveRequestsRemaining = await this.futureRideRequestRepository.hasAnyActiveRequestInGroup(requestGroupId);
            if (!hasActiveRequestsRemaining) {
                await this.futureRideExpiryService.cancelGroupExpiry(requestGroupId);
                Logger_1.Logger.info("All requests in group exhausted after rejection — notifying rider", { requestGroupId, riderId: futureRequest.getRiderId() });
                const lastRejectedEvent = {
                    type: "FutureRideLastRequestRejected",
                    occurredAt: new Date(),
                    payload: {
                        requestGroupId,
                        riderId: futureRequest.getRiderId(),
                        pickupTime: futureRequest.getPickupTime().toISOString(),
                    },
                };
                await this.eventBus.publish(lastRejectedEvent);
            }
            const response = {
                success: true,
                message: FutureRideMessages_1.FUTURE_RIDE_SUCCESS_MESSAGES.REJECTED,
                data: {
                    futureRequestId: futureRequest.getId(),
                    requestGroupId,
                    driverId,
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error rejecting future ride request", {
                userId: dto.getUserId(),
                requestId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed(error instanceof Error ? error.message : "Unknown error"));
        }
        finally {
            if (lockToken) {
                await this.lockService.releaseLock(lockKey, lockToken);
            }
        }
    }
};
exports.RejectFutureRideRequestUseCase = RejectFutureRideRequestUseCase;
exports.RejectFutureRideRequestUseCase = RejectFutureRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.DistributedLockService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideExpiryService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RejectFutureRideRequestUseCase);
//# sourceMappingURL=RejectFutureRideRequestUseCase.js.map