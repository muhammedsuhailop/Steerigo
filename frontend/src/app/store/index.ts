import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/services/authApi";
import { driverRegistrationApi } from "@/features/driver/driver-registration/services/driverRegistrationApi";
import { driverApi } from "@/features/driver/shared/services/driverApi";
import { userProfileApi } from "@/features/user/profile/services/userProfileApi";
import authReducer from "@/features/auth/store/authSlice";
import adminUsersReducer from "@/features/admin/shared/store/adminUsersSlice";
import errorReducer from "@/shared/components/ui/ErrorHandling/errorSlice";
import driverReducer from "@/features/driver/shared/store/driverSlice";
import driverRegistrationReducer from "@/features/driver/driver-registration/store/driverRegistrationSlice";
import adminDriverReducer from "@/features/admin/shared/store/adminDriverSlice";
import adminKYCReducer from "@/features/admin/shared/store/adminKYCSlice";
import { userProfileReducer } from "@/features/user/profile";
import { adminApi } from "@/features/admin/shared/services/adminApi";
import { schedulingApi } from "@/features/driver/scheduling/services/schedulingApi";
import { driverProfileApi } from "@/features/driver/profile/services/driverProfileApi";
import { driverSearchApi } from "@/features/user/driver-search/services/driverSearchApi";
import driverSearchReducer from "@/features/user/driver-search/store/driverSearchSlice";
import { rideRequestsApi } from "@/features/driver/ride-requests/services/rideRequestsApi";
import { viewRideApi } from "@/features/user/view-ride/services/viewRideApi";
import viewRideReducer from "@/features/user/view-ride/store/viewRideSlice";
import { notificationApi } from "@/features/notifications/services/notificationApi";

export const store = configureStore({
  reducer: {
    // Auth with RTK Query
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    [adminApi.reducerPath]: adminApi.reducer,

    //notification API
    [notificationApi.reducerPath]: notificationApi.reducer,

    // Driver APIs with RTK Query
    [driverRegistrationApi.reducerPath]: driverRegistrationApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
    [schedulingApi.reducerPath]: schedulingApi.reducer,
    [rideRequestsApi.reducerPath]: rideRequestsApi.reducer,

    // User API with RTK Query
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [driverProfileApi.reducerPath]: driverProfileApi.reducer,
    [driverSearchApi.reducerPath]: driverSearchApi.reducer,
    [viewRideApi.reducerPath]: viewRideApi.reducer,

    // Feature reducers (local state only)
    adminUsers: adminUsersReducer,
    driver: driverReducer,
    driverRegistration: driverRegistrationReducer,
    adminDrivers: adminDriverReducer,
    adminKYC: adminKYCReducer,
    userProfile: userProfileReducer,
    driverSearch: driverSearchReducer,
    viewRide: viewRideReducer,

    // Global error handling
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["error/addError"],
        ignoredPaths: ["error.errors.timestamp", "error.globalError.timestamp"],
      },
    }).concat(
      authApi.middleware,
      notificationApi.middleware,
      driverRegistrationApi.middleware,
      driverApi.middleware,
      userProfileApi.middleware,
      adminApi.middleware,
      schedulingApi.middleware,
      driverProfileApi.middleware,
      driverSearchApi.middleware,
      rideRequestsApi.middleware,
      viewRideApi.middleware,
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
