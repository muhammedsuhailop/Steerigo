import { MessageStatus } from "@domain/entities/MessageStatus";
import { IMessageStatusDocument } from "../models/MessageStatusModel";
export declare class MessageStatusMapper {
    static toDomain(doc: IMessageStatusDocument): MessageStatus;
    static toPersistence(entity: MessageStatus): Partial<IMessageStatusDocument>;
}
//# sourceMappingURL=MessageStatusMapper.d.ts.map