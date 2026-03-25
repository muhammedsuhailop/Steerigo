export class ConfirmCashPaymentDto {
  private constructor(
    private readonly userId: string,
    private readonly rideId: string,
    private readonly method: string,
    private readonly amount: number,
  ) {}

  static create(params: {
    userId: string;
    rideId: string;
    method: string;
    amount: number;
  }): ConfirmCashPaymentDto {
    return new ConfirmCashPaymentDto(
      params.userId,
      params.rideId,
      params.method,
      params.amount,
    );
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }

  getMethod(): string {
    return this.method;
  }

  getAmount(): number {
    return this.amount;
  }
}
