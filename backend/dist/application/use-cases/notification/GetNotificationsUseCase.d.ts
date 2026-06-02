import { IUseCase } from "../interfaces/IUseCase";
import { GetNotificationsDto } from "@application/dto/notification/GetNotificationsDto";
import { GetNotificationsResponseDto } from "@application/dto/notification/GetNotificationsResponseDto";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { Result } from "@shared/utils/Result";
export declare class GetNotificationsUseCase implements IUseCase<GetNotificationsDto, Promise<Result<GetNotificationsResponseDto>>> {
    private notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(dto: GetNotificationsDto): Promise<Result<GetNotificationsResponseDto>>;
    private mapToNotificationData;
}
//# sourceMappingURL=GetNotificationsUseCase.d.ts.map