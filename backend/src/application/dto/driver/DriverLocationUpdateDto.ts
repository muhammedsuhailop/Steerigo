import { z } from "zod";

const driverLocationUpdateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  bearing: z.number().min(0).max(360).optional(),
  speedKph: z.number().min(0).max(300).optional(),
  accuracy: z.number().min(0).max(2000).optional(),
  rideId: z.string().min(1).optional(),
  updatedAt: z.number().optional(), 
});

export type DriverLocationUpdatePayload = z.infer<
  typeof driverLocationUpdateSchema
>;

export class DriverLocationUpdateDto {
  private readonly driverUserId: string;
  private readonly data: DriverLocationUpdatePayload;

  constructor(driverUserId: string, payload: unknown) {
    this.driverUserId = driverUserId;
    this.data = driverLocationUpdateSchema.parse(payload);
  }

  static fromSocket(
    driverUserId: string,
    payload: unknown,
  ): DriverLocationUpdateDto {
    return new DriverLocationUpdateDto(driverUserId, payload);
  }

  getDriverUserId(): string {
    return this.driverUserId;
  }

  getLatitude(): number {
    return this.data.lat;
  }

  getLongitude(): number {
    return this.data.lng;
  }

  getBearing(): number | undefined {
    return this.data.bearing;
  }

  getSpeedKph(): number | undefined {
    return this.data.speedKph;
  }

  getAccuracy(): number | undefined {
    return this.data.accuracy;
  }

  getRideId(): string | undefined {
    return this.data.rideId;
  }

  getClientUpdatedAt(): number | undefined {
    return this.data.updatedAt;
  }
}

export { driverLocationUpdateSchema };
