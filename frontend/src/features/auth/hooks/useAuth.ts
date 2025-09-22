/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from "../services/authApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from "../store/authSelectors";
import {
  logout as logoutAction,
  initializeAuth,
  initiateGoogleAuth,
  setupAutoRefresh,
} from "../store/authSlice";
import { errorHandler, AuthContext } from "../../../shared/utils/errorUtils";
import {
  selectLoginErrors,
  selectSignupErrors,
  selectOtpErrors,
} from "./authErrorSelectors";
import type { LoginRequest } from "../types";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { isTokenExpired } from "@/shared/utils/tokenUtils";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Get auth-related errors from centralized system using memoized selectors
  const loginErrors = useSelector(selectLoginErrors);
  const signupErrors = useSelector(selectSignupErrors);
  const otpErrors = useSelector(selectOtpErrors);

  // Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Initialize auth on app start
  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Check token validity
  const isTokenValid = useCallback(() => {
    return accessToken && !isTokenExpired(accessToken);
  }, [accessToken]);

  // Login function - preserve all existing logic, add error cleanup
  const login = useCallback(
    async (credentials: LoginRequest) => {
      // Clear previous login errors
      errorHandler.clearAuthErrors(AuthContext.LOGIN);
      
      try {
        const result = await loginMutation(credentials).unwrap();
        if (result.success) {
          // Setup auto-refresh for new token
          dispatch(setupAutoRefresh(result.data.accessToken));

          // Redirect based on user role
          const redirectPath = getUserDashboardPath(result.data.user.role);
          navigate(redirectPath);
          return { success: true, message: result.message };
        }
        return { success: false, message: result.message };
      } catch (error: any) {
        // Error handled by middleware - just return failure
        return {
          success: false,
          message: error.data?.message || "Login failed. Please try again.",
        };
      }
    },
    [loginMutation, navigate, dispatch]
  );

  // Logout function - preserve all existing logic
  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Continue with logout even if server request fails
      console.warn("Logout request failed, but continuing with client logout");
    } finally {
      dispatch(logoutAction());
      navigate("/");
    }
    return { success: true, message: "Logged out successfully" };
  }, [logoutMutation, dispatch, navigate]);

  // Refresh token function - preserve all existing logic
  const refreshToken = useCallback(async () => {
    try {
      await refreshTokenMutation().unwrap();
      return { success: true };
    } catch (error: any) {
      // If refresh fails, logout user
      dispatch(logoutAction());
      navigate("/login");
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }
  }, [refreshTokenMutation, dispatch, navigate]);

  // Clear auth errors - only use centralized error handling
  const clearAuthErrors = useCallback((context?: string) => {
    if (context) {
      errorHandler.clearAuthErrors(context);
    } else {
      // Clear all auth errors
      errorHandler.clearAuthErrors(AuthContext.LOGIN);
      errorHandler.clearAuthErrors(AuthContext.SIGNUP);
      errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
      errorHandler.clearAuthErrors(AuthContext.PASSWORD_RESET);
      errorHandler.clearAuthErrors(AuthContext.PASSWORD_UPDATE);
      errorHandler.clearAuthErrors(AuthContext.GOOGLE_AUTH);
    }
  }, []);

  // Check if user has specific role - preserve existing logic
  const hasRole = useCallback(
    (role: string) => {
      return userRole === role;
    },
    [userRole]
  );

  const isAdmin = useCallback(() => {
    return userRole === "Admin";
  }, [userRole]);

  const isDriver = useCallback(() => {
    return userRole === "Driver";
  }, [userRole]);

  const isUser = useCallback(() => {
    return userRole === "Rider";
  }, [userRole]);

  // Google login - preserve existing logic, add error cleanup
  const loginWithGoogle = useCallback(async () => {
    errorHandler.clearAuthErrors(AuthContext.GOOGLE_AUTH);
    
    try {
      await dispatch(initiateGoogleAuth()).unwrap();
      return { success: true, message: "Redirecting to Google..." };
    } catch (error: any) {
      // Error handled by middleware
      return {
        success: false,
        message:
          error.message || "Google authentication failed. Please try again.",
      };
    }
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isLogoutLoading,
    error, // Keep legacy error for backward compatibility
    userRole,
    accessToken,

    // Centralized errors (now memoized)
    loginErrors,
    signupErrors, 
    otpErrors,

    // Actions
    initialize,
    login,
    loginWithGoogle,
    logout,
    refreshToken,
    clearAuthError: clearAuthErrors, // Use centralized error clearing

    // Utilities
    hasRole,
    isAdmin,
    isDriver,
    isUser,
    isTokenValid,
  };
};

export const getUserDashboardPath = (role: string): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "DRIVER":
      return "/driver/dashboard";
    case "USER":
    default:
      return "/user/dashboard";
  }
};