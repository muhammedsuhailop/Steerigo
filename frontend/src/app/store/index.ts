import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import authReducer from "../../features/auth/store/authSlice";
import adminUsersReducer from "../../features/admin/store/adminUsersSlice";
import errorReducer from "../../shared/components/ui/ErrorHandling/errorSlice";
import driverReducer from "../../features/driver/shared/store/driverSlice";

export const store = configureStore({
  reducer: {
    // Auth with RTK Query
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // Feature reducers
    adminUsers: adminUsersReducer,
    driver: driverReducer,

    // Global error handling
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["error/addError"],
        ignoredPaths: ["error.errors.timestamp", "error.globalError.timestamp"],
      },
    }).concat(authApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
