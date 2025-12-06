import { User } from "@domain/entities/User";
import { IReadOnlyRepository } from "./interfaces/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./interfaces/IWriteOnlyRepository";

export interface IUserProfileRepository
  extends IReadOnlyRepository<User, string>,
    IWriteOnlyRepository<User, string> {
  findByIdForProfile(userId: string): Promise<User | null>;
  updateProfile(
    userId: string,
    updates: Partial<{
      name: string;
      mobile: string;
      dob: Date;
      gender: string;
      address: string;
    }>
  ): Promise<User | null>;
  updateProfilePicture(userId: string, imageUrl: string): Promise<User | null>;
}
