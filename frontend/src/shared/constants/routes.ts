export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    BOOK_RIDE: "/user/book-ride",
    TRIPS: "/user/trips",
    PROFILE: "/user/profile",
  },
  DRIVER: {
    DASHBOARD: "/driver/dashboard",
    REQUESTS: "/driver/requests",
    EARNINGS: "/driver/earnings",
    PROFILE: "/driver/profile",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    DRIVERS: "/admin/drivers",
    ANALYTICS: "/admin/analytics",
    SETTINGS: "/admin/settings",
  },
} as const;
