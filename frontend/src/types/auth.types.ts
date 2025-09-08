export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: "Active" | "Inactive" | "Suspended";
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export type UserRole = "Rider" | "Driver" | "Admin";

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface SignupCredentials {
  readonly name: string;
  readonly email: string;
  readonly mobile: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly role: UserRole;
}

export interface AuthState {
  readonly user: User | null;
  readonly token: string | null;
  readonly refreshToken: string | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly role: UserRole | null;
  readonly requiresOTPVerification: boolean;
  readonly pendingVerificationEmail: string | null;
  readonly passwordResetEmailSent: boolean;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface SignupResponse {
  readonly success: boolean;
  readonly message: string;
  readonly user?: User;
  readonly requiresVerification?: boolean;
}

export interface RefreshTokenResponse {
  readonly success: boolean;
  readonly data: {
    accessToken: string;
  };
}

export interface VerifyOTPCredentials {
  readonly email: string;
  readonly otp: string;
}

export interface ResetPasswordCredentials {
  readonly email: string;
}

export interface ResetPasswordConfirmCredentials {
  readonly token: string;
  readonly otp: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

export interface ApiError {
  readonly message: string;
  readonly statusCode?: number;
  readonly field?: string;
  readonly code?: string;
}
