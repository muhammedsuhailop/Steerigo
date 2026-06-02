import { ChatRoom } from "../../../domain/entities/ChatRoom";
import { IChatRoomDocument } from "../models/ChatRoomModel";
export declare class ChatRoomMapper {
    static toDomain(doc: IChatRoomDocument): ChatRoom;
    static toPersistence(entity: ChatRoom): Partial<IChatRoomDocument>;
}
//# sourceMappingURL=ChatRoomMapper.d.ts.map