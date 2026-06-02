export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    mobile?: string;
    dob?: string;
    gender?: "Male" | "Female" | "Other";
    address?: string;
    role: string;
    status: string;
    isVerified: boolean;
    profilePicture?: string;
    authProvider: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=UserResponseDto.d.ts.map