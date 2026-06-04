import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { MarkNotificationsReadDto } from "@application/dto/notification/MarkNotificationsReadDto";
import { MarkNotificationsReadResponseDto } from "@application/dto/notification/MarkNotificationsReadResponseDto";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { NotificationErrors } from "@domain/errors/NotificationError";

@injectable()
export class MarkNotificationsReadUseCase
  implements
    IUseCase<
      MarkNotificationsReadDto,
      Promise<Result<MarkNotificationsReadResponseDto>>
    >
{
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    dto: MarkNotificationsReadDto,
  ): Promise<Result<MarkNotificationsReadResponseDto>> {
    try {
      Logger.info("Marking notifications as read", {
        userId: dto.getUserId(),
        notificationId: dto.getNotificationId(),
        markAll: dto.isMarkAll(),
      });

      let updatedCount: number;

      if (dto.isMarkAll()) {
        updatedCount = await this.notificationRepository.markAllAsRead(
          dto.getUserId(),
        );

        Logger.info("All notifications marked as read", {
          userId: dto.getUserId(),
          updatedCount,
        });
      } else {
        const notificationId = dto.getNotificationId();

        if (!notificationId) {
          return Result.failure(
            NotificationErrors.notificationIdOrMarkAllRequired(),
          );
        }

        const updated = await this.notificationRepository.markOneAsRead(
          notificationId,
          dto.getUserId(),
        );

        if (!updated) {
          return Result.failure(
            NotificationErrors.notificationNotFound(notificationId),
          );
        }

        updatedCount = 1;

        Logger.info("Single notification marked as read", {
          userId: dto.getUserId(),
          notificationId,
        });
      }

      return Result.success({
        updatedCount,
      });
    } catch (error) {
      Logger.error("Error marking notifications as read", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
