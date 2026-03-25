import { PaymentFailureReason } from "@domain/value-objects/PaymentFailureReason";
import { z } from "zod";

const markPaymentFailedSchema = z.object({
  paymentId: z.string().min(1, "paymentId is required"),
  reason: z
    .nativeEnum(PaymentFailureReason)
    .optional()
    .default(PaymentFailureReason.USER_CANCELLED),
});

type MarkPaymentFailedData = z.infer<typeof markPaymentFailedSchema>;

export class MarkPaymentFailedDto {
  private readonly userId: string;
  private readonly data: MarkPaymentFailedData;

  constructor(userId: string, bodyData: unknown) {
    this.userId = userId;
    this.data = markPaymentFailedSchema.parse(bodyData);
  }

  static fromRequest(userId: string, body: unknown): MarkPaymentFailedDto {
    return new MarkPaymentFailedDto(userId, body);
  }

  getUserId(): string {
    return this.userId;
  }

  getPaymentId(): string {
    return this.data.paymentId;
  }

  getReason(): PaymentFailureReason {
    return this.data.reason;
  }
}

export { markPaymentFailedSchema };
