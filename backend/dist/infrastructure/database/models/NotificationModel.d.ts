import { Document, Model, Types } from "mongoose";
import { NotificationType } from "../../../domain/value-objects/NotificationType";
import { NotificationChannel } from "../../../domain/value-objects/NotificationChannel";
import { NotificationMetadata } from "../../../domain/entities/Notification";
export interface INotificationDocument extends Document {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId;
    type: NotificationType;
    channel: NotificationChannel;
    title: string;
    body: string;
    metadata: NotificationMetadata;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationModel: Model<INotificationDocument>;
//# sourceMappingURL=NotificationModel.d.ts.map