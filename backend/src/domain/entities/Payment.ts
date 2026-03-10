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

    private gateway?: string,
    private gatewayOrderId?: string,
    private gatewayPaymentId?: string,

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
    gateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
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
      data.gateway,
      data.gatewayOrderId,
      data.gatewayPaymentId,
      data.paidAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  markSuccess(gatewayPaymentId?: string): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error("Payment cannot be marked successful from current state");
    }

    this.status = PaymentStatus.SUCCESS;
    this.gatewayPaymentId = gatewayPaymentId;
    this.paidAt = new Date();
    this.updatedAt = new Date();
  }

  markFailed(): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error("Payment cannot be marked failed from current state");
    }

    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  applyRefund(amount: Money): void {
    if (
      this.status !== PaymentStatus.SUCCESS &&
      this.status !== PaymentStatus.PARTIALLY_REFUNDED
    ) {
      throw new Error("Refund allowed only for successful payments");
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

  getGatewayPaymentId(): string | undefined {
    return this.gatewayPaymentId;
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
