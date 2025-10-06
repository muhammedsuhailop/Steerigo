import { QueryOptions } from "@shared/types/Repository";
import { User } from "../../domain/entities/User";
import { BaseRepository } from "./BaseRepository";
import { AuthProvider } from "@shared/constants/AuthConstants";

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByMobile(mobile: string): Promise<boolean>;
  findByMobile(mobile: string): Promise<User | null>;
  findActiveUsers(options?: QueryOptions<User>): Promise<User[]>;
  findByRole(role: string, options?: QueryOptions<User>): Promise<User[]>;
}
