import { User } from "../entities/User";
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  exists(email: string): Promise<boolean>;
  existsByMobile(mobile: string): Promise<boolean>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmailAndProvider(
    email: string,
    provider: "email" | "google"
  ): Promise<User | null>;
}
