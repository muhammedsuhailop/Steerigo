import { z } from "zod";

const updateKycStatusRequestSchema = z.object({
  kycId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  verificationStatus: z.enum(["Approved", "Rejected", "Expired"], {
      message:
        "Verification status must be one of: Approved, Rejected, Expired",
  }),
  comments: z.string().min(1).max(1000).optional(),
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

  getVerificationStatus(): "Approved" | "Rejected" | "Expired" {
    return this.data.verificationStatus;
  }

  getComments(): string | undefined {
    return this.data.comments;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.data.verificationStatus === "Rejected" && !this.data.comments) {
      errors.push("Comments are required when rejecting KYC documents");
    }

    return errors;
  }
}
