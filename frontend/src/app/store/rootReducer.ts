import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import authReducer from "../../features/auth/store/authSlice";
import adminUsersReducer from "../../features/admin/shared/store/adminUsersSlice";

export const rootReducer = combineReducers({
  // Auth
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  adminUsers: adminUsersReducer,

  // user: userReducer,
  // driver: driverReducer,
  // admin: adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
