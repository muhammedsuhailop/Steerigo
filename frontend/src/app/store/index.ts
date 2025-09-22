import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import authReducer from "../../features/auth/store/authSlice";
import adminUsersReducer from "../../features/admin/store/adminUsersSlice";
import errorReducer from "../../shared/components/ui/ErrorHandling/errorSlice";
import { rtkQueryErrorMiddleware } from "../../shared/middleware/errorMiddleware";

export const store = configureStore({
  reducer: {
    // Auth with RTK Query
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // Feature reducers
    adminUsers: adminUsersReducer,

    // Global error handling
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "error/addError",
          "authApi/executeMutation/rejected",
          "error/hideGlobalError",
        ],
        // Ignore the entire error state to avoid timestamp serialization issues
        ignoredPaths: ["error"],
      },
    })
    .concat(authApi.middleware)
    .concat(rtkQueryErrorMiddleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;