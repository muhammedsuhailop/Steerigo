import { INotificationRepository, INotificationPaginationOptions } from "@domain/repositories/INotificationRepository";
import { Notification } from "@domain/entities/Notification";
import { PaginatedResult } from "@shared/types/Repository";
export declare class NotificationRepositoryImpl implements INotificationRepository {
    save(notification: Notification): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByRecipientId(recipientId: string, options: INotificationPaginationOptions): Promise<PaginatedResult<Notification>>;
    markOneAsRead(id: string, recipientId: string): Promise<Notification | null>;
    markAllAsRead(recipientId: string): Promise<number>;
    countUnread(recipientId: string): Promise<number>;
    deleteById(id: string): Promise<void>;
}
//# sourceMappingURL=NotificationRepositoryImpl.d.ts.map