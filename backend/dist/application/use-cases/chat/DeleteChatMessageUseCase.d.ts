import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { DeleteChatMessageDto } from "@application/dto/chat/DeleteChatMessageDto";
import { DeleteChatMessageResponseDto } from "@application/dto/chat/response/DeleteChatMessageResponseDto";
import { IChatEventBus } from "@application/services/IChatEventBus";
export declare class DeleteChatMessageUseCase implements IUseCase<DeleteChatMessageDto, Promise<Result<DeleteChatMessageResponseDto>>> {
    private readonly messageRepository;
    private readonly chatEventBus;
    constructor(messageRepository: IMessageRepository, chatEventBus: IChatEventBus);
    execute(dto: DeleteChatMessageDto): Promise<Result<DeleteChatMessageResponseDto>>;
}
//# sourceMappingURL=DeleteChatMessageUseCase.d.ts.map