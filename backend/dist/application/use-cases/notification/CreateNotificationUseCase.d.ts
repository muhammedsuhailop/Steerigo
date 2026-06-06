import { IUseCase } from "../interfaces/IUseCase";
import { CreateNotificationDto } from "../../dto/notification/CreateNotificationDto";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { Result } from "../../../shared/utils/Result";
import { INotificationRealtimePublisher } from "../../services/INotificationRealtimePublisher";
export interface CreateNotificationResponseDto {
    success: boolean;
    message: string;
    data: {
        notificationId: string;
    };
}
export declare class CreateNotificationUseCase implements IUseCase<CreateNotificationDto, Promise<Result<CreateNotificationResponseDto>>> {
    private notificationRepository;
    private realtimePublisher;
    constructor(notificationRepository: INotificationRepository, realtimePublisher: INotificationRealtimePublisher);
    execute(dto: CreateNotificationDto): Promise<Result<CreateNotificationResponseDto>>;
}
//# sourceMappingURL=CreateNotificationUseCase.d.ts.map