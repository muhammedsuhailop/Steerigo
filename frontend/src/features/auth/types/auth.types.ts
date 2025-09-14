export interface User {
    id: string;
    email: string;
    name: string;
    role: "Rider" | "Driver" | "Admin";
    mobile?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
    role?: "User" | "Driver";
}

export interface OTPVerificationRequest {
    email: string;
    otp: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}
export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string
}
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface GoogleAuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        refreshToken: string;
    };
}

export interface ValidationErrors {
    [key: string]: string;
}
