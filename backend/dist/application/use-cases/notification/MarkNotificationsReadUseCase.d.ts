import { IUseCase } from "../interfaces/IUseCase";
import { MarkNotificationsReadDto } from "../../dto/notification/MarkNotificationsReadDto";
import { MarkNotificationsReadResponseDto } from "../../dto/notification/MarkNotificationsReadResponseDto";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { Result } from "../../../shared/utils/Result";
export declare class MarkNotificationsReadUseCase implements IUseCase<MarkNotificationsReadDto, Promise<Result<MarkNotificationsReadResponseDto>>> {
    private notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(dto: MarkNotificationsReadDto): Promise<Result<MarkNotificationsReadResponseDto>>;
}
//# sourceMappingURL=MarkNotificationsReadUseCase.d.ts.map