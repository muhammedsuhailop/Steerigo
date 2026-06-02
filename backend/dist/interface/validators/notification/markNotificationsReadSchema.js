"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationsReadSchema = void 0;
const zod_1 = require("zod");
exports.markNotificationsReadSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        notificationId: zod_1.z.string().optional(),
        markAll: zod_1.z.boolean().optional(),
    })
        .refine((data) => data.markAll === true || !!data.notificationId, {
        message: "Provide either notificationId or set markAll to true",
    }),
});
//# sourceMappingURL=markNotificationsReadSchema.js.map