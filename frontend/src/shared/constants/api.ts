export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VERIFY_OTP: "/api/auth/signup/verify",
    RESEND_OTP: "/api/auth/resend-otp",
    RESET_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD_CONFIRM: "/api/auth/reset-password",
    ME: "/api/auth/me",
  },
  USER: {
    PROFILE: "/api/user/profile",
    BOOKINGS: "/api/user/bookings",
    BOOK_RIDE: "/api/user/book-ride",
  },
  DRIVER: {
    REGISTER: "/api/driver/register",
    PROFILE: "/api/driver/profile",
    RIDES: "/api/driver/rides",
    STATUS: "/api/driver/status",
    EARNINGS: "/api/driver/earnings",
  },
  ADMIN: {
    USERS: "/api/admin/users",
    DRIVERS: "/api/admin/drivers",
    ANALYTICS: "/api/admin/analytics",
  },
} as const;

export const EXTERNAL_API = {
  POSTAL: "https://api.postalpincode.in/pincode",
} as const;
