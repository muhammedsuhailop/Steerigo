import { z } from "zod";
export declare const locationSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const sendRideRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        requestGroupId: z.ZodString;
        driverId: z.ZodString;
        pickup: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        drop: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        pickupTime: z.ZodString;
        rideType: z.ZodEnum<{
            "One Way": "One Way";
            "Round Trip": "Round Trip";
        }>;
        fareBreakdown: z.ZodObject<{
            baseFare: z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>;
            platformFee: z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>;
            taxes: z.ZodObject<{
                fare: z.ZodObject<{
                    name: z.ZodString;
                    rate: z.ZodNumber;
                    amount: z.ZodObject<{
                        amount: z.ZodNumber;
                        currency: z.ZodDefault<z.ZodString>;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                platformFee: z.ZodObject<{
                    name: z.ZodString;
                    rate: z.ZodNumber;
                    amount: z.ZodObject<{
                        amount: z.ZodNumber;
                        currency: z.ZodDefault<z.ZodString>;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>;
            totalFare: z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>;
            durationHours: z.ZodNumber;
        }, z.core.$strip>;
        pickupETA: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type SendRideRequestInput = z.infer<typeof sendRideRequestSchema>;
//# sourceMappingURL=rideRequestValidators.d.ts.map