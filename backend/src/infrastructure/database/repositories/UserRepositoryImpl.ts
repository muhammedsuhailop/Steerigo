import { injectable } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { User } from "@domain/entities/User";
import { UserModel, IUserDocument } from "../models/UserModel";
import { AuthProvider } from "@shared/constants/AuthConstants";
import { Logger } from "@shared/utils/Logger";
import {
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";
import { UserDomainMapper } from "../mappers/UserDomainMapper";
import { UserQueryService } from "../services/UserQueryService";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  private queryService = new UserQueryService();

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.queryService.findById(id);
    return userDoc ? UserDomainMapper.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.queryService.findByEmail(email);
    return userDoc ? UserDomainMapper.toDomain(userDoc) : null;
  }

  async findByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<User | null> {
    const userDoc = await this.queryService.findByEmailAndProvider(
      email,
      provider
    );
    return userDoc ? UserDomainMapper.toDomain(userDoc) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const userDoc = await this.queryService.findByGoogleId(googleId);
    return userDoc ? UserDomainMapper.toDomain(userDoc) : null;
  }

  async findByMobile(mobile: string): Promise<User | null> {
    const userDoc = await this.queryService.findByMobile(mobile);
    return userDoc ? UserDomainMapper.toDomain(userDoc) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.queryService.existsByEmail(email);
  }

  async existsByMobile(mobile: string): Promise<boolean> {
    return this.queryService.existsByMobile(mobile);
  }

  async findActiveUsers(options?: QueryOptions): Promise<User[]> {
    const userDocs = await this.queryService.findActiveUsers(options);
    return userDocs.map((doc) => UserDomainMapper.toDomain(doc));
  }

  async findByRole(role: string, options?: QueryOptions): Promise<User[]> {
    const userDocs = await this.queryService.findByRole(role, options);
    return userDocs.map((doc) => UserDomainMapper.toDomain(doc));
  }

  // Core persistence operations
  async save(user: User): Promise<User> {
    try {
      const userData = UserDomainMapper.toPersistence(user);

      let savedDoc;
      const existingDoc = await UserModel.findOne({
        email: user.getEmailValue(),
      });

      if (existingDoc) {
        savedDoc = await UserModel.findOneAndUpdate(
          { email: user.getEmailValue() },
          userData,
          { new: true }
        );
      } else {
        savedDoc = await UserModel.create(userData);
      }

      if (!savedDoc) {
        throw new Error("Failed to save user document");
      }

      Logger.info("User saved successfully", { email: user.getEmailValue() });

      return UserDomainMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving user", { email: user.getEmailValue(), error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndDelete(id);
      Logger.info("User deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting user", { id, error });
      throw error;
    }
  }

  async updateById(id: string, updates: Partial<User>): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, updates);
      Logger.info("User updated successfully", { id });
    } catch (error) {
      Logger.error("Error updating user", { id, error });
      throw error;
    }
  }

  // Delegated query operations
  async exists(id: string): Promise<boolean> {
    return this.queryService.exists(id);
  }

  async existsByFilter(filters: FilterOptions<User>): Promise<boolean> {
    return this.queryService.existsByFilter(filters);
  }

  async findAll(options?: QueryOptions): Promise<User[]> {
    const userDocs = await this.queryService.findAll(options);
    return userDocs.map((doc) => UserDomainMapper.toDomain(doc));
  }

  async findPaginated(options: QueryOptions): Promise<PaginatedResult<User>> {
    try {
      const limit = options.limit || 10;
      const offset = options.offset || 0;
      const page = Math.floor(offset / limit) + 1;

      const [users, total] = await Promise.all([
        this.findAll(options),
        this.queryService.count(options.filters),
      ]);

      return {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      Logger.error("Error finding paginated users", error);
      throw error;
    }
  }

  async count(filters?: FilterOptions<User>): Promise<number> {
    return this.queryService.count(filters);
  }

  async updateMany(
    filters: FilterOptions<User>,
    updates: Partial<User>
  ): Promise<number> {
    try {
      const result = await UserModel.updateMany(filters, updates);
      Logger.info("Users updated successfully", { filters, updates });
      return result.modifiedCount ?? 0;
    } catch (error) {
      Logger.error("Error updating multiple users", {
        filters,
        updates,
        error,
      });
      throw error;
    }
  }

  async deleteMany(filters: FilterOptions<User>): Promise<number> {
    try {
      const result = await UserModel.deleteMany(filters);
      Logger.info("Users deleted successfully", { filters });
      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting users", { filters, error });
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<User[]> {
    try {
      const userDocs = await UserModel.find({ _id: { $in: ids } });
      return userDocs.map((doc) => UserDomainMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding users by IDs", { ids, error });
      throw error;
    }
  }
}
