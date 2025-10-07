import { UserModel, IUserDocument } from "../models/UserModel";
import { QueryOptions, FilterOptions } from "@shared/types/Repository";
import { UserStatus, AuthProvider } from "@shared/constants/AuthConstants";
import { Logger } from "@shared/utils/Logger";
import { User } from "@domain/entities";

export class UserQueryService {
  async findById(id: string): Promise<IUserDocument | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      Logger.error("Error finding user by ID", { id, error });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    try {
      return await UserModel.findOne({
        email: email.toLowerCase().trim(),
      });
    } catch (error) {
      Logger.error("Error finding user by email", { email, error });
      throw error;
    }
  }

  async findByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<IUserDocument | null> {
    try {
      return await UserModel.findOne({
        email: email.toLowerCase().trim(),
        authProvider: provider,
      });
    } catch (error) {
      Logger.error("Error finding user by email and provider", {
        email,
        provider,
        error,
      });
      throw error;
    }
  }

  async findByGoogleId(googleId: string): Promise<IUserDocument | null> {
    try {
      return await UserModel.findOne({ googleId });
    } catch (error) {
      Logger.error("Error finding user by Google ID", { googleId, error });
      throw error;
    }
  }

  async findByMobile(mobile: string): Promise<IUserDocument | null> {
    try {
      return await UserModel.findOne({ mobile: mobile.trim() });
    } catch (error) {
      Logger.error("Error finding user by mobile", { mobile, error });
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<IUserDocument[]> {
    try {
      let query = UserModel.find(options?.filters || {});

      if (options?.limit) query = query.limit(options.limit);
      if (options?.offset) query = query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query = query.sort({ [options.sortBy as string]: sortOrder });
      }

      return await query.exec();
    } catch (error) {
      Logger.error("Error finding all users", error);
      throw error;
    }
  }

  async findActiveUsers(options?: QueryOptions): Promise<IUserDocument[]> {
    const activeFilters = {
      ...options?.filters,
      status: UserStatus.ACTIVE,
      isVerified: true,
    };
    return this.findAll({ ...options, filters: activeFilters });
  }

  async findByRole(
    role: string,
    options?: QueryOptions
  ): Promise<IUserDocument[]> {
    const roleFilters = {
      ...options?.filters,
      role,
    };
    return this.findAll({ ...options, filters: roleFilters });
  }

  async count(filters?: FilterOptions<User>): Promise<number> {
    try {
      return await UserModel.countDocuments(filters || {});
    } catch (error) {
      Logger.error("Error counting users", error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({
        email: email.toLowerCase().trim(),
      });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if email exists", { email, error });
      throw error;
    }
  }

  async existsByMobile(mobile: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({
        mobile: mobile.trim(),
      });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if mobile exists", { mobile, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if user exists", { id, error });
      throw error;
    }
  }

  async existsByFilter(filters: FilterOptions<User>): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments(filters);
      return count > 0;
    } catch (error) {
      Logger.error("Error checking existence by filter", { filters, error });
      throw error;
    }
  }
}
