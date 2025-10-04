import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import {
  IUserProfileRepository,
  UserProfileStats,
} from "@domain/repositories/user/IUserProfileRepository";
import { User } from "@domain/entities/User";
import { UserModel } from "../../models/UserModel";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class MongoUserProfileRepository implements IUserProfileRepository {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async findUserById(userId: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      Logger.error("Error finding user by ID in profile repository", {
        userId,
        error,
      });
      throw error;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<{
      name: string;
      mobile: string;
      dob: Date;
      gender: string;
      address: string;
    }>
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      user.updateProfile({
        name: updates.name,
        mobile: updates.mobile,
        dob: updates.dob,
        gender: updates.gender,
        address: updates.address,
      });

      // Save updated user
      await this.userRepository.save(user);

      Logger.info("User profile updated successfully", { userId });
      return user;
    } catch (error) {
      Logger.error("Error updating user profile", { userId, error });
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<UserProfileStats> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // TODO:
      const stats: UserProfileStats = {
        totalRides: 0,
        completedRides: 0,
        cancelledRides: 0,
        totalSpent: 0,
        memberSince: user.getCreatedAt(),
        favoriteDrivers: [],
        lastRideDate: undefined,
      };

      Logger.info("User stats retrieved successfully", { userId });
      return stats;
    } catch (error) {
      Logger.error("Error getting user stats", { userId, error });
      throw error;
    }
  }

  async uploadProfilePicture(
    userId: string,
    imageUrl: string
  ): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          profilePicture: imageUrl,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedUser) {
        return null;
      }

      // Convert to domain entity
      const user = User.reconstruct({
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        mobile: updatedUser.mobile,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        address: updatedUser.address,
        role: updatedUser.role,
        status: updatedUser.status,
        isVerified: updatedUser.isVerified,
        otpHash: updatedUser.otpHash,
        otpExpires: updatedUser.otpExpires,
        otpAttempts: updatedUser.otpAttempts,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        googleId: updatedUser.googleId,
        profilePicture: updatedUser.profilePicture,
        authProvider: updatedUser.authProvider || "email",
      });

      Logger.info("Profile picture updated successfully", { userId });
      return user;
    } catch (error) {
      Logger.error("Error updating profile picture", { userId, error });
      throw error;
    }
  }

  async deleteUserAccount(userId: string): Promise<void> {
    try {
      await this.userRepository.delete(userId);
      Logger.info("User account deleted successfully", { userId });
    } catch (error) {
      Logger.error("Error deleting user account", { userId, error });
      throw error;
    }
  }
}
