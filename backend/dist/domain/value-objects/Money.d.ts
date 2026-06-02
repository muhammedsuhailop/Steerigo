export declare class Money {
    private readonly amount;
    private readonly currency;
    private constructor();
    static create(amount: number, currency?: string): Money;
    static forceCreate(amount: number, currency?: string): Money;
    static zero(currency?: string): Money;
    getAmount(): number;
    getCurrency(): string;
    add(other: Money): Money;
    subtract(other: Money): Money;
    subtractAllowingNegative(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    greaterThan(other: Money): boolean;
    lessThan(other: Money): boolean;
    isZero(): boolean;
    private validateSameCurrency;
    private static round;
    toJSON(): {
        amount: number;
        currency: string;
    };
}
//# sourceMappingURL=Money.d.ts.map