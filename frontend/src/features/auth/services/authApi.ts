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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
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
        url: "/auth/signup",
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
        url: "/auth/google",
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
        url: "/auth/google/callback",
        method: "POST",
        data: callbackData,
        skipAuth: true,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifySignupOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: "/auth/signup/verify",
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
        url: "/auth/signup/resend",
        method: "POST",
        data: { email },
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    verifyOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: "/auth/signup/verify",
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
        url: "/auth/resend-otp",
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
        url: "/auth/forgot-password",
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
        url: "/auth/reset-password",
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
        url: "/auth/update-password",
        method: "PUT",
        data: passwordData,
        skipErrorHandling: true,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<
      {
        data: any;
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
          url: "/auth/refresh-token",
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
          url: "/auth/logout",
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
          clearAuthStorage();
        }
      },
    }),

    getCurrentUser: builder.query<{ success: boolean; data: User }, void>({
      query: () => ({
        url: "/auth/me",
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
