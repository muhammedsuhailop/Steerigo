import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { CreateNotificationResponseDto } from "@application/dto/notification/CreateNotificationResponseDto";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { Result } from "@shared/utils/Result";
export interface INotificationPersistenceService {
    persistNotification(recipientId: string, data: {
        type: NotificationType;
        title: string;
        body: string;
        metadata: Record<string, unknown>;
    }): Promise<{
        notificationId: string;
    } | null>;
}
export declare class NotificationPersistenceService implements INotificationPersistenceService {
    private readonly createNotificationUseCase;
    constructor(createNotificationUseCase: IUseCase<CreateNotificationDto, Promise<Result<CreateNotificationResponseDto>>>);
    persistNotification(recipientId: string, data: {
        type: NotificationType;
        title: string;
        body: string;
        metadata: Record<string, unknown>;
    }): Promise<{
        notificationId: string;
    } | null>;
}
//# sourceMappingURL=NotificationPersistenceService.d.ts.map