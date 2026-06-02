export interface RiderInfo {
    userId: string;
    name: string;
    mobile: string;
}
export declare class RiderInfoValueObject {
    private readonly userId;
    private readonly name;
    private readonly mobile;
    private constructor();
    static create(userId: string, name: string, mobile: string): RiderInfoValueObject;
    getId(): string;
    getName(): string;
    getMobile(): string;
    toObject(): RiderInfo;
}
//# sourceMappingURL=RiderInfo.d.ts.map