import { QueryOptions } from "@shared/types/Repository";
import { User } from "../../domain/entities/User";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { WriteOnlyRepository } from "./interfaces/WriteOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";
import { BatchRepository } from "./interfaces/BatchRepository";
import { AuthProvider } from "@shared/constants/AuthConstants";

export interface UserRepository
  extends ReadOnlyRepository<User>,
    WriteOnlyRepository<User>,
    QueryableRepository<User>,
    BatchRepository<User> {
  // User-specific query methods
  findByEmail(email: string): Promise<User | null>;
  findByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByMobile(mobile: string): Promise<boolean>;
  findByMobile(mobile: string): Promise<User | null>;
  findActiveUsers(options?: QueryOptions): Promise<User[]>;
  findByRole(role: string, options?: QueryOptions): Promise<User[]>;
  updateById(id: string, updates: Partial<Record<string, any>>): Promise<void>;
}
