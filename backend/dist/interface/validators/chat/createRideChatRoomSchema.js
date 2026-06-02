"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideChatRoomRouteSchema = void 0;
const zod_1 = require("zod");
const objectIdRideRegex = /^RIDE-[0-9a-fA-F]{24}$/;
exports.createRideChatRoomRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z
            .string()
            .min(1, "Ride ID is required")
            .refine((value) => {
            // Mongo ObjectId format
            if (objectIdRideRegex.test(value)) {
                return true;
            }
            // UUID format
            if (value.startsWith("RIDE-")) {
                const uuidPart = value.replace("RIDE-", "");
                return zod_1.z.uuid().safeParse(uuidPart).success;
            }
            return false;
        }, {
            message: "Invalid Ride ID",
        }),
    }),
});
//# sourceMappingURL=createRideChatRoomSchema.js.map