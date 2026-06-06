"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationsReadSchema = exports.MarkNotificationsReadDto = void 0;
const zod_1 = require("zod");
const markNotificationsReadSchema = zod_1.z.object({
    notificationId: zod_1.z.string().optional(),
    markAll: zod_1.z.boolean().optional().default(false),
});
exports.markNotificationsReadSchema = markNotificationsReadSchema;
class MarkNotificationsReadDto {
    constructor(userId, body) {
        this.userId = userId;
        this.data = markNotificationsReadSchema.parse(body);
    }
    static fromRequest(userId, body) {
        return new MarkNotificationsReadDto(userId, body);
    }
    getUserId() {
        return this.userId;
    }
    getNotificationId() {
        return this.data.notificationId;
    }
    isMarkAll() {
        return this.data.markAll;
    }
}
exports.MarkNotificationsReadDto = MarkNotificationsReadDto;
//# sourceMappingURL=MarkNotificationsReadDto.js.map