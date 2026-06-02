import { ICrudRepository } from "./ICrudRepository";
import { UserChat } from "../entities/UserChat";
import { PaginatedResult } from "../../shared/types/Repository";
export interface IUserChatPaginationOptions {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
}
export interface IUserChatRepository extends ICrudRepository<UserChat, string> {
    findByUserId(userId: string): Promise<UserChat[]>;
    findByUserIdAndChatRoomId(userId: string, chatRoomId: string): Promise<UserChat | null>;
    findPaginatedByUserId(userId: string, options: IUserChatPaginationOptions): Promise<PaginatedResult<UserChat>>;
    markChatAsRead(userId: string, chatRoomId: string, lastReadMessageId: string, readAt: Date): Promise<UserChat | null>;
    getTotalUnreadCountByUserId(userId: string): Promise<number>;
}
//# sourceMappingURL=IUserChatRepository.d.ts.map