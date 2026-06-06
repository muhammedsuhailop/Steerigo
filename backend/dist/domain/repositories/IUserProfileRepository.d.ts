import { User } from "../entities/User";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
export interface IUserProfileRepository extends IReadOnlyRepository<User, string>, IWriteOnlyRepository<User, string> {
    findByIdForProfile(userId: string): Promise<User | null>;
    updateProfile(userId: string, updates: Partial<{
        name: string;
        mobile: string;
        dob: Date;
        gender: string;
        address: string;
    }>): Promise<User | null>;
    updateProfilePicture(userId: string, imageUrl: string): Promise<User | null>;
}
//# sourceMappingURL=IUserProfileRepository.d.ts.map