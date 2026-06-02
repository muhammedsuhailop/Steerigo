import { ICrudRepository } from "./ICrudRepository";
import { Message } from "../entities/Message";
import { PaginatedResult } from "../../shared/types/Repository";
import { MessageType } from "../value-objects/MessageType";
export interface IMessagePaginationOptions {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    type?: MessageType;
}
export interface IMessageRepository extends ICrudRepository<Message, string> {
    findByChatRoomId(chatRoomId: string): Promise<Message[]>;
    findPaginatedByChatRoomId(chatRoomId: string, options: IMessagePaginationOptions): Promise<PaginatedResult<Message>>;
    softDelete(id: string): Promise<void>;
}
//# sourceMappingURL=IMessageRepository.d.ts.map