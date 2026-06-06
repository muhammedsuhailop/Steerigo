import { UserRole, UserStatus } from "../../../shared/constants/AuthConstants";
export interface UserProfileDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    mobile?: string;
    profilePicture?: string;
    isVerified: boolean;
}
export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserProfileDto;
    expiresIn: number;
}
export interface TokenRefreshResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
//# sourceMappingURL=LoginResponseDto.d.ts.map