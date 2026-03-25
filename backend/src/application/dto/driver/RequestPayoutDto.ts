import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutDestination } from "@domain/entities/Payout";

export class RequestPayoutDto {
  private constructor(
    private readonly userId: string,
    private readonly amount: number,
    private readonly method: PayoutMethod,
    private readonly destination: PayoutDestination,
  ) {}

  static create(params: {
    userId: string;
    amount: number;
    method: PayoutMethod;
    destination: PayoutDestination;
  }): RequestPayoutDto {
    return new RequestPayoutDto(
      params.userId,
      params.amount,
      params.method,
      params.destination,
    );
  }

  getUserId(): string {
    return this.userId;
  }
  getAmount(): number {
    return this.amount;
  }
  getMethod(): PayoutMethod {
    return this.method;
  }
  getDestination(): PayoutDestination {
    return this.destination;
  }
}
