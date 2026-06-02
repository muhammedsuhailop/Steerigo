import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { EditChatMessageDto } from "@application/dto/chat/EditChatMessageDto";
import { EditChatMessageResponseDto } from "@application/dto/chat/response/EditChatMessageResponseDto";
import { IChatEventBus } from "@application/services/IChatEventBus";
export declare class EditChatMessageUseCase implements IUseCase<EditChatMessageDto, Promise<Result<EditChatMessageResponseDto>>> {
    private readonly messageRepository;
    private readonly chatEventBus;
    constructor(messageRepository: IMessageRepository, chatEventBus: IChatEventBus);
    execute(dto: EditChatMessageDto): Promise<Result<EditChatMessageResponseDto>>;
}
//# sourceMappingURL=EditChatMessageUseCase.d.ts.map