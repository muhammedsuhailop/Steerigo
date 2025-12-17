import { z } from "zod";

const getKycRequestByIdRequestSchema = z.object({
  kycId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid KYC ID format"),
});

type GetKycRequestByIdRequestData = z.infer<
  typeof getKycRequestByIdRequestSchema
>;

export class GetKycRequestByIdRequestDto {
  private readonly data: GetKycRequestByIdRequestData;

  constructor(requestData: unknown) {
    this.data = getKycRequestByIdRequestSchema.parse(requestData);
  }

  static fromRequest(requestData: unknown): GetKycRequestByIdRequestDto {
    return new GetKycRequestByIdRequestDto(requestData);
  }

  getKycId(): string {
    return this.data.kycId;
  }
}
