"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationSchema = exports.CreateNotificationDto = void 0;
const zod_1 = require("zod");
const NotificationType_1 = require("@domain/value-objects/NotificationType");
const NotificationChannel_1 = require("@domain/value-objects/NotificationChannel");
const createNotificationSchema = zod_1.z.object({
    recipientId: zod_1.z.string().min(1, "Recipient ID is required"),
    type: zod_1.z.nativeEnum(NotificationType_1.NotificationType),
    channel: zod_1.z.nativeEnum(NotificationChannel_1.NotificationChannel),
    title: zod_1.z.string().min(1).max(255),
    body: zod_1.z.string().min(1).max(1000),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional().default({}),
});
exports.createNotificationSchema = createNotificationSchema;
class CreateNotificationDto {
    constructor(input) {
        this.data = createNotificationSchema.parse(input);
    }
    static fromPayload(input) {
        return new CreateNotificationDto(input);
    }
    getRecipientId() {
        return this.data.recipientId;
    }
    getType() {
        return this.data.type;
    }
    getChannel() {
        return this.data.channel;
    }
    getTitle() {
        return this.data.title;
    }
    getBody() {
        return this.data.body;
    }
    getMetadata() {
        return this.data.metadata;
    }
}
exports.CreateNotificationDto = CreateNotificationDto;
//# sourceMappingURL=CreateNotificationDto.js.map