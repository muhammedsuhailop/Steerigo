import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { GetNotificationsDto } from "../../../application/dto/notification/GetNotificationsDto";
import { GetNotificationsResponseDto } from "../../../application/dto/notification/GetNotificationsResponseDto";
import { MarkNotificationsReadDto } from "../../../application/dto/notification/MarkNotificationsReadDto";
import { MarkNotificationsReadResponseDto } from "../../../application/dto/notification/MarkNotificationsReadResponseDto";
export declare class NotificationController {
    private getNotificationsUseCase;
    private markNotificationsReadUseCase;
    constructor(getNotificationsUseCase: IUseCase<GetNotificationsDto, Promise<Result<GetNotificationsResponseDto>>>, markNotificationsReadUseCase: IUseCase<MarkNotificationsReadDto, Promise<Result<MarkNotificationsReadResponseDto>>>);
    private getUserId;
    getNotifications(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=NotificationController.d.ts.map