import { z } from "zod";
export declare const updateBaseLocationSchema: z.ZodObject<{
    driverId: z.ZodString;
    baseLocation: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare class UpdateBaseLocationRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(requestBody: unknown): UpdateBaseLocationRequestDto;
    getDriverId(): string;
    getBaseLocationData(): {
        latitude: number;
        longitude: number;
        address?: string;
    };
}
//# sourceMappingURL=UpdateBaseLocationRequestDto.d.ts.map