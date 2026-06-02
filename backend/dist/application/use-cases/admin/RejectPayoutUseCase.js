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
exports.RejectPayoutUseCase = void 0;
const inversify_1 = require("inversify");
const PayoutStatus_1 = require("@domain/value-objects/PayoutStatus");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const PayoutErrors_1 = require("@domain/errors/PayoutErrors");
const AdminMessages_1 = require("@shared/constants/AdminMessages");
let RejectPayoutUseCase = class RejectPayoutUseCase {
    constructor(payoutRepository) {
        this.payoutRepository = payoutRepository;
    }
    async execute(dto) {
        const payoutId = dto.getPayoutId();
        try {
            Logger_1.Logger.info("Rejecting payout", { payoutId, adminId: dto.getAdminId() });
            const payout = await this.payoutRepository.findById(payoutId);
            if (!payout) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.payoutNotFound(payoutId));
            }
            if (payout.getStatus() !== PayoutStatus_1.PayoutStatus.REQUESTED) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.payoutNotRequested(payoutId));
            }
            payout.markFailed(dto.getReason());
            const savedPayout = await this.payoutRepository.save(payout);
            Logger_1.Logger.info("Payout rejected", {
                payoutId,
                driverId: savedPayout.getDriverId(),
                reason: dto.getReason(),
            });
            return Result_1.Result.success({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.PAYOUT.REJECTED,
                data: {
                    payoutId: savedPayout.getId(),
                    driverId: savedPayout.getDriverId(),
                    status: savedPayout.getStatus(),
                    failureReason: dto.getReason(),
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error rejecting payout", {
                payoutId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.RejectPayoutUseCase = RejectPayoutUseCase;
exports.RejectPayoutUseCase = RejectPayoutUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PayoutRepository)),
    __metadata("design:paramtypes", [Object])
], RejectPayoutUseCase);
//# sourceMappingURL=RejectPayoutUseCase.js.map