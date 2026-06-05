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
exports.RequestPayoutUseCase = void 0;
const inversify_1 = require("inversify");
const Payout_1 = require("../../../domain/entities/Payout");
const Money_1 = require("../../../domain/value-objects/Money");
const WalletOwnerType_1 = require("../../../domain/value-objects/WalletOwnerType");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const PayoutErrors_1 = require("../../../domain/errors/PayoutErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const mongoose_1 = require("mongoose");
const MINIMUM_PAYOUT_AMOUNT = 100;
const PAYOUT_CURRENCY = "INR";
let RequestPayoutUseCase = class RequestPayoutUseCase {
    constructor(driverRepository, payoutRepository, walletRepository) {
        this.driverRepository = driverRepository;
        this.payoutRepository = payoutRepository;
        this.walletRepository = walletRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Processing payout request", {
                userId: dto.getUserId(),
                amount: dto.getAmount(),
                method: dto.getMethod(),
            });
            if (dto.getAmount() < MINIMUM_PAYOUT_AMOUNT) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.belowMinimumAmount(MINIMUM_PAYOUT_AMOUNT.toString(), PAYOUT_CURRENCY));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId().toString();
            const pendingPayout = await this.payoutRepository.findPendingByDriverId(driverId);
            if (pendingPayout) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.pendingPayoutExists(driverId));
            }
            const wallet = await this.walletRepository.findByOwner(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER);
            if (!wallet) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.driverWalletNotFound(driverId));
            }
            const requestedAmount = Money_1.Money.create(dto.getAmount(), PAYOUT_CURRENCY);
            if (wallet.getAvailableBalance().getAmount() < requestedAmount.getAmount()) {
                return Result_1.Result.failure(PayoutErrors_1.PayoutErrors.insufficientDriverBalance(wallet.getAvailableBalance().getAmount().toString(), requestedAmount.getAmount().toString()));
            }
            const payout = Payout_1.Payout.request({
                id: new mongoose_1.Types.ObjectId().toString(),
                driverId,
                amount: requestedAmount,
                method: dto.getMethod(),
                destination: dto.getDestination(),
            });
            const savedPayout = await this.payoutRepository.save(payout);
            Logger_1.Logger.info("Payout request created", {
                payoutId: savedPayout.getId(),
                driverId,
                amount: dto.getAmount(),
            });
            return Result_1.Result.success({
                payoutId: savedPayout.getId(),
                driverId,
                amount: savedPayout.getAmount().getAmount(),
                currency: savedPayout.getCurrency(),
                method: savedPayout.getMethod(),
                status: savedPayout.getStatus(),
                createdAt: savedPayout.getCreatedAt().toISOString(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error requesting payout", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.RequestPayoutUseCase = RequestPayoutUseCase;
exports.RequestPayoutUseCase = RequestPayoutUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PayoutRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RequestPayoutUseCase);
//# sourceMappingURL=RequestPayoutUseCase.js.map