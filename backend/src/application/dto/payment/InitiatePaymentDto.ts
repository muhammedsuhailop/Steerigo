import { PaymentMethod } from "@domain/value-objects/PaymentMethod";

export class InitiatePaymentDto {
  private constructor(
    private readonly userId: string,
    private readonly rideId: string,
    private readonly method: PaymentMethod,
  ) {}

  static create(params: {
    userId: string;
    rideId: string;
    method: PaymentMethod;
  }): InitiatePaymentDto {
    return new InitiatePaymentDto(params.userId, params.rideId, params.method);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }

  getMethod(): PaymentMethod {
    return this.method;
  }
}
