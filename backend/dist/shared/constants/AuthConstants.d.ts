export declare enum AuthProvider {
    EMAIL = "email",
    GOOGLE = "google"
}
export declare enum UserRole {
    RIDER = "Rider",
    DRIVER = "Driver",
    ADMIN = "Admin"
}
export declare enum UserStatus {
    PENDING_VERIFICATION = "Pending Verification",
    ACTIVE = "Active",
    SUSPENDED = "Suspended",
    BLOCKED = "Blocked",
    DEACTIVATED = "Deactivated"
}
export declare const AuthMessages: {
    readonly UNAUTHORIZED: "Unauthorized";
    readonly INTERNAL_SERVER_ERROR: "Internal server error";
    readonly LOGIN_SUCCESS: "Login successful";
    readonly LOGOUT_SUCCESS: "Logged out successfully";
    readonly TOKEN_REFRESH_SUCCESS: "Tokens refreshed successfully";
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly ACCOUNT_NOT_VERIFIED: "Account not verified. Please verify your email first";
    readonly ACCOUNT_SUSPENDED: "Account has been suspended. Contact support for assistance";
    readonly ACCOUNT_BLOCKED: "Account has been blocked. Contact support for assistance";
    readonly ACCOUNT_DEACTIVATED: "Account has been deactivated";
    readonly ACCOUNT_DEFAULT: "Your account is not active. Please contact support";
    readonly TOKEN_EXPIRED: "Session expired. Please log in again";
    readonly TOKEN_INVALID: "Invalid or expired token";
    readonly ACCESS_TOKEN_REQUIRED: "Access token required";
    readonly REFRESH_TOKEN_REQUIRED: "Refresh token required";
    readonly AUTHENTICATION_FAILED: "Authentication failed";
    readonly SIGNUP_SUCCESS: "Signup initiated. An OTP has been sent to your email for verification.";
    readonly SIGNUP_VERIFICATION_SUCCESS: "Email verified successfully. Welcome to Steerigo!";
    readonly OTP_SENT_SUCCESS: "Verification code sent to your email";
    readonly OTP_RESEND_SUCCESS: "New verification code sent to your email";
    readonly PASSWORD_RESET_REQUEST_SUCCESS: "Password reset code sent to your email";
    readonly PASSWORD_RESET_SUCCESS: "Password reset successfully";
    readonly PASSWORD_UPDATE_SUCCESS: "Password updated successfully";
    readonly GOOGLE_AUTH_SUCCESS: "Google authentication successful";
    readonly USER_PROFILE_SUCCESS: "User profile fetched  successfully";
    readonly TOKENS_REFRESHED: "Tokens refreshed successfully";
    readonly USER_RETRIEVED: "User fetched successfully";
    readonly EMAIL_ALREADY_EXISIT: "User with this email already exists";
};
export declare const AuthValidationMessages: {
    readonly EMAIL_REQUIRED: "Email is required";
    readonly EMAIL_INVALID: "Please provide a valid email address";
    readonly EMAIL_TOO_LONG: "Email must be less than 255 characters";
    readonly PASSWORD_REQUIRED: "Password is required";
    readonly PASSWORD_TOO_SHORT: "Password must be at least 8 characters long";
    readonly PASSWORD_TOO_LONG: "Password must be less than 128 characters";
    readonly PASSWORD_WEAK: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    readonly REFRESH_TOKEN_REQUIRED: "Refresh token is required";
    readonly REFRESH_TOKEN_INVALID: "Invalid refresh token format";
    readonly NAME_REQUIRED: "Name is required";
    readonly NAME_TOO_SHORT: "Name must be at least 2 characters long";
    readonly NAME_TOO_LONG: "Name must be less than 100 characters";
    readonly NAME_INVALID: "Name can only contain letters and spaces";
};
export declare const AuthErrorMessages: {
    readonly SIGNUP_FAILED: "Failed to create account";
    readonly OTP_SEND_FAILED: "Failed to send verification code";
    readonly OTP_VERIFICATION_FAILED: "OTP verification failed";
    readonly GOOGLE_AUTH_FAILED: "Google authentication failed";
    readonly USER_NOT_FOUND: "User not found";
    readonly OTP_NOT_FOUND: "OTP not found or has expired. Please request a new OTP";
    readonly OTP_INVALID: "Invalid verification code";
    readonly OTP_EXPIRED: "OTP has expired. Please request a new one";
    readonly MAX_OTP_ATTEMPTS: "Maximum OTP attempts exceeded. Please wait...";
    readonly EMAIL_NOT_VERIFIED: "Email address is not verified. Please verify your email to continue";
    readonly REFRESH_TOKEN_EXPIRED: "Refresh token has expired. Please log in again";
    readonly REFRESH_TOKEN_REVOKED: "Refresh token has been revoked. Please log in again";
    readonly PASSWORD_RESET_FAILED: "Password reset failed. Please try again";
    readonly MOBILE_ALREADY_EXISTS: "This mobile number is already registered";
};
export declare const TokenConfig: {
    readonly ACCESS_TOKEN_EXPIRES_IN: "10min";
    readonly REFRESH_TOKEN_EXPIRES_IN_DAYS: 7;
    readonly JWT_ISSUER: "Steerigo";
    readonly JWT_AUDIENCE: "Steerigo-Users";
};
//# sourceMappingURL=AuthConstants.d.ts.map