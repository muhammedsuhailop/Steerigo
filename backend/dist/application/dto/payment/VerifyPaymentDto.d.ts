export declare class VerifyPaymentDto {
    private readonly userId;
    private readonly paymentId;
    private readonly gatewayOrderId;
    private readonly gatewayPaymentId;
    private readonly gatewaySignature;
    private constructor();
    static create(params: {
        userId: string;
        paymentId: string;
        gatewayOrderId: string;
        gatewayPaymentId: string;
        gatewaySignature: string;
    }): VerifyPaymentDto;
    getUserId(): string;
    getPaymentId(): string;
    getGatewayOrderId(): string;
    getGatewayPaymentId(): string;
    getGatewaySignature(): string;
}
//# sourceMappingURL=VerifyPaymentDto.d.ts.map