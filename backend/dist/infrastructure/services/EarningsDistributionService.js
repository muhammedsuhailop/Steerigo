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
exports.EarningsDistributionService = void 0;
const inversify_1 = require("inversify");
const Wallet_1 = require("@domain/entities/Wallet");
const Transaction_1 = require("@domain/entities/Transaction");
const Money_1 = require("@domain/value-objects/Money");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const TransactionType_1 = require("@domain/value-objects/TransactionType");
const TransactionDirection_1 = require("@domain/value-objects/TransactionDirection");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
const PLATFORM_OWNER_ID = "platform";
let EarningsDistributionService = class EarningsDistributionService {
    constructor(walletRepository, transactionRepository, idGenerator) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.idGenerator = idGenerator;
    }
    async distribute(params) {
        const { rideId, driverId, totalFare, platformFee, platformFeeTax, payableAmount, discount, groupId, } = params;
        const platformRevenue = platformFee.add(platformFeeTax);
        const discountMoney = discount ?? Money_1.Money.zero(totalFare.getCurrency());
        const driverEarnings = totalFare.subtract(platformRevenue);
        const payable = payableAmount ?? totalFare;
        if (await this.transactionRepository.existsByGroupId(groupId)) {
            Logger_1.Logger.warn("Settlement already processed, skipping", { groupId });
            return {
                driverEarnings: 0,
                platformRevenue: 0,
                currency: totalFare.getCurrency(),
            };
        }
        await this.recordAuditOnlyTransaction(PLATFORM_OWNER_ID, WalletOwnerType_1.WalletOwnerType.PLATFORM, payable, rideId, TransactionType_1.TransactionType.RIDER_PAYMENT_ONLINE, `Online payment received from rider for ride: ${rideId}`, groupId);
        Logger_1.Logger.info("Distributing ONLINE earnings", {
            rideId,
            driverId,
            totalFare: totalFare.getAmount(),
            payableAmount: payableAmount?.getAmount(),
            discount: discountMoney.getAmount(),
            platformRevenue: platformRevenue.getAmount(),
            driverEarnings: driverEarnings.getAmount(),
        });
        if (discountMoney.getAmount() > 0) {
            await this.debitWallet(PLATFORM_OWNER_ID, WalletOwnerType_1.WalletOwnerType.PLATFORM, discountMoney, rideId, TransactionType_1.TransactionType.COUPON_EXPENSE, `Coupon expense for ride: ${rideId}`, groupId);
        }
        await this.debitWallet(PLATFORM_OWNER_ID, WalletOwnerType_1.WalletOwnerType.PLATFORM, driverEarnings, rideId, TransactionType_1.TransactionType.DRIVER_SETTLEMENT, `Driver payout for ride: ${rideId}`, groupId);
        await this.creditDriverWallet(driverId, driverEarnings, rideId, TransactionType_1.TransactionType.DRIVER_EARNING, `Online ride earning for ride: ${rideId}`, groupId);
        await this.creditPlatformWallet(platformRevenue, rideId, TransactionType_1.TransactionType.PLATFORM_COMMISSION, `Platform commission for online ride: ${rideId}`, groupId);
        return {
            driverEarnings: driverEarnings.getAmount(),
            platformRevenue: platformRevenue.getAmount() - discountMoney.getAmount(),
            currency: totalFare.getCurrency(),
        };
    }
    async distributeCashPayment(params) {
        const { rideId, driverId, totalFare, payableAmount, discount, platformFee, platformFeeTax, } = params;
        const platformRevenue = platformFee.add(platformFeeTax);
        const discountMoney = discount ?? Money_1.Money.create(0, totalFare.getCurrency());
        const payable = payableAmount ?? totalFare;
        Logger_1.Logger.info("Processing cash earnings distribution", {
            rideId,
            driverId,
            totalFare: totalFare.getAmount(),
            payableAmount: payableAmount?.getAmount(),
            discount: discount?.getAmount(),
            platformRevenue: platformRevenue.getAmount(),
        });
        if (discountMoney.getAmount() > 0) {
            await this.debitWallet("platform", WalletOwnerType_1.WalletOwnerType.PLATFORM, discountMoney, rideId, TransactionType_1.TransactionType.COUPON_EXPENSE, `Coupon discount compensated to driver for ride: ${rideId}`);
            await this.creditDriverWallet(driverId, discountMoney, rideId, TransactionType_1.TransactionType.DRIVER_COUPON_CREDIT, `Coupon compensation for ride: ${rideId}`);
        }
        await this.debitWallet(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER, platformRevenue, rideId, TransactionType_1.TransactionType.PLATFORM_COMMISSION_CASH_RIDE, `Platform fee deduction for cash ride: ${rideId}`);
        await this.creditPlatformWallet(platformRevenue, rideId, TransactionType_1.TransactionType.PLATFORM_COMMISSION, `Platform commission for cash ride: ${rideId}`);
        await this.recordAuditOnlyTransaction(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER, payable, rideId, TransactionType_1.TransactionType.RIDE_PAYMENT_CASH, `Cash collected from rider (after discount) for ride: ${rideId}`);
        const driverNet = totalFare.getAmount() - platformRevenue.getAmount();
        const platformNet = platformRevenue.getAmount() - discountMoney.getAmount();
        Logger_1.Logger.info("Cash distribution completed", {
            rideId,
            driverId,
            driverExpectedEarnings: driverNet,
            platformNetRevenue: platformNet,
            note: "Driver earnings unaffected by coupon; platform bears discount",
        });
    }
    async distributeCancellation(params) {
        const { rideId, driverId, riderId, riderCharge, driverPenalty } = params;
        if (driverPenalty.getAmount() > 0) {
            await this.debitWallet(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER, driverPenalty, rideId, TransactionType_1.TransactionType.DRIVER_PENALTY, `Penalty for driver cancellation: ${rideId}`);
            await this.creditPlatformWallet(driverPenalty, rideId, TransactionType_1.TransactionType.DRIVER_PENALTY_REVENUE, `Revenue from driver penalty: ${rideId}`);
        }
        if (riderCharge.getAmount() > 0) {
            await this.debitWallet(riderId, WalletOwnerType_1.WalletOwnerType.RIDER, riderCharge, rideId, TransactionType_1.TransactionType.RIDER_CANCELLATION_FEE, `Cancellation fee for ride: ${rideId}`);
            await this.creditPlatformWallet(riderCharge, rideId);
        }
    }
    async debitWallet(ownerId, ownerType, amount, rideId, type, note, groupId) {
        const wallet = await this.walletRepository.findByOwner(ownerId, ownerType);
        if (!wallet) {
            throw new Error(`${ownerType} wallet not found for debiting ${amount.getAmount()}`);
        }
        wallet.forceDebit(amount);
        await this.walletRepository.save(wallet);
        const transaction = Transaction_1.Transaction.create({
            id: this.idGenerator.generate("TXN"),
            walletId: wallet.getId(),
            type: type,
            direction: TransactionDirection_1.TransactionDirection.DEBIT,
            amount,
            relatedEntityId: rideId,
            relatedEntityType: "Ride",
            note: note,
            groupId,
        });
        await this.transactionRepository.save(transaction);
    }
    async creditDriverWallet(driverId, amount, rideId, type = TransactionType_1.TransactionType.DRIVER_EARNING, note, groupId) {
        let wallet = await this.walletRepository.findByOwner(driverId, WalletOwnerType_1.WalletOwnerType.DRIVER);
        if (!wallet) {
            Logger_1.Logger.info("Driver wallet not found, creating new one", { driverId });
            wallet = Wallet_1.Wallet.create({
                id: new mongoose_1.Types.ObjectId().toString(),
                ownerId: driverId,
                ownerType: WalletOwnerType_1.WalletOwnerType.DRIVER,
            });
        }
        wallet.credit(amount);
        await this.walletRepository.save(wallet);
        const transaction = Transaction_1.Transaction.create({
            id: this.idGenerator.generate("TXN"),
            walletId: wallet.getId(),
            type: type,
            direction: TransactionDirection_1.TransactionDirection.CREDIT,
            amount,
            relatedEntityId: rideId,
            relatedEntityType: "Ride",
            note: note ?? `Driver earnings for ride ${rideId}`,
            groupId,
        });
        await this.transactionRepository.save(transaction);
        Logger_1.Logger.info("Driver wallet credited", {
            driverId,
            amount: amount.getAmount(),
            rideId,
        });
    }
    async creditPlatformWallet(amount, rideId, type = TransactionType_1.TransactionType.PLATFORM_COMMISSION, note, groupId) {
        let wallet = await this.walletRepository.findByOwner(PLATFORM_OWNER_ID, WalletOwnerType_1.WalletOwnerType.PLATFORM);
        if (!wallet) {
            Logger_1.Logger.info("Platform wallet not found, creating new one");
            wallet = Wallet_1.Wallet.create({
                id: new mongoose_1.Types.ObjectId().toString(),
                ownerId: PLATFORM_OWNER_ID,
                ownerType: WalletOwnerType_1.WalletOwnerType.PLATFORM,
            });
        }
        wallet.credit(amount);
        await this.walletRepository.save(wallet);
        const transaction = Transaction_1.Transaction.create({
            id: this.idGenerator.generate("TXN"),
            walletId: wallet.getId(),
            type: type,
            direction: TransactionDirection_1.TransactionDirection.CREDIT,
            amount,
            relatedEntityId: rideId,
            relatedEntityType: "Ride",
            note: note ?? `Platform commission for ride ${rideId}`,
            groupId,
        });
        await this.transactionRepository.save(transaction);
        Logger_1.Logger.info("Platform wallet credited", {
            amount: amount.getAmount(),
            rideId,
        });
    }
    async recordAuditOnlyTransaction(ownerId, ownerType, amount, rideId, type, note, groupId) {
        const wallet = await this.walletRepository.findByOwner(ownerId, ownerType);
        if (!wallet)
            return;
        const transaction = Transaction_1.Transaction.create({
            id: this.idGenerator.generate("TXN"),
            walletId: wallet.getId(),
            type: type,
            direction: TransactionDirection_1.TransactionDirection.CREDIT,
            amount,
            relatedEntityId: rideId,
            relatedEntityType: "Ride",
            note: note,
            groupId,
        });
        await this.transactionRepository.save(transaction);
    }
};
exports.EarningsDistributionService = EarningsDistributionService;
exports.EarningsDistributionService = EarningsDistributionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.WalletRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.TransactionRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.NanoIdGenerator)),
    __metadata("design:paramtypes", [Object, Object, Object])
], EarningsDistributionService);
//# sourceMappingURL=EarningsDistributionService.js.map