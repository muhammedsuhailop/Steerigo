"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsSchema = void 0;
const zod_1 = require("zod");
const NotificationType_1 = require("@domain/value-objects/NotificationType");
const NotificationChannel_1 = require("@domain/value-objects/NotificationChannel");
exports.getNotificationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        isRead: zod_1.z.enum(["true", "false"]).optional(),
        type: zod_1.z.nativeEnum(NotificationType_1.NotificationType).optional(),
        channel: zod_1.z.nativeEnum(NotificationChannel_1.NotificationChannel).optional(),
        fromDate: zod_1.z.string().datetime().optional(),
        toDate: zod_1.z.string().datetime().optional(),
    }),
});
//# sourceMappingURL=getNotificationsSchema.js.map