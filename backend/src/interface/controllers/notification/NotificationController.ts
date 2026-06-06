import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { NOTIFICATION_MESSAGES } from "@shared/constants/NotificationMessages";

import { GetNotificationsDto } from "@application/dto/notification/GetNotificationsDto";
import { GetNotificationsResponseDto } from "@application/dto/notification/GetNotificationsResponseDto";
import { MarkNotificationsReadDto } from "@application/dto/notification/MarkNotificationsReadDto";
import { MarkNotificationsReadResponseDto } from "@application/dto/notification/MarkNotificationsReadResponseDto";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.GetNotificationsUseCase)
    private getNotificationsUseCase: IUseCase<
      GetNotificationsDto,
      Promise<Result<GetNotificationsResponseDto>>
    >,
    @inject(TYPES.MarkNotificationsReadUseCase)
    private markNotificationsReadUseCase: IUseCase<
      MarkNotificationsReadDto,
      Promise<Result<MarkNotificationsReadResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    return req.user?.userId ?? null;
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      Logger.info("Get notifications request received", { userId });

      const queryData = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
        isRead: req.query.isRead as string | undefined,
        type: req.query.type as string | undefined,
        channel: req.query.channel as string | undefined,
        fromDate: req.query.fromDate as string | undefined,
        toDate: req.query.toDate as string | undefined,
      };

      const dto = GetNotificationsDto.fromRequest(userId as string, queryData);
      const result = await this.getNotificationsUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Get notifications failed", {
          userId,
          error: error.message,
        });
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Notifications fetched successfully", {
        userId,
        total: responseData.pagination.total,
        unreadCount: responseData.unreadCount,
      });

      const response: ApiResponse = {
        success: true,
        message: NOTIFICATION_MESSAGES.FETCHED_SUCCESSFULLY,
        data: responseData,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Get notifications controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      Logger.info("Mark notifications as read request received", { userId });

      const dto = MarkNotificationsReadDto.fromRequest(
        userId as string,
        req.body,
      );
      const result = await this.markNotificationsReadUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Mark notifications as read failed", {
          userId,
          error: error.message,
        });
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Notifications marked as read successfully", {
        userId,
        updatedCount: responseData.updatedCount,
      });

      const response: ApiResponse = {
        success: true,
        message: NOTIFICATION_MESSAGES.MARKED_AS_READ,
        data: responseData,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Mark notifications as read controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
