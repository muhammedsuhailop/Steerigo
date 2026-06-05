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
exports.GetDriverPayoutsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
let GetDriverPayoutsUseCase = class GetDriverPayoutsUseCase {
    constructor(driverRepository, payoutRepository) {
        this.driverRepository = driverRepository;
        this.payoutRepository = payoutRepository;
    }
    async execute(dto) {
        try {
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const payouts = await this.payoutRepository.findByDriverId(driverId);
            Logger_1.Logger.info("Retrieved driver payouts", {
                driverId,
                count: payouts.length,
            });
            return Result_1.Result.success({
                payouts: payouts.map(this.toPayoutItemDto),
                total: payouts.length,
                page: 1,
                limit: payouts.length,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching driver payouts", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    toPayoutItemDto(payout) {
        return {
            payoutId: payout.getId(),
            driverId: payout.getDriverId(),
            amount: payout.getAmount().getAmount(),
            currency: payout.getCurrency(),
            method: payout.getMethod(),
            status: payout.getStatus(),
            destination: payout.getDestination(),
            failureReason: payout.getFailureReason(),
            createdAt: payout.getCreatedAt().toISOString(),
            processedAt: payout.getProcessedAt()?.toISOString(),
            updatedAt: payout.getUpdatedAt().toISOString(),
        };
    }
};
exports.GetDriverPayoutsUseCase = GetDriverPayoutsUseCase;
exports.GetDriverPayoutsUseCase = GetDriverPayoutsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PayoutRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetDriverPayoutsUseCase);
//# sourceMappingURL=GetDriverPayoutsUseCase.js.map