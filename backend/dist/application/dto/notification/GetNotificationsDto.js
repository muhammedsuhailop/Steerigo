"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsSchema = exports.GetNotificationsDto = void 0;
const zod_1 = require("zod");
const NotificationType_1 = require("@domain/value-objects/NotificationType");
const NotificationChannel_1 = require("@domain/value-objects/NotificationChannel");
const getNotificationsSchema = zod_1.z.object({
    page: zod_1.z.number().positive().optional().default(1),
    limit: zod_1.z.number().positive().max(100).optional().default(20),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
    isRead: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"])])
        .transform((val) => {
        if (typeof val === "boolean")
            return val;
        return val === "true";
    })
        .optional(),
    type: zod_1.z.nativeEnum(NotificationType_1.NotificationType).optional(),
    channel: zod_1.z.nativeEnum(NotificationChannel_1.NotificationChannel).optional(),
    fromDate: zod_1.z.string().datetime().optional(),
    toDate: zod_1.z.string().datetime().optional(),
});
exports.getNotificationsSchema = getNotificationsSchema;
class GetNotificationsDto {
    constructor(userId, query) {
        this.userId = userId;
        this.data = getNotificationsSchema.parse(query);
    }
    static fromRequest(userId, query) {
        return new GetNotificationsDto(userId, query);
    }
    getUserId() {
        return this.userId;
    }
    getPage() {
        return this.data.page;
    }
    getLimit() {
        return this.data.limit;
    }
    getSortOrder() {
        return this.data.sortOrder;
    }
    getIsRead() {
        return this.data.isRead;
    }
    getType() {
        return this.data.type;
    }
    getChannel() {
        return this.data.channel;
    }
    getFromDate() {
        return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
    }
    getToDate() {
        return this.data.toDate ? new Date(this.data.toDate) : undefined;
    }
}
exports.GetNotificationsDto = GetNotificationsDto;
//# sourceMappingURL=GetNotificationsDto.js.map