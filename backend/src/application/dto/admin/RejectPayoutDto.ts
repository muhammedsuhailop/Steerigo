export class RejectPayoutDto {
  private constructor(
    private readonly adminId: string,
    private readonly payoutId: string,
    private readonly reason: string,
  ) {}

  static create(params: {
    adminId: string;
    payoutId: string;
    reason: string;
  }): RejectPayoutDto {
    return new RejectPayoutDto(params.adminId, params.payoutId, params.reason);
  }

  getAdminId(): string {
    return this.adminId;
  }
  getPayoutId(): string {
    return this.payoutId;
  }
  getReason(): string {
    return this.reason;
  }
}
