"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareBreakdown = void 0;
const Money_1 = require("./Money");
class FareBreakdown {
    constructor(baseFare, platformFee, fareTax, platformFeeTax, totalFare, durationHours, calculatedAt = new Date()) {
        this.baseFare = baseFare;
        this.platformFee = platformFee;
        this.fareTax = fareTax;
        this.platformFeeTax = platformFeeTax;
        this.totalFare = totalFare;
        this.durationHours = durationHours;
        this.calculatedAt = calculatedAt;
    }
    static create(params) {
        return new FareBreakdown(params.baseFare, params.platformFee, params.fareTax, params.platformFeeTax, params.totalFare, params.durationHours, params.calculatedAt ?? new Date());
    }
    static zero(currency) {
        const zeroMoney = Money_1.Money.create(0, currency);
        const zeroTax = { name: "None", rate: 0, amount: zeroMoney };
        return new FareBreakdown(zeroMoney, zeroMoney, zeroTax, zeroTax, zeroMoney, 0);
    }
    static forCancellation(cancellationFee) {
        const currency = cancellationFee.getCurrency();
        const zeroMoney = Money_1.Money.create(0, currency);
        const zeroTax = { name: "None", rate: 0, amount: zeroMoney };
        return new FareBreakdown(cancellationFee, zeroMoney, zeroTax, zeroTax, cancellationFee, 0);
    }
    getBaseFare() {
        return this.baseFare;
    }
    getPlatformFee() {
        return this.platformFee;
    }
    getFareTax() {
        return this.fareTax;
    }
    getPlatformFeeTax() {
        return this.platformFeeTax;
    }
    getTotalFare() {
        return this.totalFare;
    }
    getDurationHours() {
        return this.durationHours;
    }
    getCalculatedAt() {
        return this.calculatedAt;
    }
    toJSON() {
        return {
            baseFare: this.baseFare.toJSON(),
            platformFee: this.platformFee.toJSON(),
            taxes: {
                fare: {
                    name: this.fareTax.name,
                    rate: this.fareTax.rate,
                    amount: this.fareTax.amount.toJSON(),
                },
                platformFee: {
                    name: this.platformFeeTax.name,
                    rate: this.platformFeeTax.rate,
                    amount: this.platformFeeTax.amount.toJSON(),
                },
            },
            totalFare: this.totalFare.toJSON(),
            durationHours: this.durationHours,
            calculatedAt: this.calculatedAt,
        };
    }
}
exports.FareBreakdown = FareBreakdown;
//# sourceMappingURL=FareBreakdown.js.map