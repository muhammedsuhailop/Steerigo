import { z } from "zod";

const updateLocationSchema = z.object({
  currentLocation: z.object({
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

type UpdateLocationData = z.infer<typeof updateLocationSchema>;

export class UpdateLocationRequestDto {
  private readonly data: UpdateLocationData;
  private readonly driverId: string;

  constructor(requestData: any) {
    this.data = updateLocationSchema.parse(requestData);
    this.driverId = requestData.driverId;
  }

  getLocationData(): {
    latitude: number;
    longitude: number;
    address?: string;
  } {
    return this.data.currentLocation;
  }

  getDriverId(): string {
    return this.driverId;
  }
}
