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
    DASHBOARD: "/dashboard",
    BOOK_RIDE: "/book-ride",
    TRIPS: "/trips",
    PROFILE: "/profile",
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
