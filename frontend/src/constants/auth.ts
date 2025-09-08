export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: false,
} as const;

export const OTP_CONFIG = {
  LENGTH: 4,
  RESEND_COOLDOWN: 60, // seconds
  EXPIRY_TIME: 300, // 5 minutes
} as const;

export const ROLE_ROUTES = {
  Rider: '/user/home',
  Driver: '/driver/dashboard',
  Admin: '/admin/dashboard',
} as const;
