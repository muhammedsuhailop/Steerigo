import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/auth",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as any).auth.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation<
      { success: boolean; message: string },
      SignupRequest
    >({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    initiateGoogleAuth: builder.query<
      { success: boolean; data: { authUrl: string }; message: string },
      void
    >({
      query: () => ({
        url: "/google",
        method: "GET",
      }),
    }),

    handleGoogleCallback: builder.mutation<
      AuthResponse,
      { code: string; state?: string }
    >({
      query: (callbackData) => ({
        url: "/google/callback",
        method: "POST",
        body: callbackData,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifySignupOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: "/signup/verify",
        method: "POST",
        body: otpData,
      }),
      invalidatesTags: ["Auth"],
    }),

    resendSignupOTP: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: "/signup/resend",
        method: "POST",
        body: { email },
      }),
    }),

    verifyOTP: builder.mutation<AuthResponse, OTPVerificationRequest>({
      query: (otpData) => ({
        url: "/signup/verify",
        method: "POST",
        body: otpData,
      }),
      invalidatesTags: ["Auth"],
    }),

    resendOTP: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: "/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordRequest
    >({
      query: (emailData) => ({
        url: "/forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordRequest
    >({
      query: (resetData) => ({
        url: "/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),

    updatePassword: builder.mutation<
      { success: boolean; message: string },
      UpdatePasswordRequest
    >({
      query: (passwordData) => ({
        url: "/update-password",
        method: "PUT",
        body: passwordData,
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
          url: "/refresh-token",
          method: "POST",
          body: { refreshToken },
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
          url: "/logout",
          method: "POST",
          body: { refreshToken },
          headers: { "Content-Type": "application/json" },
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
        }
      },
    }),

    getCurrentUser: builder.query<{ success: boolean; data: User }, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
  }),
});

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
