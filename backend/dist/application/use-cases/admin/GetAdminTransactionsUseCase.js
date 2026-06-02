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
exports.GetAdminTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const TransactionMessages_1 = require("@shared/constants/TransactionMessages");
let GetAdminTransactionsUseCase = class GetAdminTransactionsUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Admin get transactions requested", {
                filters: dto.filters,
            });
            const result = await this.transactionRepository.findAllPaginated(dto.filters);
            const transactions = result.transactions.map((tx) => ({
                transactionId: tx.getId(),
                walletId: tx.getWalletId(),
                type: tx.getType(),
                direction: tx.getDirection(),
                amount: tx.getAmount().getAmount(),
                currency: tx.getAmount().getCurrency(),
                signedAmount: tx.getSignedAmount(),
                relatedEntityId: tx.getRelatedEntityId(),
                relatedEntityType: tx.getRelatedEntityType(),
                groupId: tx.getGroupId(),
                note: tx.getNote(),
                metadata: tx.getMetadata(),
                createdAt: tx.getCreatedAt().toISOString(),
            }));
            Logger_1.Logger.info("Admin transactions fetched successfully", {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
            });
            return Result_1.Result.success({
                success: true,
                message: TransactionMessages_1.TRANSACTION__MESSAGES.FETCHED,
                data: {
                    transactions,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        totalPages: result.totalPages,
                    },
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin transactions", {
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminTransactionsUseCase = GetAdminTransactionsUseCase;
exports.GetAdminTransactionsUseCase = GetAdminTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __metadata("design:paramtypes", [Object])
], GetAdminTransactionsUseCase);
//# sourceMappingURL=GetAdminTransactionsUseCase.js.map