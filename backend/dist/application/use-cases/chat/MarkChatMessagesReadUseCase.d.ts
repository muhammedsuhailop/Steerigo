import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserChatRepository } from "../../../domain/repositories/IUserChatRepository";
import { IMessageStatusRepository } from "../../../domain/repositories/IMessageStatusRepository";
import { MarkChatMessagesReadDto } from "../../dto/chat/MarkChatMessagesReadDto";
import { MarkChatMessagesReadResponseDto } from "../../dto/chat/response/MarkChatMessagesReadResponseDto";
import { IChatEventBus } from "../../services/IChatEventBus";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
export declare class MarkChatMessagesReadUseCase implements IUseCase<MarkChatMessagesReadDto, Promise<Result<MarkChatMessagesReadResponseDto>>> {
    private readonly chatRoomRepository;
    private readonly messageRepository;
    private readonly userChatRepository;
    private readonly messageStatusRepository;
    private readonly driverRepository;
    private readonly chatEventBus;
    constructor(chatRoomRepository: IChatRoomRepository, messageRepository: IMessageRepository, userChatRepository: IUserChatRepository, messageStatusRepository: IMessageStatusRepository, driverRepository: IDriverRepository, chatEventBus: IChatEventBus);
    execute(dto: MarkChatMessagesReadDto): Promise<Result<MarkChatMessagesReadResponseDto>>;
}
//# sourceMappingURL=MarkChatMessagesReadUseCase.d.ts.map