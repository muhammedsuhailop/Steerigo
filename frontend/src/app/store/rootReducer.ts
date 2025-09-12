import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import authReducer from "../../features/auth/store/authSlice";

export const rootReducer = combineReducers({
  // Auth
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,

  // user: userReducer,
  // driver: driverReducer,
  // admin: adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
