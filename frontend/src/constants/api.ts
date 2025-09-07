export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: 'api/auth/signup',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    RESET_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD_CONFIRM: '/auth/reset-password',
  },
} as const;

export const API_TIMEOUT = 10000;
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000;
