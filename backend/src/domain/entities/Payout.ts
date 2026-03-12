import { Money } from "@domain/value-objects/Money";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export type BankDestination = {
  type: "BANK";
  accountNumber: string;
  ifsc: string;
  beneficiaryName: string;
  bankName?: string;
};

export type UpiDestination = {
  type: "UPI";
  upiId: string;
  beneficiaryName?: string;
};

export type PayoutDestination = BankDestination | UpiDestination;

export class Payout {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private readonly amount: Money,
    private readonly currency: string,
    private status: PayoutStatus,
    private readonly method: PayoutMethod,
    private readonly destination?: PayoutDestination,
    private readonly externalPayoutId?: string,
    private readonly fee?: Money,
    private failureReason?: string,
    private readonly createdAt: Date = new Date(),
    private processedAt?: Date,
    private updatedAt: Date = new Date(),
  ) {}

  static request(params: {
    id: string;
    driverId: string;
    amount: Money;
    method: PayoutMethod;
    destination?: PayoutDestination;
    fee?: Money;
  }): Payout {
    if (params.amount.getAmount() <= 0) {
      throw new Error("Payout amount must be positive");
    }

    return new Payout(
      params.id,
      params.driverId,
      params.amount,
      params.amount.getCurrency(),
      PayoutStatus.REQUESTED,
      params.method,
      params.destination,
      undefined,
      params.fee,
      undefined,
      new Date(),
      undefined,
      new Date(),
    );
  }

  static fromData(data: {
    id: string;
    driverId: string;
    amount: Money;
    currency: string;
    status: PayoutStatus;
    method: PayoutMethod;
    destination?: PayoutDestination;
    externalPayoutId?: string;
    fee?: Money;
    failureReason?: string;
    createdAt: Date;
    processedAt?: Date;
    updatedAt: Date;
  }): Payout {
    const p = new Payout(
      data.id,
      data.driverId,
      data.amount,
      data.currency,
      data.status,
      data.method,
      data.destination,
      data.externalPayoutId,
      data.fee,
      data.failureReason,
      data.createdAt,
      data.processedAt,
      data.updatedAt,
    );
    return p;
  }

  markProcessing(externalPayoutId?: string): void {
    if (this.status !== PayoutStatus.REQUESTED) {
      throw new Error("Only requested payouts can be moved to processing");
    }
    this.status = PayoutStatus.PROCESSING;
    if (externalPayoutId) (this as any).externalPayoutId = externalPayoutId;
    this.updatedAt = new Date();
  }

  markCompleted(processedAt?: Date): void {
    if (this.status !== PayoutStatus.PROCESSING) {
      throw new Error("Only processing payouts can be marked completed");
    }
    this.status = PayoutStatus.COMPLETED;
    this.processedAt = processedAt ?? new Date();
    this.updatedAt = new Date();
  }

  markFailed(reason?: string): void {
    if (
      this.status !== PayoutStatus.PROCESSING &&
      this.status !== PayoutStatus.REQUESTED
    ) {
      throw new Error("Only requested or processing payouts can be failed");
    }
    this.status = PayoutStatus.FAILED;
    if (reason) this.failureReason = reason;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status !== PayoutStatus.REQUESTED) {
      throw new Error("Only requested payouts can be cancelled");
    }
    this.status = PayoutStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }
  getDriverId(): string {
    return this.driverId;
  }
  getAmount(): Money {
    return this.amount;
  }
  getCurrency(): string {
    return this.currency;
  }
  getStatus(): PayoutStatus {
    return this.status;
  }
  getMethod(): PayoutMethod {
    return this.method;
  }
  getDestination(): PayoutDestination | undefined {
    return this.destination;
  }
  getExternalPayoutId(): string | undefined {
    return this.externalPayoutId;
  }
  getFee(): Money | undefined {
    return this.fee;
  }
  getFailureReason(): string | undefined {
    return this.failureReason;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getProcessedAt(): Date | undefined {
    return this.processedAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
