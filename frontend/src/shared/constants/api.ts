export const API_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    SIGNUP_RESEND: "/auth/signup/resend",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    LOGOUT: "/auth/logout",
    // REFRESH: "/auth/refresh",
    REFRESH_TOKEN: "/auth/refresh-token",
    VERIFY_OTP: "/auth/signup/verify",
    RESEND_OTP: "/auth/resend-otp",
    RESET_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD_CONFIRM: "/auth/reset-password",
    UPDATE_PASSWORD: "/auth/update-password",
    ME: "/auth/me",
  },
  USER: {
    PROFILE: "/user/profile",
    BOOKINGS: "/user/bookings",
    BOOK_RIDE: "/user/book-ride",
    PROFILE_PIC_UPLOAD: "/file/profile-picture",
    SEARCH_NEARBY: "/user/search/nearby",
    SEND_RIDE_REQUEST: "/user/ride/request-send",
    REGISTER_AS_DRIVER: "/user/register-as-driver",
    AUTO_RIDE_REQUEST: "/user/ride/auto-request-send",
    CANCEL_RIDE_REQUEST: "/user/ride/request-cancel",
    RIDE: "/user/ride",
  },
  DRIVER: {
    REGISTER: "/driver/register",
    PROFILE: "/driver/profile",
    KYC: "/driver/kyc",
    RIDES: "/driver/rides",
    STATUS: "/driver/status",
    EARNINGS: "/driver/earnings",
    DASHBOARD: "/driver/dashboard",
    PENDING_REQUESTS: "/driver/ride-requests/pending",
    RIDE_REQUESTS: "/driver/ride-requests",
    CURRENT_RIDE: "/driver/ride/current",
    RIDE: "/driver/ride",
    PROFILE_PIC_UPLOAD: "/file/profile-picture",
    AVAILABILITY: {
      UPDATE_LOCATION: "/driver/availability/update-location",
      SCHEDULE: "/driver/availability/schedule",
      STATUS: "/driver/availability/status",
      EXCEPTION: "/driver/availability/exception",
    },
  },
  ADMIN: {
    USERS: "/admin/users",
    DRIVERS: "/admin/drivers",
    KYC: "/admin/drivers/kyc-requests",
  },
  FILE: {
    UPLOAD: "/file/upload",
  },
} as const;

export const EXTERNAL_API = {
  POSTAL: "https://api.postalpincode.in/pincode",
  CLOUDINARY_BASE:
    "https://res.cloudinary.com/dlv7crxfz/image/upload/v1759336549",
} as const;
