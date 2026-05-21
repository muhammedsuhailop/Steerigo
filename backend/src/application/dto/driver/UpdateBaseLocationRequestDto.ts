
import { z } from "zod";

export const updateBaseLocationSchema = z.object({
  driverId: z.string().min(1, "driverId is required"),
  baseLocation: z.object({
    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    address: z
      .string()
      .max(500, "Address cannot exceed 500 characters")
      .optional(),
  }),
});
type UpdateBaseLocationData = z.infer<typeof updateBaseLocationSchema>;

export class UpdateBaseLocationRequestDto {
  private readonly data: UpdateBaseLocationData;

  constructor(requestData: unknown) {
    this.data = updateBaseLocationSchema.parse(requestData);
  }

  static fromRequest(requestBody: unknown): UpdateBaseLocationRequestDto {
    return new UpdateBaseLocationRequestDto(requestBody);
  }

  getDriverId(): string {
    return this.data.driverId;
  }

  getBaseLocationData(): {
    latitude: number;
    longitude: number;
    address?: string;
  } {
    return this.data.baseLocation;
  }
}
