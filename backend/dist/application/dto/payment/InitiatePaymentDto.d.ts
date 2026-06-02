import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
export declare class InitiatePaymentDto {
    private readonly userId;
    private readonly rideId;
    private readonly method;
    private constructor();
    static create(params: {
        userId: string;
        rideId: string;
        method: PaymentMethod;
    }): InitiatePaymentDto;
    getUserId(): string;
    getRideId(): string;
    getMethod(): PaymentMethod;
}
//# sourceMappingURL=InitiatePaymentDto.d.ts.map