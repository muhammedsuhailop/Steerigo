import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { z } from "zod";

const updateKycStatusRequestSchema = z.object({
  kycId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  verificationStatus: z.nativeEnum(KYCStatus, {
    message: `Verification status must be one of: ${Object.values(KYCStatus).join(", ")}`,
  }),
  comments: z.string().min(1).max(1000).optional(),
  docImageUrlsFront: z.array(z.string().url()).optional(),
  docImageUrlsBack: z.array(z.string().url()).optional(),
});

interface UpdateKycStatusRequestBody {
  verificationStatus: KYCStatus;
  comments?: string;
  docImageUrlsFront?: string[];
  docImageUrlsBack?: string[];
}


type UpdateKycStatusRequestData = z.infer<typeof updateKycStatusRequestSchema>;

export class UpdateKycStatusRequestDto {
  private readonly data: UpdateKycStatusRequestData;

  constructor(requestData: unknown) {
    this.data = updateKycStatusRequestSchema.parse(requestData);
  }

  static fromRequest(
    kycId: string,
    requestBody: unknown
  ): UpdateKycStatusRequestDto {
    const body = (requestBody ?? {}) as UpdateKycStatusRequestBody;

    const mergedData = {
      kycId,
      verificationStatus: body.verificationStatus,
      comments: body.comments,
      docImageUrlsFront: body.docImageUrlsFront,
      docImageUrlsBack: body.docImageUrlsBack,
    };

    return new UpdateKycStatusRequestDto(mergedData);
  }

  getKycId(): string {
    return this.data.kycId;
  }

  getVerificationStatus(): KYCStatus {
    return this.data.verificationStatus;
  }

  getComments(): string | undefined {
    return this.data.comments;
  }

  getDocImageUrlsFront(): string[] | undefined {
    return this.data.docImageUrlsFront;
  }

  getDocImageUrlsBack(): string[] | undefined {
    return this.data.docImageUrlsBack;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.data.verificationStatus === "Rejected" && !this.data.comments) {
      errors.push("Comments are required when rejecting KYC documents");
    }

    if (this.data.comments) {
      if (this.data.comments.length < 1) {
        errors.push("Comments cannot be empty");
      }
      if (this.data.comments.length > 1000) {
        errors.push("Comments cannot exceed 1000 characters");
      }
    }

    return errors;
  }
}
