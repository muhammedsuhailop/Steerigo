import { IMessageRepository, IMessagePaginationOptions } from "../../../domain/repositories/IMessageRepository";
import { Message } from "../../../domain/entities/Message";
import { PaginatedResult } from "../../../shared/types/Repository";
export declare class MessageRepositoryImpl implements IMessageRepository {
    findById(id: string): Promise<Message | null>;
    exists(id: string): Promise<boolean>;
    save(entity: Message): Promise<Message>;
    delete(id: string): Promise<void>;
    findByChatRoomId(chatRoomId: string): Promise<Message[]>;
    findPaginatedByChatRoomId(chatRoomId: string, options: IMessagePaginationOptions): Promise<PaginatedResult<Message>>;
    softDelete(id: string): Promise<void>;
}
//# sourceMappingURL=MessageRepositoryImpl.d.ts.map