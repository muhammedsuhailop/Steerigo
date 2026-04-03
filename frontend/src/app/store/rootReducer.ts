import { combineReducers, AnyAction } from "@reduxjs/toolkit";
import { logout as logoutAction } from "@/features/auth/store/authSlice";

import { authApi } from "@/features/auth/services/authApi";
import { adminApi } from "@/features/admin/shared/services/adminApi";
import { adminPayoutApi } from "@/features/admin/payouts/services/adminPayoutApi";
import { notificationApi } from "@/features/notifications/services/notificationApi";
import { driverRegistrationApi } from "@/features/driver/driver-registration/services/driverRegistrationApi";
import { driverApi } from "@/features/driver/shared/services/driverApi";
import { schedulingApi } from "@/features/driver/scheduling/services/schedulingApi";
import { rideRequestsApi } from "@/features/driver/ride-requests/services/rideRequestsApi";
import { viewDriverRideApi } from "@/features/driver/view-ride/services/viewDriverRideApi";
import { driverWalletApi } from "@/features/driver/wallet/services/driverWalletApi";
import { driverPayoutApi } from "@/features/driver/payout/services/driverPayoutApi";
import { driverRidesApi } from "@/features/driver/driver-rides/services/driverRidesApi";
import { userProfileApi } from "@/features/user/profile/services/userProfileApi";
import { driverProfileApi } from "@/features/driver/profile/services/driverProfileApi";
import { driverSearchApi } from "@/features/user/driver-search/services/driverSearchApi";
import { viewRideApi } from "@/features/user/view-ride/services/viewRideApi";
import { userRidesApi } from "@/features/user/rides/services/userRidesApi";

import authReducer from "@/features/auth/store/authSlice";
import adminUsersReducer from "@/features/admin/shared/store/adminUsersSlice";
import adminDriverReducer from "@/features/admin/shared/store/adminDriverSlice";
import adminKYCReducer from "@/features/admin/shared/store/adminKYCSlice";
import driverReducer from "@/features/driver/shared/store/driverSlice";
import driverRegistrationReducer from "@/features/driver/driver-registration/store/driverRegistrationSlice";
import { userProfileReducer } from "@/features/user/profile";
import driverSearchReducer from "@/features/user/driver-search/store/driverSearchSlice";
import viewRideReducer from "@/features/user/view-ride/store/viewRideSlice";
import viewDriverRideReducer from "@/features/driver/view-ride/store/viewDriverRideSlice";
import errorReducer from "@/shared/components/ui/ErrorHandling/errorSlice";
import { adminTransactionApi } from "@/features/admin/transactions/services/adminTransactionApi";
import { adminRideApi } from "@/features/admin/rides/services/adminRideApi";
import { adminCouponApi } from "@/features/admin/coupons/services/adminCouponApi";

const appReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,

  adminUsers: adminUsersReducer,
  adminDrivers: adminDriverReducer,
  adminKYC: adminKYCReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [adminPayoutApi.reducerPath]: adminPayoutApi.reducer,
  [adminTransactionApi.reducerPath]: adminTransactionApi.reducer,
  [adminRideApi.reducerPath]: adminRideApi.reducer,
  [adminCouponApi.reducerPath]: adminCouponApi.reducer,

  driver: driverReducer,
  driverRegistration: driverRegistrationReducer,
  viewDriverRide: viewDriverRideReducer,
  [driverRegistrationApi.reducerPath]: driverRegistrationApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
  [schedulingApi.reducerPath]: schedulingApi.reducer,
  [rideRequestsApi.reducerPath]: rideRequestsApi.reducer,
  [viewDriverRideApi.reducerPath]: viewDriverRideApi.reducer,
  [driverWalletApi.reducerPath]: driverWalletApi.reducer,
  [driverPayoutApi.reducerPath]: driverPayoutApi.reducer,
  [driverRidesApi.reducerPath]: driverRidesApi.reducer,
  [driverProfileApi.reducerPath]: driverProfileApi.reducer,

  userProfile: userProfileReducer,
  driverSearch: driverSearchReducer,
  viewRide: viewRideReducer,
  [userProfileApi.reducerPath]: userProfileApi.reducer,
  [driverSearchApi.reducerPath]: driverSearchApi.reducer,
  [viewRideApi.reducerPath]: viewRideApi.reducer,
  [userRidesApi.reducerPath]: userRidesApi.reducer,

  error: errorReducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
});

export const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === logoutAction.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const apiMiddlewares = [
  authApi.middleware,
  adminApi.middleware,
  adminPayoutApi.middleware,
  notificationApi.middleware,
  driverRegistrationApi.middleware,
  driverApi.middleware,
  userProfileApi.middleware,
  schedulingApi.middleware,
  driverProfileApi.middleware,
  driverSearchApi.middleware,
  rideRequestsApi.middleware,
  viewRideApi.middleware,
  viewDriverRideApi.middleware,
  driverWalletApi.middleware,
  driverPayoutApi.middleware,
  driverRidesApi.middleware,
  userRidesApi.middleware,
  adminTransactionApi.middleware,
  adminRideApi.middleware,
  adminCouponApi.middleware,
];
