export interface SignupVerifyResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        mobile: string;
        profilePicture?: string;
        isVerified: boolean;
    };
    expiresIn: number;
    isNewUser?: boolean;
}
//# sourceMappingURL=SignupVerifyResponseDto.d.ts.map