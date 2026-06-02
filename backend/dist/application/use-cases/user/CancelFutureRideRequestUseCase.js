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
exports.CancelFutureRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const CancelFutureRideResponseDto_1 = require("../../dto/user/CancelFutureRideResponseDto");
const FutureRideErrors_1 = require("../../../domain/errors/FutureRideErrors");
const FutureRideRequestStatus_1 = require("../../../domain/value-objects/FutureRideRequestStatus");
let CancelFutureRideRequestUseCase = class CancelFutureRideRequestUseCase {
    constructor(futureRideRequestRepository, futureRideExpiryService, eventBus) {
        this.futureRideRequestRepository = futureRideRequestRepository;
        this.futureRideExpiryService = futureRideExpiryService;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        try {
            dto.validate();
            const requests = await this.futureRideRequestRepository.findByRequestGroupId(dto.requestGroupId);
            if (requests.length === 0) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.requestGroupNotFound(dto.requestGroupId));
            }
            const ownedByRider = requests.every((r) => r.getRiderId() === dto.getRiderId());
            if (!ownedByRider) {
                return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.unauthorizedCancellation(dto.requestGroupId));
            }
            const cancellableStatuses = [
                FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING,
                FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED,
            ];
            const activeRequests = requests.filter((r) => cancellableStatuses.includes(r.getStatus()));
            if (activeRequests.length === 0) {
                Logger_1.Logger.info("No active future ride requests to cancel", {
                    requestGroupId: dto.requestGroupId,
                    riderId: dto.getRiderId(),
                });
                return Result_1.Result.success(CancelFutureRideResponseDto_1.CancelFutureRideResponseDto.create(dto.requestGroupId, 0));
            }
            await this.futureRideExpiryService.cancelGroupExpiry(dto.requestGroupId);
            const cancelledCount = await this.futureRideRequestRepository.cancelAllPendingInGroup(dto.requestGroupId);
            Logger_1.Logger.info("Future ride group cancelled by rider", {
                requestGroupId: dto.requestGroupId,
                riderId: dto.getRiderId(),
                cancelledCount,
            });
            const groupEvent = {
                type: "FutureRideCancelledByRider",
                occurredAt: new Date(),
                payload: {
                    requestGroupId: dto.requestGroupId,
                    riderId: dto.getRiderId(),
                    cancelledCount,
                },
            };
            await this.eventBus.publish(groupEvent);
            await Promise.all(activeRequests.map((request) => this.eventBus.publish({
                type: "FutureRideRequestCancelledForDriver",
                occurredAt: new Date(),
                payload: {
                    futureRequestId: request.getId(),
                    requestGroupId: dto.requestGroupId,
                    driverId: request.getDriverId(),
                    driverUserId: request.getDriverUserId(),
                    acceptedByDriverId: null,
                    cancelledByRider: true,
                },
            })));
            return Result_1.Result.success(CancelFutureRideResponseDto_1.CancelFutureRideResponseDto.create(dto.requestGroupId, cancelledCount));
        }
        catch (error) {
            Logger_1.Logger.error("Cancel future ride failed", {
                error,
                requestGroupId: dto.requestGroupId,
                riderId: dto.getRiderId(),
            });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(FutureRideErrors_1.FutureRideErrors.scheduleFailed(error instanceof Error ? error.message : "Unknown error"));
        }
    }
};
exports.CancelFutureRideRequestUseCase = CancelFutureRideRequestUseCase;
exports.CancelFutureRideRequestUseCase = CancelFutureRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideRequestRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.FutureRideExpiryService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CancelFutureRideRequestUseCase);
//# sourceMappingURL=CancelFutureRideRequestUseCase.js.map