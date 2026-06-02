"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const Money_1 = require("@domain/value-objects/Money");
class Wallet {
    constructor(id, ownerId, ownerType, availableBalance, pendingBalance, currency, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerType = ownerType;
        this.availableBalance = availableBalance;
        this.pendingBalance = pendingBalance;
        this.currency = currency;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        const init = params.initialBalance ?? Money_1.Money.zero("INR");
        return new Wallet(params.id, params.ownerId, params.ownerType, init, Money_1.Money.zero(init.getCurrency()), init.getCurrency(), new Date(), new Date());
    }
    static fromData(data) {
        return new Wallet(data.id, data.ownerId, data.ownerType, data.availableBalance, data.pendingBalance, data.currency, data.createdAt, data.updatedAt);
    }
    credit(amount) {
        this.ensureCurrencyMatch(amount);
        this.availableBalance = this.availableBalance.add(amount);
        this.updatedAt = new Date();
    }
    debit(amount) {
        this.ensureCurrencyMatch(amount);
        if (this.availableBalance.getAmount() < amount.getAmount()) {
            throw new Error("Insufficient available balance");
        }
        this.availableBalance = this.availableBalance.subtract(amount);
        this.updatedAt = new Date();
    }
    forceDebit(amount) {
        this.ensureCurrencyMatch(amount);
        this.availableBalance =
            this.availableBalance.subtractAllowingNegative(amount);
        this.updatedAt = new Date();
    }
    hold(amount) {
        this.ensureCurrencyMatch(amount);
        this.pendingBalance = this.pendingBalance.add(amount);
        this.updatedAt = new Date();
    }
    releasePendingToAvailable(amount) {
        this.ensureCurrencyMatch(amount);
        if (this.pendingBalance.getAmount() < amount.getAmount()) {
            throw new Error("Insufficient pending balance");
        }
        this.pendingBalance = this.pendingBalance.subtract(amount);
        this.availableBalance = this.availableBalance.add(amount);
        this.updatedAt = new Date();
    }
    removePending(amount) {
        this.ensureCurrencyMatch(amount);
        if (this.pendingBalance.getAmount() < amount.getAmount()) {
            throw new Error("Insufficient pending balance");
        }
        this.pendingBalance = this.pendingBalance.subtract(amount);
        this.updatedAt = new Date();
    }
    ensureCurrencyMatch(amount) {
        if (amount.getCurrency() !== this.currency) {
            throw new Error("Currency mismatch");
        }
    }
    getId() {
        return this.id;
    }
    getOwnerId() {
        return this.ownerId;
    }
    getOwnerType() {
        return this.ownerType;
    }
    getAvailableBalance() {
        return this.availableBalance;
    }
    getPendingBalance() {
        return this.pendingBalance;
    }
    getCurrency() {
        return this.currency;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getTotalBalance() {
        const total = this.availableBalance.getAmount() + this.pendingBalance.getAmount();
        return Money_1.Money.forceCreate(total, this.currency);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map