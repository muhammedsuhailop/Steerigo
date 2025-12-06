import { z } from "zod";

const getDriverProfileRequestSchema = z.object({
  driverId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
});

type GetDriverProfileRequestData = z.infer<
  typeof getDriverProfileRequestSchema
>;

export class GetDriverProfileRequestDto {
  private readonly data: GetDriverProfileRequestData;

  constructor(requestData: unknown) {
    this.data = getDriverProfileRequestSchema.parse(requestData);
  }

  getDriverId(): string {
    return this.data.driverId;
  }
}
