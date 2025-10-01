import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import { driverRegistrationApi } from "../../features/driver/driver-registration/services/driverRegistrationApi";
import authReducer from "../../features/auth/store/authSlice";
import adminUsersReducer from "../../features/admin/shared/store/adminUsersSlice";
import errorReducer from "../../shared/components/ui/ErrorHandling/errorSlice";
import driverReducer from "../../features/driver/shared/store/driverSlice";
import driverRegistrationReducer from "../../features/driver/driver-registration/store/driverRegistrationSlice";

export const store = configureStore({
  reducer: {
    // Auth with RTK Query
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [driverRegistrationApi.reducerPath]: driverRegistrationApi.reducer,
    
    // Feature reducers
    adminUsers: adminUsersReducer,
    driver: driverReducer,
    driverRegistration: driverRegistrationReducer,
    
    // Global error handling
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["error/addError"],
        ignoredPaths: ["error.errors.timestamp", "error.globalError.timestamp"],
      },
    }).concat(authApi.middleware, driverRegistrationApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;