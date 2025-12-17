import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { z } from "zod";

interface UpdateDriverKycStatusRequestBody {
  kycStatus: KYCStatus;
  comments?: string;
}

const updateDriverKycStatusSchema = z.object({
  driverId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  kycStatus: z.nativeEnum(KYCStatus, {
    message: "KYC status must be one of: InReview, Rejected, Approved, Expired",
  }),
  comments: z
    .string()
    .min(1, "Comments must be at least 1 character")
    .max(1000, "Comments cannot exceed 1000 characters")
    .optional(),
});

type UpdateDriverKycStatusData = z.infer<typeof updateDriverKycStatusSchema>;

export class UpdateDriverKycStatusRequestDto {
  private readonly data: UpdateDriverKycStatusData;

  constructor(requestData: unknown) {
    this.data = updateDriverKycStatusSchema.parse(requestData);
  }

  static fromRequest(driverId: string, requestBody: unknown) {
    const body = (requestBody ?? {}) as UpdateDriverKycStatusRequestBody;
    return new UpdateDriverKycStatusRequestDto({
      driverId,
      kycStatus: body.kycStatus,
      comments: body.comments,
    });
  }

  getDriverId(): string {
    return this.data.driverId;
  }

  getKycStatus(): KYCStatus {
    return this.data.kycStatus;
  }

  getComments(): string | undefined {
    return this.data.comments;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.data.kycStatus === "Rejected" && !this.data.comments) {
      errors.push("Comments are required when rejecting driver KYC status");
    }

    return errors;
  }
}
