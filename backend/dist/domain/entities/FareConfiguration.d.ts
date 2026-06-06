export interface FareRule {
    maxHours: number | null;
    ratePerHour: number;
}
export declare class FareConfiguration {
    private readonly id;
    private readonly baseAmount;
    private readonly baseHours;
    private readonly fareRules;
    private readonly platformFeePercentage;
    private readonly fareTaxPercentage;
    private readonly platformFeeTaxPercentage;
    private readonly isActive;
    private readonly effectiveFrom;
    private readonly effectiveTill;
    private readonly maxCancellationCharge;
    private readonly createdAt;
    private readonly updatedAt;
    private constructor();
    static create(params: {
        id: string;
        baseAmount: number;
        baseHours: number;
        fareRules: FareRule[];
        platformFeePercentage: number;
        fareTaxPercentage: number;
        platformFeeTaxPercentage: number;
        effectiveFrom: Date;
        effectiveTill?: Date | null;
        maxCancellationCharge: number;
    }): FareConfiguration;
    static fromData(data: {
        id: string;
        baseAmount: number;
        baseHours: number;
        fareRules: FareRule[];
        platformFeePercentage: number;
        fareTaxPercentage: number;
        platformFeeTaxPercentage: number;
        isActive: boolean;
        effectiveFrom: Date;
        effectiveTill: Date | null;
        maxCancellationCharge: number;
        createdAt: Date;
        updatedAt: Date;
    }): FareConfiguration;
    getId(): string;
    getBaseAmount(): number;
    getBaseHours(): number;
    getFareRules(): FareRule[];
    getPlatformFeePercentage(): number;
    getFareTaxPercentage(): number;
    getPlatformFeeTaxPercentage(): number;
    getMaxCancellationCharge(): number;
    getEffectiveFrom(): Date;
    getEffectiveTill(): Date | null;
    isActiveAt(date: Date): boolean;
}
//# sourceMappingURL=FareConfiguration.d.ts.map