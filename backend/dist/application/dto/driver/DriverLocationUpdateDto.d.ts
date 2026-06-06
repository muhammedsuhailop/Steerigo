import { z } from "zod";
declare const driverLocationUpdateSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    bearing: z.ZodOptional<z.ZodNumber>;
    speedKph: z.ZodOptional<z.ZodNumber>;
    accuracy: z.ZodOptional<z.ZodNumber>;
    rideId: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type DriverLocationUpdatePayload = z.infer<typeof driverLocationUpdateSchema>;
export declare class DriverLocationUpdateDto {
    private readonly driverUserId;
    private readonly data;
    constructor(driverUserId: string, payload: unknown);
    static fromSocket(driverUserId: string, payload: unknown): DriverLocationUpdateDto;
    getDriverUserId(): string;
    getLatitude(): number;
    getLongitude(): number;
    getBearing(): number | undefined;
    getSpeedKph(): number | undefined;
    getAccuracy(): number | undefined;
    getRideId(): string | undefined;
    getClientUpdatedAt(): number | undefined;
}
export { driverLocationUpdateSchema };
//# sourceMappingURL=DriverLocationUpdateDto.d.ts.map