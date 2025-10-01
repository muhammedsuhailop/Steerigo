export class UpdateKycStatusDto {
  public readonly kycId: string;
  public readonly kycStatus: "approved" | "rejected";
  public readonly comments?: string;

  constructor(data: any) {
    this.kycId = data.kycId;
    this.kycStatus = data.kycStatus;
    this.comments = data.comments;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.kycId) {
      errors.push("KYC ID is required");
    }

    if (!this.kycStatus) {
      errors.push("KYC status is required");
    }

    if (this.kycStatus && !["approved", "rejected"].includes(this.kycStatus)) {
      errors.push("KYC status must be either 'approved' or 'rejected'");
    }

    if (this.comments && this.comments.length > 500) {
      errors.push("Comments must not exceed 500 characters");
    }

    return errors;
  }
}
