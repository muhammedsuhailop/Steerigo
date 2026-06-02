import { IPaymentGatewayService, RazorpayOrderResult, RazorpayVerifyParams } from "../../application/services/IPaymentGatewayService";
export declare class RazorpayService implements IPaymentGatewayService {
    private readonly client;
    private readonly keySecret;
    constructor();
    createOrder(params: {
        amount: number;
        currency: string;
        receipt: string;
        notes?: Record<string, string>;
    }): Promise<RazorpayOrderResult>;
    verifySignature(params: RazorpayVerifyParams): boolean;
}
//# sourceMappingURL=RazorpayService.d.ts.map