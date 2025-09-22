import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import adminUsersReducer from '../../features/admin/store/adminUsersSlice';
import errorReducer from '../../shared/components/ui/ErrorHandling/errorSlice';
// Add other feature reducers here

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUsersReducer,
    error: errorReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['error/addError'],
        ignoredPaths: ['error.errors.timestamp', 'error.globalError.timestamp'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;