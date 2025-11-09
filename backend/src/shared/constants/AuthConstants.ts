export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
}

export enum UserRole {
  RIDER = "Rider",
  DRIVER = "Driver",
  ADMIN = "Admin",
}

export enum UserStatus {
  PENDING_VERIFICATION = "Pending Verification",
  ACTIVE = "Active",
  SUSPENDED = "Suspended",
  BLOCKED = "Blocked",
  DEACTIVATED = "Deactivated",
}

export const AuthMessages = {
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  TOKEN_REFRESH_SUCCESS: "Tokens refreshed successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_NOT_VERIFIED: "Account not verified. Please verify your email first",
  ACCOUNT_SUSPENDED:
    "Account has been suspended. Contact support for assistance",
  ACCOUNT_BLOCKED: "Account has been blocked. Contact support for assistance",
  ACCOUNT_DEACTIVATED: "Account has been deactivated",
  ACCOUNT_DEFAULT: "Your account is not active. Please contact support",
  TOKEN_EXPIRED: "Session expired. Please log in again",
  TOKEN_INVALID: "Invalid or expired token",
  ACCESS_TOKEN_REQUIRED: "Access token required",
  REFRESH_TOKEN_REQUIRED: "Refresh token required",
  AUTHENTICATION_FAILED: "Authentication failed",
  SIGNUP_SUCCESS:
    "Signup initiated. An OTP has been sent to your email for verification.",
  SIGNUP_VERIFICATION_SUCCESS:
    "Email verified successfully. Welcome to Steerigo!",
  OTP_SENT_SUCCESS: "Verification code sent to your email",
  OTP_RESEND_SUCCESS: "New verification code sent to your email",
  PASSWORD_RESET_REQUEST_SUCCESS: "Password reset code sent to your email",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully",
  GOOGLE_AUTH_SUCCESS: "Google authentication successful",
  USER_PROFILE_SUCCESS: "User profile fetched  successfully",
  TOKENS_REFRESHED: "Tokens refreshed successfully",
  USER_RETRIEVED: "User fetched successfully",
} as const;

export const AuthValidationMessages = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please provide a valid email address",
  EMAIL_TOO_LONG: "Email must be less than 255 characters",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",
  PASSWORD_TOO_LONG: "Password must be less than 128 characters",
  PASSWORD_WEAK:
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  REFRESH_TOKEN_INVALID: "Invalid refresh token format",
  NAME_REQUIRED: "Name is required",
  NAME_TOO_SHORT: "Name must be at least 2 characters long",
  NAME_TOO_LONG: "Name must be less than 100 characters",
  NAME_INVALID: "Name can only contain letters and spaces",
} as const;

export const AuthErrorMessages = {
  SIGNUP_FAILED: "Failed to create account",
  OTP_SEND_FAILED: "Failed to send verification code",
  OTP_VERIFICATION_FAILED: "OTP verification failed",
  PASSWORD_RESET_FAILED: "Failed to reset password",
  GOOGLE_AUTH_FAILED: "Google authentication failed",
  USER_NOT_FOUND: "User not found",
  OTP_NOT_FOUND: "No OTP found. Please request a new one",
  OTP_INVALID: "Invalid verification code",
  EMAIL_NOT_VERIFIED: "Please verify your email first",
} as const;

export const TokenConfig = {
  ACCESS_TOKEN_EXPIRES_IN: "10min",
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
  JWT_ISSUER: "Steerigo",
  JWT_AUDIENCE: "Steerigo-Users",
} as const;
