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
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  TOKEN_REFRESH_SUCCESS: "Tokens refreshed successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_NOT_VERIFIED: "Account not verified. Please verify your email first",
  ACCOUNT_SUSPENDED:
    "Account has been suspended. Contact support for assistance",
  ACCOUNT_BLOCKED: "Account has been blocked. Contact support for assistance",
  ACCOUNT_DEACTIVATED: "Account has been deactivated",
  TOKEN_EXPIRED: "Session expired. Please log in again",
  TOKEN_INVALID: "Invalid or expired token",
  ACCESS_TOKEN_REQUIRED: "Access token required",
  REFRESH_TOKEN_REQUIRED: "Refresh token required",
  AUTHENTICATION_FAILED: "Authentication failed",
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

export const TokenConfig = {
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
  JWT_ISSUER: "Steerigo",
  JWT_AUDIENCE: "Steerigo-Users",
} as const;
