import { User } from "@domain/entities/User";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { WriteOnlyRepository } from "./interfaces/WriteOnlyRepository";

export interface UserProfileRepository
  extends ReadOnlyRepository<User, string>,
    WriteOnlyRepository<User, string> {
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
