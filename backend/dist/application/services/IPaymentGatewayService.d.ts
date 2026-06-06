export interface RazorpayOrderResult {
    gatewayOrderId: string;
    amount: number;
    currency: string;
    receipt: string;
}
export interface RazorpayVerifyParams {
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
}
export interface IPaymentGatewayService {
    createOrder(params: {
        amount: number;
        currency: string;
        receipt: string;
        notes?: Record<string, string>;
    }): Promise<RazorpayOrderResult>;
    verifySignature(params: RazorpayVerifyParams): boolean;
}
//# sourceMappingURL=IPaymentGatewayService.d.ts.map