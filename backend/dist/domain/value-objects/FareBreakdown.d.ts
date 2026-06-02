import { Money } from "./Money";
export interface TaxBreakdown {
    name: string;
    rate: number;
    amount: Money;
}
export declare class FareBreakdown {
    private readonly baseFare;
    private readonly platformFee;
    private readonly fareTax;
    private readonly platformFeeTax;
    private readonly totalFare;
    private readonly durationHours;
    private readonly calculatedAt;
    private constructor();
    static create(params: {
        baseFare: Money;
        platformFee: Money;
        fareTax: TaxBreakdown;
        platformFeeTax: TaxBreakdown;
        totalFare: Money;
        durationHours: number;
        calculatedAt?: Date;
    }): FareBreakdown;
    static zero(currency: string): FareBreakdown;
    static forCancellation(cancellationFee: Money): FareBreakdown;
    getBaseFare(): Money;
    getPlatformFee(): Money;
    getFareTax(): TaxBreakdown;
    getPlatformFeeTax(): TaxBreakdown;
    getTotalFare(): Money;
    getDurationHours(): number;
    getCalculatedAt(): Date;
    toJSON(): {
        baseFare: {
            amount: number;
            currency: string;
        };
        platformFee: {
            amount: number;
            currency: string;
        };
        taxes: {
            fare: {
                name: string;
                rate: number;
                amount: {
                    amount: number;
                    currency: string;
                };
            };
            platformFee: {
                name: string;
                rate: number;
                amount: {
                    amount: number;
                    currency: string;
                };
            };
        };
        totalFare: {
            amount: number;
            currency: string;
        };
        durationHours: number;
        calculatedAt: Date;
    };
}
//# sourceMappingURL=FareBreakdown.d.ts.map