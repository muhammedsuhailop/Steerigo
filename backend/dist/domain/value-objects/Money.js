"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const errors_1 = require("../errors");
class Money {
    constructor(amount, currency = "INR") {
        this.amount = amount;
        this.currency = currency;
    }
    static create(amount, currency = "INR") {
        if (amount === null || amount === undefined || isNaN(amount)) {
            throw new errors_1.DomainError("Invalid money amount");
        }
        if (amount < 0) {
            throw new errors_1.DomainError("Amount cannot be negative");
        }
        return new Money(Money.round(amount), currency);
    }
    static forceCreate(amount, currency = "INR") {
        if (amount === null || amount === undefined || isNaN(amount)) {
            throw new errors_1.DomainError("Invalid money amount");
        }
        return new Money(Money.round(amount), currency);
    }
    static zero(currency = "INR") {
        return Money.create(0, currency);
    }
    getAmount() {
        return this.amount;
    }
    getCurrency() {
        return this.currency;
    }
    add(other) {
        this.validateSameCurrency(other);
        return Money.forceCreate(this.amount + other.amount, this.currency);
    }
    subtract(other) {
        this.validateSameCurrency(other);
        const result = this.amount - other.amount;
        return Money.forceCreate(result, this.currency);
    }
    subtractAllowingNegative(other) {
        this.validateSameCurrency(other);
        const result = this.amount - other.amount;
        return Money.forceCreate(result, this.currency);
    }
    multiply(factor) {
        if (factor < 0) {
            throw new errors_1.DomainError("Multiplier cannot be negative");
        }
        return Money.create(this.amount * factor, this.currency);
    }
    equals(other) {
        this.validateSameCurrency(other);
        return this.amount === other.amount;
    }
    greaterThan(other) {
        this.validateSameCurrency(other);
        return this.amount > other.amount;
    }
    lessThan(other) {
        this.validateSameCurrency(other);
        return this.amount < other.amount;
    }
    isZero() {
        return this.amount === 0;
    }
    validateSameCurrency(other) {
        if (this.currency !== other.currency) {
            throw new errors_1.DomainError("Cannot operate on different currencies");
        }
    }
    static round(value) {
        return Math.round(value * 100) / 100;
    }
    toJSON() {
        return {
            amount: this.amount,
            currency: this.currency,
        };
    }
}
exports.Money = Money;
//# sourceMappingURL=Money.js.map