"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainMapper = void 0;
const User_1 = require("../../../domain/entities/User");
const Password_1 = require("../../../domain/value-objects/Password");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
class UserDomainMapper {
    static toDomain(userDoc) {
        const passwordHash = userDoc.password;
        let passwordVo;
        if (!passwordHash || passwordHash.trim() === "") {
            passwordVo = Password_1.Password.createEmpty();
        }
        else {
            passwordVo = Password_1.Password.createFromHash(passwordHash);
        }
        return User_1.User.reconstruct({
            id: userDoc.id.toString(),
            name: userDoc.name,
            email: userDoc.email,
            password: passwordVo.getHashedValue(),
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
            authProvider: userDoc.authProvider || AuthConstants_1.AuthProvider.EMAIL,
        });
    }
    static toPersistence(user) {
        return {
            name: user.getName(),
            email: user.getEmailValue(),
            password: user.getPasswordHash(),
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
}
exports.UserDomainMapper = UserDomainMapper;
//# sourceMappingURL=UserDomainMapper.js.map