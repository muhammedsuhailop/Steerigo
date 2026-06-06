"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateRideSchema = void 0;
const zod_1 = require("zod");
const RatingCriteriaType_1 = require("../../../domain/value-objects/RatingCriteriaType");
const dynamicCriteriaShape = Object.values(RatingCriteriaType_1.RatingCriteriaType).reduce((acc, key) => {
    acc[key] = zod_1.z.any();
    return acc;
}, {});
exports.rateRideSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "Ride ID is required"),
    }),
    body: zod_1.z.object({
        criteria: zod_1.z.object(dynamicCriteriaShape),
        review: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=rateRideSchema.js.map