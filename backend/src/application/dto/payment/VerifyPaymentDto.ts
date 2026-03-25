export class VerifyPaymentDto {
  private constructor(
    private readonly userId: string,
    private readonly paymentId: string,
    private readonly gatewayOrderId: string,
    private readonly gatewayPaymentId: string,
    private readonly gatewaySignature: string,
  ) {}

  static create(params: {
    userId: string;
    paymentId: string;
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
  }): VerifyPaymentDto {
    return new VerifyPaymentDto(
      params.userId,
      params.paymentId,
      params.gatewayOrderId,
      params.gatewayPaymentId,
      params.gatewaySignature,
    );
  }

  getUserId(): string {
    return this.userId;
  }

  getPaymentId(): string {
    return this.paymentId;
  }

  getGatewayOrderId(): string {
    return this.gatewayOrderId;
  }

  getGatewayPaymentId(): string {
    return this.gatewayPaymentId;
  }

  getGatewaySignature(): string {
    return this.gatewaySignature;
  }
}
