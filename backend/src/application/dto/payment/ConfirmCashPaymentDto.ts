export class ConfirmCashPaymentDto {
  private constructor(
    private readonly userId: string,
    private readonly paymentId: string,
  ) {}

  static create(params: {
    userId: string;
    paymentId: string;
  }): ConfirmCashPaymentDto {
    return new ConfirmCashPaymentDto(params.userId, params.paymentId);
  }

  getUserId(): string {
    return this.userId;
  }

  getPaymentId(): string {
    return this.paymentId;
  }
}
