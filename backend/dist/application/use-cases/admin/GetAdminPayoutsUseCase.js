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
exports.GetAdminPayoutsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
let GetAdminPayoutsUseCase = class GetAdminPayoutsUseCase {
    constructor(payoutRepository) {
        this.payoutRepository = payoutRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Admin fetching payouts", {
                status: dto.getStatus(),
                driverId: dto.getDriverId(),
                page: dto.getPage(),
            });
            const result = await this.payoutRepository.findAllWithFilters({
                status: dto.getStatus(),
                driverId: dto.getDriverId(),
                page: dto.getPage(),
                limit: dto.getLimit(),
                sortBy: dto.getSortBy(),
                sortOrder: dto.getSortOrder(),
            });
            return Result_1.Result.success({
                payouts: result.payouts.map(this.toPayoutItemDto),
                total: result.total,
                page: result.page,
                limit: result.limit,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching payouts for admin", {
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
exports.GetAdminPayoutsUseCase = GetAdminPayoutsUseCase;
exports.GetAdminPayoutsUseCase = GetAdminPayoutsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PayoutRepository)),
    __metadata("design:paramtypes", [Object])
], GetAdminPayoutsUseCase);
//# sourceMappingURL=GetAdminPayoutsUseCase.js.map