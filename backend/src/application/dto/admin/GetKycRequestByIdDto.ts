export class GetKycRequestByIdDto {
  public readonly kycId: string;

  constructor(params: any) {
    this.kycId = params.kycId;
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.kycId) {
      errors.push("KYC ID is required");
    }
    return errors;
  }
}
