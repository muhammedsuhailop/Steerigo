import { User } from "@domain/entities/User";
import { IUserDocument } from "../models/UserModel";
import { Password } from "@domain/value-objects/Password";
import {
  UserRole,
  UserStatus,
  AuthProvider,
} from "@shared/constants/AuthConstants";

export class UserDomainMapper {
  static toDomain(userDoc: IUserDocument): User {
    const passwordHash = userDoc.password;
    let passwordVo: Password;

    if (!passwordHash || passwordHash.trim() === "") {
      passwordVo = Password.createEmpty();
    } else {
      passwordVo = Password.createFromHash(passwordHash);
    }

    return User.reconstruct({
      id: userDoc.id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: passwordVo.getHashedValue(),
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

  static toPersistence(user: User): Partial<IUserDocument> {
    return {
      name: user.getName(),
      email: user.getEmailValue(),
      password: user.getPasswordHash(),
      mobile: user.getMobile(),
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
}
