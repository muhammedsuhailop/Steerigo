import { z } from "zod";
export declare const updateBaseLocationSchema: z.ZodObject<{
    body: z.ZodObject<{
        driverId: z.ZodString;
        baseLocation: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=updateBaseLocationValidator.d.ts.map