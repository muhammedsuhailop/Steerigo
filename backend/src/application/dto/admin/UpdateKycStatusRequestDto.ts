import { z } from "zod";

const updateKycStatusRequestSchema = z.object({
  kycId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid KYC ID format"),
  kycStatus: z.enum(["Approved", "Rejected", "Under Review"], {
    message: "KYC status must be one of: Approved, Rejected, Under Review",
  }),
  comments: z.string().min(1).max(1000).optional(),
  reviewedBy: z.string().uuid("Invalid reviewer ID format"),
});

type UpdateKycStatusRequestData = z.infer<typeof updateKycStatusRequestSchema>;

export class UpdateKycStatusRequestDto {
  private readonly data: UpdateKycStatusRequestData;

  constructor(requestData: any) {
    this.data = updateKycStatusRequestSchema.parse(requestData);
  }

  getKycId(): string {
    return this.data.kycId;
  }

  getKycStatus(): "Approved" | "Rejected" | "Under Review" {
    return this.data.kycStatus;
  }

  getComments(): string | undefined {
    return this.data.comments;
  }

  getReviewedBy(): string {
    return this.data.reviewedBy;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.data.kycStatus === "Rejected" && !this.data.comments) {
      errors.push("Comments are required when rejecting KYC requests");
    }

    return errors;
  }
}
