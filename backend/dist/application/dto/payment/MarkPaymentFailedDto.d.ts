import { PaymentFailureReason } from "@domain/value-objects/PaymentFailureReason";
import { z } from "zod";
declare const markPaymentFailedSchema: z.ZodObject<{
    paymentId: z.ZodString;
    reason: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof PaymentFailureReason>>>;
}, z.core.$strip>;
export declare class MarkPaymentFailedDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, bodyData: unknown);
    static fromRequest(userId: string, body: unknown): MarkPaymentFailedDto;
    getUserId(): string;
    getPaymentId(): string;
    getReason(): PaymentFailureReason;
}
export { markPaymentFailedSchema };
//# sourceMappingURL=MarkPaymentFailedDto.d.ts.map