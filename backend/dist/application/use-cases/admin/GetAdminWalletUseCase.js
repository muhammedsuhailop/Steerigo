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
exports.GetAdminWalletUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const Wallet_1 = require("@domain/entities/Wallet");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const AdminMessages_1 = require("@shared/constants/AdminMessages");
let GetAdminWalletUseCase = class GetAdminWalletUseCase {
    constructor(walletRepository, transactionRepository, idGenerator) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.idGenerator = idGenerator;
    }
    async execute(dto) {
        const ADMIN_WALLET_OWNER_ID = process.env
            .ADMIN_WALLET_OWNER_ID;
        try {
            Logger_1.Logger.info("Fetching admin wallet", {
                page: dto.getPage(),
                limit: dto.getLimit(),
                type: dto.getType(),
                direction: dto.getDirection(),
            });
            let wallet = await this.walletRepository.findByOwner(ADMIN_WALLET_OWNER_ID, WalletOwnerType_1.WalletOwnerType.PLATFORM);
            if (!wallet) {
                Logger_1.Logger.info("Admin platform wallet not found, creating new one during fetch", { ownerId: ADMIN_WALLET_OWNER_ID });
                wallet = Wallet_1.Wallet.create({
                    id: this.idGenerator.generate(),
                    ownerId: ADMIN_WALLET_OWNER_ID,
                    ownerType: WalletOwnerType_1.WalletOwnerType.PLATFORM,
                });
                await this.walletRepository.save(wallet);
            }
            const paginatedResult = await this.transactionRepository.findPaginatedByWalletId(wallet.getId(), {
                type: dto.getType(),
                direction: dto.getDirection(),
                fromDate: dto.getFromDate(),
                toDate: dto.getToDate(),
                page: dto.getPage(),
                limit: dto.getLimit(),
                sortOrder: dto.getSortOrder(),
            });
            Logger_1.Logger.info("Admin wallet fetched successfully", {
                walletId: wallet.getId(),
                availableBalance: wallet.getAvailableBalance().getAmount(),
                pendingBalance: wallet.getPendingBalance().getAmount(),
                transactionTotal: paginatedResult.total,
            });
            return Result_1.Result.success({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.WALLET.FETCHED,
                data: {
                    walletId: wallet.getId(),
                    ownerId: wallet.getOwnerId(),
                    availableBalance: wallet.getAvailableBalance().getAmount(),
                    pendingBalance: wallet.getPendingBalance().getAmount(),
                    totalBalance: wallet.getTotalBalance().getAmount(),
                    currency: wallet.getCurrency(),
                    updatedAt: wallet.getUpdatedAt().toISOString(),
                    transactions: paginatedResult.transactions.map(this.toTransactionItemData),
                    pagination: {
                        total: paginatedResult.total,
                        page: paginatedResult.page,
                        limit: paginatedResult.limit,
                        totalPages: paginatedResult.totalPages,
                    },
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin wallet", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            return Result_1.Result.failure(error);
        }
    }
    toTransactionItemData(transaction) {
        return {
            id: transaction.getId(),
            type: transaction.getType(),
            direction: transaction.getDirection(),
            amount: transaction.getAmount().getAmount(),
            currency: transaction.getAmount().getCurrency(),
            signedAmount: transaction.getSignedAmount(),
            relatedEntityId: transaction.getRelatedEntityId(),
            relatedEntityType: transaction.getRelatedEntityType(),
            groupId: transaction.getGroupId(),
            note: transaction.getNote(),
            createdAt: transaction.getCreatedAt().toISOString(),
        };
    }
};
exports.GetAdminWalletUseCase = GetAdminWalletUseCase;
exports.GetAdminWalletUseCase = GetAdminWalletUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetAdminWalletUseCase);
//# sourceMappingURL=GetAdminWalletUseCase.js.map