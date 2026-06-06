import { UserChat } from "../../../domain/entities/UserChat";
import { IUserChatDocument } from "../models/UserChatMode";
export declare class UserChatMapper {
    static toDomain(doc: IUserChatDocument): UserChat;
    static toPersistence(entity: UserChat): Partial<IUserChatDocument>;
}
//# sourceMappingURL=UserChatMapper.d.ts.map