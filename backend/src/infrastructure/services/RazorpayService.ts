import { injectable } from "inversify";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  IPaymentGatewayService,
  RazorpayOrderResult,
  RazorpayVerifyParams,
} from "@application/services/IPaymentGatewayService";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RazorpayService implements IPaymentGatewayService {
  private readonly client: Razorpay;
  private readonly keySecret: string;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment",
      );
    }

    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    this.keySecret = keySecret;
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<RazorpayOrderResult> {
    try {
      const amountInPaise = Math.round(params.amount * 100);

      const sanitizedReceipt = `pay_${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 30)}`;

      const order = await this.client.orders.create({
        amount: amountInPaise,
        currency: params.currency,
        receipt: sanitizedReceipt,
        notes: params.notes,
      });

      Logger.info("Razorpay order created", {
        orderId: order.id,
        amount: amountInPaise,
        currency: params.currency,
      });

      return {
        gatewayOrderId: order.id,
        amount: params.amount,
        currency: params.currency,
        receipt: params.receipt,
      };
    } catch (error) {
      Logger.error("Failed to create Razorpay order", {
        error: JSON.stringify(error, null, 2),
      });
      throw error;
    }
  }

  verifySignature(params: RazorpayVerifyParams): boolean {
    const body = `${params.gatewayOrderId}|${params.gatewayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", this.keySecret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === params.gatewaySignature;

    Logger.debug("Razorpay signature verification", {
      gatewayOrderId: params.gatewayOrderId,
      isValid,
    });

    return isValid;
  }
}
