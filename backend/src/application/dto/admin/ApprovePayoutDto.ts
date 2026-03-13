export class ApprovePayoutDto {
  private constructor(
    private readonly adminId: string,
    private readonly payoutId: string,
  ) {}

  static create(params: {
    adminId: string;
    payoutId: string;
  }): ApprovePayoutDto {
    return new ApprovePayoutDto(params.adminId, params.payoutId);
  }

  getAdminId(): string {
    return this.adminId;
  }
  getPayoutId(): string {
    return this.payoutId;
  }
}
