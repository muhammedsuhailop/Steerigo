export declare class ConfirmCashPaymentDto {
    private readonly userId;
    private readonly rideId;
    private readonly method;
    private readonly amount;
    private constructor();
    static create(params: {
        userId: string;
        rideId: string;
        method: string;
        amount: number;
    }): ConfirmCashPaymentDto;
    getUserId(): string;
    getRideId(): string;
    getMethod(): string;
    getAmount(): number;
}
//# sourceMappingURL=ConfirmCashPaymentDto.d.ts.map