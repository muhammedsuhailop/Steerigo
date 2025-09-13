import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout as logoutAction, getRefreshTokenFromStorage } from "../store/authSlice";
import type {
    AuthResponse,
    LoginRequest,
    SignupRequest,
    OTPVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    User,
} from "../types";

const baseQuery = fetchBaseQuery({
    baseUrl: "/api/auth",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
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

        signup: builder.mutation<{ success: boolean; message: string }, SignupRequest>({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
        }),

        initiateGoogleAuth: builder.query<{ success: boolean; data: { authUrl: string }; message: string }, void>({
            query: () => ({
                url: "/google",
                method: "GET",
            }),
        }),

        handleGoogleCallback: builder.mutation<AuthResponse, { code: string; state?: string }>({
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

        resendSignupOTP: builder.mutation<{ success: boolean; message: string }, { email: string }>({
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

        resendOTP: builder.mutation<{ success: boolean; message: string }, { email: string }>({
            query: ({ email }) => ({
                url: "/resend-otp",
                method: "POST",
                body: { email },
            }),
        }),

        forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
            query: (emailData) => ({
                url: "/forgot-password",
                method: "POST",
                body: emailData,
            }),
        }),

        resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
            query: (resetData) => ({
                url: "/reset-password",
                method: "POST",
                body: resetData,
            }),
        }),

        refreshToken: builder.mutation<{ token: string; refreshToken: string }, void>({
            query: () => ({
                url: "/refresh-token",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
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
                    // Always clear client auth state
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
} = authApi;
