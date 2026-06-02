import { IChatRoomPaginationOptions, IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { ChatRoom } from "@domain/entities/ChatRoom";
import { PaginatedResult } from "@shared/types/Repository";
export declare class ChatRoomRepositoryImpl implements IChatRoomRepository {
    findById(id: string): Promise<ChatRoom | null>;
    exists(id: string): Promise<boolean>;
    save(entity: ChatRoom): Promise<ChatRoom>;
    delete(id: string): Promise<void>;
    findByRideId(rideId: string): Promise<ChatRoom | null>;
    findByUserId(userId: string): Promise<ChatRoom[]>;
    findPaginatedByUserId(userId: string, options: IChatRoomPaginationOptions): Promise<PaginatedResult<ChatRoom>>;
}
//# sourceMappingURL=ChatRoomRepositoryImpl.d.ts.map