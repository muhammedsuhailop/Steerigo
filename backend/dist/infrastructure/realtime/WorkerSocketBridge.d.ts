import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { CreateNotificationResponseDto } from "@application/dto/notification/CreateNotificationResponseDto";
import { Result } from "@shared/utils/Result";
export declare class WorkerSocketBridge {
    private readonly createNotificationUseCase;
    private subscriber;
    constructor(createNotificationUseCase: IUseCase<CreateNotificationDto, Promise<Result<CreateNotificationResponseDto>>>);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=WorkerSocketBridge.d.ts.map