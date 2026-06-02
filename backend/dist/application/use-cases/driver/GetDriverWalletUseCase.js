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
exports.GetDriverWalletUseCase = void 0;
const inversify_1 = require("inversify");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const DriverNotFoundError_1 = require("@domain/errors/DriverNotFoundError");
const DriverMessages_1 = require("@shared/constants/DriverMessages");
const Wallet_1 = require("@domain/entities/Wallet");
let GetDriverWalletUseCase = class GetDriverWalletUseCase {
    constructor(driverRepository, walletRepository, transactionRepository, idGenerator) {
        this.driverRepository = driverRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.idGenerator = idGenerator;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching driver wallet", {
                userId: dto.getUserId(),
                page: dto.getPage(),
                limit: dto.getLimit(),
                type: dto.getType(),
                direction: dto.getDirection(),
            });
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            let wallet = await this.walletRepository.findByOwner(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER);
            if (!wallet) {
                if (!wallet) {
                    Logger_1.Logger.info("Driver wallet not found, creating new one during fetch", { driverId });
                    wallet = Wallet_1.Wallet.create({
                        id: this.idGenerator.generate(),
                        ownerId: driverId,
                        ownerType: WalletOwnerType_1.WalletOwnerType.DRIVER,
                    });
                    await this.walletRepository.save(wallet);
                }
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
            Logger_1.Logger.info("Driver wallet fetched successfully", {
                driverId,
                walletId: wallet.getId(),
                availableBalance: wallet.getAvailableBalance().getAmount(),
                transactionTotal: paginatedResult.total,
            });
            return Result_1.Result.success({
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.WALLET_FETCHED,
                data: {
                    walletId: wallet.getId(),
                    driverId,
                    availableBalance: wallet.getAvailableBalance().getAmount(),
                    pendingBalance: wallet.getPendingBalance().getAmount(),
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
            Logger_1.Logger.error("Error fetching driver wallet", {
                userId: dto.getUserId(),
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
            relatedEntityId: transaction.getRelatedEntityId(),
            relatedEntityType: transaction.getRelatedEntityType(),
            note: transaction.getNote(),
            createdAt: transaction.getCreatedAt().toISOString(),
        };
    }
};
exports.GetDriverWalletUseCase = GetDriverWalletUseCase;
exports.GetDriverWalletUseCase = GetDriverWalletUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetDriverWalletUseCase);
//# sourceMappingURL=GetDriverWalletUseCase.js.map