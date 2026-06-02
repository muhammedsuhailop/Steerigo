import { Notification } from "../../../domain/entities/Notification";
import { INotificationDocument } from "../../database/models/NotificationModel";
import { Document } from "mongoose";
export declare class NotificationMapper {
    static toDomain(doc: INotificationDocument): Notification;
    static toPersistence(notification: Notification): Omit<INotificationDocument, keyof Document>;
}
//# sourceMappingURL=NotificationMapper.d.ts.map