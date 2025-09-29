import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../../features/auth/services/authApi";
import authReducer from "../../features/auth/store/authSlice";
import adminUsersReducer from "../../features/admin/store/adminUsersSlice";
import driverRegistrationReducer from "../../features/driver/driver-registration/store/driverRegistrationSlice";
import { driverRegistrationApi } from "../../features/driver/driver-registration/services/driverRegistrationApi";


export const rootReducer = combineReducers({
  // Auth
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  adminUsers: adminUsersReducer,

  driverRegistration: driverRegistrationReducer,
  [driverRegistrationApi.reducerPath]: driverRegistrationApi.reducer,

  // user: userReducer,
  // driver: driverReducer,
  // admin: adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
