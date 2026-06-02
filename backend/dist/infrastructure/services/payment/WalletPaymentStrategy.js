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
exports.WalletPaymentStrategy = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const Transaction_1 = require("@domain/entities/Transaction");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const TransactionType_1 = require("@domain/value-objects/TransactionType");
const TransactionDirection_1 = require("@domain/value-objects/TransactionDirection");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const PaymentErrors_1 = require("@domain/errors/PaymentErrors");
const Logger_1 = require("@shared/utils/Logger");
const PaymentMethod_1 = require("@domain/value-objects/PaymentMethod");
const PaymentMessages_1 = require("@shared/constants/PaymentMessages");
let WalletPaymentStrategy = class WalletPaymentStrategy {
    constructor(walletRepository, transactionRepository, paymentRepository, rideRepository, earningsService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
        this.earningsService = earningsService;
    }
    getMethod() {
        return PaymentMethod_1.PaymentMethod.WALLET;
    }
    getSuccessMessage() {
        return PaymentMessages_1.PAYMENT_MESSAGES.WALLET_PAYMENT_SUCCESS;
    }
    async execute({ payment, ride, amount, userId, }) {
        const rideId = ride.getRideId();
        const now = new Date();
        const wallet = await this.walletRepository.findByOwner(userId, WalletOwnerType_1.WalletOwnerType.RIDER);
        if (!wallet)
            return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.walletNotFound(userId));
        if (wallet.getAvailableBalance().getAmount() < amount.getAmount()) {
            return Result_1.Result.failure(PaymentErrors_1.PaymentErrors.insufficientWalletBalance(wallet.getAvailableBalance().getAmount().toString(), amount.getAmount().toString()));
        }
        wallet.debit(amount);
        await this.walletRepository.save(wallet);
        const riderTransaction = Transaction_1.Transaction.create({
            id: new mongoose_1.Types.ObjectId().toString(),
            walletId: wallet.getId(),
            type: TransactionType_1.TransactionType.RIDE_PAYMENT,
            direction: TransactionDirection_1.TransactionDirection.DEBIT,
            amount,
            relatedEntityId: rideId,
            relatedEntityType: "Ride",
            note: `Payment for ride ${rideId}`,
        });
        await this.transactionRepository.save(riderTransaction);
        payment.markSuccess(undefined, now);
        await this.paymentRepository.save(payment);
        ride.getTimeline().setPaymentCompletedAt(now);
        ride.updatePaymentStatus(PaymentStatus_1.PaymentStatus.SUCCESS);
        await this.rideRepository.save(ride);
        const fareBreakdown = ride.getFareBreakdown();
        await this.earningsService
            .distribute({
            rideId,
            driverId: ride.getDriverId(),
            totalFare: fareBreakdown.getTotalFare(),
            platformFee: fareBreakdown.getPlatformFee(),
            platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
        })
            .catch((err) => Logger_1.Logger.error("Distribution failed", { rideId, error: err.message }));
        return Result_1.Result.success({
            paymentId: payment.getId(),
            status: payment.getStatus(),
            amount: amount.getAmount(),
            currency: amount.getCurrency(),
            walletBalanceAfter: wallet.getAvailableBalance().getAmount(),
        });
    }
};
exports.WalletPaymentStrategy = WalletPaymentStrategy;
exports.WalletPaymentStrategy = WalletPaymentStrategy = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EarningsDistributionService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], WalletPaymentStrategy);
//# sourceMappingURL=WalletPaymentStrategy.js.map