import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Money } from "@domain/value-objects/Money";

export class Payment {
  private constructor(
    private readonly id: string,
    private readonly rideId: string,
    private readonly riderId: string,
    private readonly driverId: string,

    private readonly amount: Money,
    private refundedAmount: Money,

    private method: PaymentMethod,
    private status: PaymentStatus,

    private paymentIntentId?: string,
    private gateway?: string,
    private gatewayOrderId?: string,
    private gatewayPaymentId?: string,

    private gatewaySignature?: string,

    private failureReason?: string,

    private readonly metadata: Record<string, string> = {},

    private paidAt?: Date,

    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    rideId: string,
    riderId: string,
    driverId: string,
    amount: Money,
    method: PaymentMethod,
    metadata: Record<string, string> = {},
  ): Payment {
    return new Payment(
      id,
      rideId,
      riderId,
      driverId,
      amount,
      Money.zero(amount.getCurrency()),
      method,
      PaymentStatus.PENDING,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      metadata,
      undefined,
    );
  }

  static fromData(data: {
    id: string;
    rideId: string;
    riderId: string;
    driverId: string;
    amount: Money;
    refundedAmount: Money;
    method: PaymentMethod;
    status: PaymentStatus;
    paymentIntentId?: string;
    gateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    failureReason?: string;
    metadata?: Record<string, string>;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Payment {
    return new Payment(
      data.id,
      data.rideId,
      data.riderId,
      data.driverId,
      data.amount,
      data.refundedAmount,
      data.method,
      data.status,
      data.paymentIntentId,
      data.gateway,
      data.gatewayOrderId,
      data.gatewayPaymentId,
      data.gatewaySignature,
      data.failureReason ?? undefined,
      data.metadata ?? {},
      data.paidAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  markSuccess(gatewayPaymentId?: string, paidAt?: Date): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error("Payment cannot be marked successful from current state");
    }

    this.status = PaymentStatus.SUCCESS;
    this.gatewayPaymentId = gatewayPaymentId;
    this.paidAt = paidAt ?? new Date();
    this.updatedAt = new Date();
  }

  markFailed(reason?: string): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error("Payment cannot be marked failed from current state");
    }

    this.status = PaymentStatus.FAILED;
    if (reason) this.failureReason = reason;
    this.updatedAt = new Date();
  }

  confirmCashCollected(timestamp?: Date): void {
    if (this.method !== PaymentMethod.CASH) {
      throw new Error("confirmCashCollected only valid for cash payments");
    }
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error("Payment cannot be confirmed from current state");
    }

    this.status = PaymentStatus.SUCCESS;
    this.paidAt = timestamp ?? new Date();
    this.updatedAt = new Date();
  }

  applyRefund(amount: Money): void {
    if (
      this.status !== PaymentStatus.SUCCESS &&
      this.status !== PaymentStatus.PARTIALLY_REFUNDED
    ) {
      throw new Error("Refund allowed only for successful payments");
    }

    if (this.amount.getCurrency() !== amount.getCurrency()) {
      throw new Error("Refund currency must match payment currency");
    }

    const newRefundTotal = this.refundedAmount.add(amount);

    if (newRefundTotal.getAmount() > this.amount.getAmount()) {
      throw new Error("Refund amount exceeds payment amount");
    }

    this.refundedAmount = newRefundTotal;

    if (this.refundedAmount.getAmount() === this.amount.getAmount()) {
      this.status = PaymentStatus.REFUNDED;
    } else {
      this.status = PaymentStatus.PARTIALLY_REFUNDED;
    }

    this.updatedAt = new Date();
  }

  attachGatewayIds(params: {
    paymentIntentId?: string;
    gateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
  }): void {
    if (params.paymentIntentId) this.paymentIntentId = params.paymentIntentId;
    if (params.gateway) this.gateway = params.gateway;
    if (params.gatewayOrderId) this.gatewayOrderId = params.gatewayOrderId;
    if (params.gatewayPaymentId)
      this.gatewayPaymentId = params.gatewayPaymentId;
    if (params.gatewaySignature)
      this.gatewaySignature = params.gatewaySignature;
    this.updatedAt = new Date();
  }

  setFailureReason(reason: string): void {
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  isCash(): boolean {
    return this.method === PaymentMethod.CASH;
  }

  isOnline(): boolean {
    return this.method === PaymentMethod.ONLINE;
  }

  getRemainingRefundableAmount(): Money {
    return this.amount.subtract(this.refundedAmount);
  }

  getId(): string {
    return this.id;
  }
  getRideId(): string {
    return this.rideId;
  }
  getRiderId(): string {
    return this.riderId;
  }
  getDriverId(): string {
    return this.driverId;
  }
  getAmount(): Money {
    return this.amount;
  }
  getRefundedAmount(): Money {
    return this.refundedAmount;
  }
  getStatus(): PaymentStatus {
    return this.status;
  }
  getMethod(): PaymentMethod {
    return this.method;
  }
  getPaymentIntentId(): string | undefined {
    return this.paymentIntentId;
  }
  getGateway(): string | undefined {
    return this.gateway;
  }
  getGatewayOrderId(): string | undefined {
    return this.gatewayOrderId;
  }
  getGatewayPaymentId(): string | undefined {
    return this.gatewayPaymentId;
  }
  getGatewaySignature(): string | undefined {
    return this.gatewaySignature;
  }
  getFailureReason(): string | undefined {
    return this.failureReason;
  }
  getMetadata(): Readonly<Record<string, string>> {
    return { ...this.metadata };
  }
  getPaidAt(): Date | undefined {
    return this.paidAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
