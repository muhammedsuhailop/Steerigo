"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
const Notification_1 = require("@domain/entities/Notification");
const idHelper_1 = require("@shared/utils/idHelper");
class NotificationMapper {
    static toDomain(doc) {
        return Notification_1.Notification.fromData({
            id: doc._id.toString(),
            recipientId: doc.recipientId.toString(),
            type: doc.type,
            channel: doc.channel,
            title: doc.title,
            body: doc.body,
            metadata: doc.metadata ?? {},
            isRead: doc.isRead,
            readAt: doc.readAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(notification) {
        return {
            recipientId: (0, idHelper_1.toObjectId)(notification.getRecipientId()),
            type: notification.getType(),
            channel: notification.getChannel(),
            title: notification.getTitle(),
            body: notification.getBody(),
            metadata: notification.getMetadata(),
            isRead: notification.getIsRead(),
            readAt: notification.getReadAt(),
            createdAt: notification.getCreatedAt(),
            updatedAt: notification.getUpdatedAt(),
        };
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=NotificationMapper.js.map