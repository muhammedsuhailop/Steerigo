import { User } from "@domain/entities/User";
import { IUserDocument } from "../models/UserModel";
export declare class UserDomainMapper {
    static toDomain(userDoc: IUserDocument): User;
    static toPersistence(user: User): Partial<IUserDocument>;
}
//# sourceMappingURL=UserDomainMapper.d.ts.map