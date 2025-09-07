export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    RESET_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD_CONFIRM: '/api/auth/reset-password',
  },
} as const;

export const API_TIMEOUT = 10000;
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000;
