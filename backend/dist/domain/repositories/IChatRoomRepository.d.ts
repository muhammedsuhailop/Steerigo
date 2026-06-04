import { ChatRoom } from "@domain/entities/ChatRoom";
import { ICrudRepository } from "./ICrudRepository";
import { ChatRoomType } from "@domain/value-objects/ChatRoomType";
import { PaginatedResult } from "@shared/types/Repository";
export interface IChatRoomPaginationOptions {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    type?: ChatRoomType;
}
export interface IChatRoomRepository extends ICrudRepository<ChatRoom, string> {
    findByRideId(rideId: string): Promise<ChatRoom | null>;
    findByUserId(userId: string): Promise<ChatRoom[]>;
    findPaginatedByUserId(userId: string, options: IChatRoomPaginationOptions): Promise<PaginatedResult<ChatRoom>>;
}
//# sourceMappingURL=IChatRoomRepository.d.ts.map