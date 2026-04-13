import { injectable, inject } from "inversify";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { CreateNotificationResponseDto } from "@application/dto/notification/CreateNotificationResponseDto";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

export interface INotificationPersistenceService {
  persistNotification(
    recipientId: string,
    data: {
      type: NotificationType;
      title: string;
      body: string;
      metadata: Record<string, unknown>;
    },
  ): Promise<{ notificationId: string } | null>;
}

@injectable()
export class NotificationPersistenceService
  implements INotificationPersistenceService
{
  constructor(
    @inject(TYPES.CreateNotificationUseCase)
    private readonly createNotificationUseCase: IUseCase<
      CreateNotificationDto,
      Promise<Result<CreateNotificationResponseDto>>
    >,
  ) {}

  async persistNotification(
    recipientId: string,
    data: {
      type: NotificationType;
      title: string;
      body: string;
      metadata: Record<string, unknown>;
    },
  ): Promise<{ notificationId: string } | null> {
    try {
      const dto = CreateNotificationDto.fromPayload({
        recipientId,
        type: data.type,
        channel: NotificationChannel.IN_APP,
        title: data.title,
        body: data.body,
        metadata: data.metadata,
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Notification persist failed", {
          recipientId,
          error: result.getError().message,
        });
        return null;
      }

      const notification = result.getValue().data;

      Logger.info("Notification persisted", {
        recipientId,
        notificationId: notification.notificationId,
        type: data.type,
      });

      return { notificationId: notification.notificationId };
    } catch (error) {
      Logger.error("Unexpected notification persistence error", {
        recipientId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
}
