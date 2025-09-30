import { injectable } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { UserModel, IUserDocument } from "../models/UserModel";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class MongoUserRepository implements IUserRepository {
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

  async save(user: User): Promise<void> {
    try {
      const userData = this.toPersistence(user);
      await UserModel.findOneAndUpdate({ email: user.getEmail() }, userData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      Logger.info("User saved successfully", { email: user.getEmail() });
    } catch (error) {
      Logger.error("Error saving user", { email: user.getEmail(), error });
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

  async exists(email: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({
        email: email.toLowerCase().trim(),
      });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if user exists", { email, error });
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
      role: userDoc.role,
      status: userDoc.status,
      isVerified: userDoc.isVerified,
      otpHash: userDoc.otpHash,
      otpExpires: userDoc.otpExpires,
      otpAttempts: userDoc.otpAttempts,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      googleId: userDoc.googleId,
      profilePicture: userDoc.profilePicture,
      authProvider: userDoc.authProvider || "email",
    });
  }

  private toPersistence(user: User): Partial<IUserDocument> {
    return {
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      mobile: user.getMobile(),
      dob: user.getDob(),
      gender: user.getGender(),
      address: user.getAddress(),
      role: user.getRole(),
      status: user.getStatus(),
      isVerified: user.getIsVerified(),
      otpHash: user.getOtpHash(),
      otpExpires: user.getOtpExpires(),
      otpAttempts: user.getOtpAttempts(),
      updatedAt: user.getUpdatedAt(),
      googleId: user.getGoogleId(),
      profilePicture: user.getProfilePicture(),
      authProvider: user.getAuthProvider(),
    };
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

  async findByEmailAndProvider(
    email: string,
    provider: "email" | "google"
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
}
