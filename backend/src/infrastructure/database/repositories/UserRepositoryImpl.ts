import { injectable } from "inversify";
import { UserRepository } from "@domain/repositories/UserRepository";
import { User } from "@domain/entities/User";
import { UserModel, IUserDocument } from "../models/UserModel";
import {
  AuthProvider,
  UserRole,
  UserStatus,
} from "@shared/constants/AuthConstants";
import { Logger } from "@shared/utils/Logger";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findById(id);
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      Logger.error("Error finding user by ID", { id, error });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({
        email: email.toLowerCase().trim(),
      });
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      Logger.error("Error finding user by email", { email, error });
      throw error;
    }
  }

  async findByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({
        email: email.toLowerCase().trim(),
        authProvider: provider,
      });
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      Logger.error("Error finding user by email and provider", {
        email,
        provider,
        error,
      });
      throw error;
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ googleId });
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      Logger.error("Error finding user by Google ID", { googleId, error });
      throw error;
    }
  }

  async findByMobile(mobile: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ mobile: mobile.trim() });
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      Logger.error("Error finding user by mobile", { mobile, error });
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    try {
      const userData = this.toPersistence(user);
      await UserModel.findOneAndUpdate(
        { email: user.getEmailValue() },
        userData,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      Logger.info("User saved successfully", { email: user.getEmailValue() });
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

  async exists(id: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if user exists", { id, error });
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

  async findAll(options?: QueryOptions): Promise<User[]> {
    try {
      let query = UserModel.find(options?.filters || {});

      if (options?.limit) query = query.limit(options.limit);
      if (options?.offset) query = query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query = query.sort({ [options.sortBy]: sortOrder });
      }

      const userDocs = await query.exec();
      return userDocs.map((doc) => this.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding all users", error);
      throw error;
    }
  }

  async findPaginated(options: QueryOptions): Promise<PaginatedResult<User>> {
    try {
      const limit = options.limit || 10;
      const offset = options.offset || 0;
      const page = Math.floor(offset / limit) + 1;

      const [users, total] = await Promise.all([
        this.findAll(options),
        this.count(options.filters),
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

  async count(filters?: Record<string, any>): Promise<number> {
    try {
      return await UserModel.countDocuments(filters || {});
    } catch (error) {
      Logger.error("Error counting users", error);
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

  async deleteMany(filters: Record<string, any>): Promise<void> {
    try {
      await UserModel.deleteMany(filters);
      Logger.info("Users deleted successfully", { filters });
    } catch (error) {
      Logger.error("Error deleting users", { filters, error });
      throw error;
    }
  }

  async findActiveUsers(options?: QueryOptions): Promise<User[]> {
    const activeFilters = {
      ...options?.filters,
      status: UserStatus.ACTIVE,
      isVerified: true,
    };

    return this.findAll({ ...options, filters: activeFilters });
  }

  async findByRole(role: string, options?: QueryOptions): Promise<User[]> {
    const roleFilters = {
      ...options?.filters,
      role,
    };

    return this.findAll({ ...options, filters: roleFilters });
  }

  private toDomain(userDoc: IUserDocument): User {
    return User.reconstruct({
      id: userDoc.id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      mobile: userDoc.mobile,
      dob: userDoc.dob,
      gender: userDoc.gender,
      address: userDoc.address,
      role: userDoc.role as UserRole,
      status: userDoc.status as UserStatus,
      isVerified: userDoc.isVerified,
      otpHash: userDoc.otpHash,
      otpExpires: userDoc.otpExpires,
      otpAttempts: userDoc.otpAttempts,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      googleId: userDoc.googleId,
      profilePicture: userDoc.profilePicture,
      authProvider:
        (userDoc.authProvider as AuthProvider) || AuthProvider.EMAIL,
    });
  }

  private toPersistence(user: User): Partial<IUserDocument> {
    return {
      name: user.getName(),
      email: user.getEmailValue(),
      password: user.getPasswordHash(),
      mobile: user.getMobile(),
      role: user.getRole(),
      status: user.getStatus(),
      isVerified: user.getIsVerified(),
      updatedAt: user.getUpdatedAt(),
      googleId: user.getGoogleId(),
      profilePicture: user.getProfilePicture(),
      authProvider: user.getAuthProvider(),
    };
  }
}
