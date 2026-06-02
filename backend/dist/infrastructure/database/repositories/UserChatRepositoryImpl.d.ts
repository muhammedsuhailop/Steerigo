import { IUserChatRepository, IUserChatPaginationOptions } from "@domain/repositories/IUserChatRepository";
import { UserChat } from "@domain/entities/UserChat";
import { PaginatedResult } from "@shared/types/Repository";
export declare class UserChatRepositoryImpl implements IUserChatRepository {
    findById(id: string): Promise<UserChat | null>;
    exists(id: string): Promise<boolean>;
    save(entity: UserChat): Promise<UserChat>;
    delete(id: string): Promise<void>;
    findByUserId(userId: string): Promise<UserChat[]>;
    findByUserIdAndChatRoomId(userId: string, chatRoomId: string): Promise<UserChat | null>;
    findPaginatedByUserId(userId: string, options: IUserChatPaginationOptions): Promise<PaginatedResult<UserChat>>;
    getTotalUnreadCountByUserId(userId: string): Promise<number>;
    markChatAsRead(userId: string, chatRoomId: string, lastReadMessageId: string, readAt: Date): Promise<UserChat | null>;
}
//# sourceMappingURL=UserChatRepositoryImpl.d.ts.map