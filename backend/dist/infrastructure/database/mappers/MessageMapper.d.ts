import { Message } from "../../../domain/entities/Message";
import { IMessageDocument } from "../models/MessageModel";
export declare class MessageMapper {
    static toDomain(doc: IMessageDocument): Message;
    static toPersistence(entity: Message): Partial<IMessageDocument>;
}
//# sourceMappingURL=MessageMapper.d.ts.map