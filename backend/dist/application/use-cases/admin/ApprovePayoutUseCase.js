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
exports.ApprovePayoutUseCase = void 0;
const inversify_1 = require("inversify");
const Transaction_1 = require("../../../domain/entities/Transaction");
const WalletOwnerType_1 = require("../../../domain/value-objects/WalletOwnerType");
const TransactionType_1 = require("../../../domain/value-objects/TransactionType");
const TransactionDirection_1 = require("../../../domain/value-objects/TransactionDirection");
const PayoutStatus_1 = require("../../../domain/value-objects/PayoutStatus");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const PayoutErrors_1 = require("../../../domain/errors/PayoutErrors");
const mongoose_1 = require("mongoose");
const AdminMessages_1 = require("../../../shared/constants/AdminMessages");
let ApprovePayoutUseCase = class ApprovePayoutUseCase {
    constructor(payoutRepository, walletRepository, transactionRepository) {
        this.payoutRepository = payoutRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }
    async execute(dto) {
        const payoutId = dto.getPayoutId();
        try {
            Logger_1.Logger.info("Approving payout", { payoutId, adminId: dto.getAdminId() });
            const payout = await this.payoutRepository.findById(payoutId);
            if (!payout) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.payoutNotFound(payoutId));
            }
            if (payout.getStatus() !== PayoutStatus_1.PayoutStatus.REQUESTED) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.payoutNotRequested(payoutId));
            }
            const driverId = payout.getDriverId();
            const wallet = await this.walletRepository.findByOwner(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER);
            if (!wallet) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.driverWalletNotFound(driverId));
            }
            const payoutAmount = payout.getAmount();
            if (wallet.getAvailableBalance().getAmount() < payoutAmount.getAmount()) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.insufficientDriverBalance(wallet.getAvailableBalance().getAmount().toString(), payoutAmount.getAmount().toString()));
            }
            payout.markProcessing();
            await this.payoutRepository.save(payout);
            try {
                wallet.debit(payoutAmount);
                await this.walletRepository.save(wallet);
                const transaction = Transaction_1.Transaction.create({
                    id: new mongoose_1.Types.ObjectId().toString(),
                    walletId: wallet.getId(),
                    type: TransactionType_1.TransactionType.PAYOUT,
                    direction: TransactionDirection_1.TransactionDirection.DEBIT,
                    amount: payoutAmount,
                    relatedEntityId: payoutId,
                    relatedEntityType: "Payout",
                    note: `Payout withdrawal for driver ${driverId}`,
                });
                await this.transactionRepository.save(transaction);
                const processedAt = new Date();
                payout.markCompleted(processedAt);
                const savedPayout = await this.payoutRepository.save(payout);
                Logger_1.Logger.info("Payout approved and completed", {
                    payoutId,
                    driverId,
                    amount: payoutAmount.getAmount(),
                    walletBalanceAfter: wallet.getAvailableBalance().getAmount(),
                });
                return Result_1.Result.success({
                    success: true,
                    message: AdminMessages_1.ADMIN_MESSAGES.PAYOUT.APPROVED,
                    data: {
                        payoutId: savedPayout.getId(),
                        driverId,
                        amount: payoutAmount.getAmount(),
                        currency: savedPayout.getCurrency(),
                        status: savedPayout.getStatus(),
                        processedAt: processedAt.toISOString(),
                        driverWalletBalanceAfter: wallet.getAvailableBalance().getAmount(),
                    },
                });
            }
            catch (innerError) {
                payout.markFailed(innerError instanceof Error
                    ? innerError.message
                    : AdminMessages_1.ADMIN_ERROR_MESSAGES.PAYOUT.WALLET_DEBIT_FAILED_ON_APPROVAL);
                await this.payoutRepository.save(payout);
                Logger_1.Logger.error("Payout approval failed at wallet debit stage", {
                    payoutId,
                    driverId,
                    error: innerError instanceof Error
                        ? innerError.message
                        : String(innerError),
                });
                return Result_1.Result.failure(innerError);
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error approving payout", {
                payoutId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.ApprovePayoutUseCase = ApprovePayoutUseCase;
exports.ApprovePayoutUseCase = ApprovePayoutUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.PayoutRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ApprovePayoutUseCase);
//# sourceMappingURL=ApprovePayoutUseCase.js.map