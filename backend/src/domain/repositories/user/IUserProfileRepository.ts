import { User } from "@domain/entities/User";

export interface UserProfileStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpent: number;
  memberSince: Date;
  favoriteDrivers: string[];
  lastRideDate?: Date;
}

export interface IUserProfileRepository {
  findUserById(userId: string): Promise<User | null>;
  updateUserProfile(
    userId: string,
    updates: Partial<{
      name: string;
      mobile: string;
      dob: Date;
      gender: string;
      address: string;
    }>
  ): Promise<User | null>;
  //   getUserStats(userId: string): Promise<UserProfileStats>;
  //   uploadProfilePicture(userId: string, imageUrl: string): Promise<User | null>;
  //   deleteUserAccount(userId: string): Promise<void>;
}
