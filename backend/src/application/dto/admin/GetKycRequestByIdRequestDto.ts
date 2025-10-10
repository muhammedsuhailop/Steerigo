import { z } from "zod";

const getKycRequestByIdRequestSchema = z.object({
  kycId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid KYC ID format"),
});

type GetKycRequestByIdRequestData = z.infer<
  typeof getKycRequestByIdRequestSchema
>;

export class GetKycRequestByIdRequestDto {
  private readonly data: GetKycRequestByIdRequestData;

  constructor(requestData: any) {
    this.data = getKycRequestByIdRequestSchema.parse(requestData);
  }

  getKycId(): string {
    return this.data.kycId;
  }
}
