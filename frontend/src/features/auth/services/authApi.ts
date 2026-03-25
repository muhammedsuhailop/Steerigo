import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import {
  logout as logoutAction,
  getRefreshTokenFromStorage,
} from "../store/authSlice";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  OTPVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  User,
} from "../types";
import { adminApi } from "@/features/admin/shared/services";
import { driverRegistrationApi } from "@/features/driver/driver-registration";
import { driverProfileApi } from "@/features/driver/profile/services/driverProfileApi";
import { schedulingApi } from "@/features/driver/scheduling/services/schedulingApi";
import { driverApi } from "@/features/driver";
import { userProfileApi } from "@/features/user";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { driverWalletApi } from "@/features/driver/wallet/services/driverWalletApi";
import { driverPayoutApi } from "@/features/driver/payout/services/driverPayoutApi";
import { viewRideApi } from "@/features/user/view-ride/services/viewRideApi";
import { viewDriverRideApi } from "@/features/driver/view-ride/services/viewDriverRideApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        data: credentials,
        skipAuth: true,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation<
      { success: boolean; message: string },
      SignupRequest
    >({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: "POST",
        data: userData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    initiateGoogleAuth: builder.query<
      { success: boolean; data: { authUrl: string }; message: string },
      void
    >({
      query: () => ({
        url: API_ENDPOINTS.AUTH.GOOGLE,
        method: "GET",
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    handleGoogleCallback: builder.mutation<
      AuthResponse,
      { code: string; state?: string }
    >({
      query: (callbackData) => ({
        url: API_ENDPOINTS.AUTH.GOOGLE_CALLBACK,
        method: "POST",
        data: callbackData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifySignupOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: "POST",
        data: otpData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    resendSignupOTP: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP_RESEND,
        method: "POST",
        data: { email },
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    verifyOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: "POST",
        data: otpData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    resendOTP: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.RESEND_OTP,
        method: "POST",
        data: { email },
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordRequest
    >({
      query: (emailData) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: "POST",
        data: emailData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordRequest
    >({
      query: (resetData) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM,
        method: "POST",
        data: resetData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    updatePassword: builder.mutation<
      { success: boolean; message: string },
      UpdatePasswordRequest
    >({
      query: (passwordData) => ({
        url: API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
        method: "PUT",
        data: passwordData,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<
      {
        data: unknown;
        accessToken: string;
        refreshToken: string;
      },
      void
    >({
      query: () => {
        const refreshToken = getRefreshTokenFromStorage();
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }
        return {
          url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          method: "POST",
          data: { refreshToken },
          skipAuth: true,
        };
      },
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(logoutAction());
        }
      },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => {
        const refreshToken = getRefreshTokenFromStorage() || "";
        return {
          url: API_ENDPOINTS.AUTH.LOGOUT,
          method: "POST",
          data: { refreshToken },
        };
      },
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // ignore server errors
        } finally {
          // clear client auth state
          dispatch(logoutAction());
          dispatch(authApi.util.resetApiState());
          dispatch(adminApi.util.resetApiState());
          dispatch(driverRegistrationApi.util.resetApiState());
          dispatch(driverProfileApi.util.resetApiState());
          dispatch(schedulingApi.util.resetApiState());
          dispatch(driverApi.util.resetApiState());
          dispatch(userProfileApi.util.resetApiState());
          dispatch(driverApi.util.resetApiState());
          dispatch(driverWalletApi.util.resetApiState());
          dispatch(driverPayoutApi.util.resetApiState());
          dispatch(viewRideApi.util.resetApiState());
          dispatch(viewDriverRideApi.util.resetApiState());

          clearAuthStorage();
        }
      },
    }),

    getCurrentUser: builder.query<{ success: boolean; data: User }, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.ME,
        method: "GET",
        skipErrorHandling: true,
      }),
      providesTags: ["User"],
    }),
  }),
});

function clearAuthStorage() {
  const keysToRemove = [
    "accessToken",
    "refreshToken",
    "user",
    "driverId",
    "userId",
    // Add keys to remove
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}

export const {
  useLoginMutation,
  useSignupMutation,
  useInitiateGoogleAuthQuery,
  useHandleGoogleCallbackMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdatePasswordMutation,
} = authApi;
