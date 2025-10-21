/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useLogoutMutation } from "../services/authApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from "../store/authSelectors";
import {
  logout as logoutAction,
  clearError,
  initializeAuth,
  initiateGoogleAuth,
} from "../store/authSlice";
import type { LoginRequest } from "../types";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { authErrorMapper } from "../utils/authErrorMapper";

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

  // Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Initialize auth on app start
  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Check token validity
  const isTokenValid = useCallback(() => {
    return !!accessToken;
  }, [accessToken]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        if (result.success) {
          // Redirect based on user role
          const redirectPath = getUserDashboardPath(result.data.user.role);
          navigate(redirectPath);
          return { success: true, message: result.message };
        }
        return { success: false, message: result.message };
      } catch (error: any) {
        const errorResult = authErrorMapper.processAuthError(error, "login");

        return {
          success: false,
          message: errorResult.message,
        };
      }
    },
    [loginMutation, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.warn("Logout request failed, but continuing with client logout");
    } finally {
      dispatch(logoutAction());
      navigate("/");
    }
    return { success: true, message: "Logged out successfully" };
  }, [logoutMutation, dispatch, navigate]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if user has specific role
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

  const loginWithGoogle = useCallback(async () => {
    try {
      await dispatch(initiateGoogleAuth()).unwrap();
      return { success: true, message: "Redirecting to Google..." };
    } catch (error: any) {
      const errorResult = authErrorMapper.processAuthError(
        error,
        "google_auth"
      );

      return {
        success: false,
        message: errorResult.message,
      };
    }
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isLogoutLoading,
    error,
    userRole,
    accessToken,

    // Actions
    initialize,
    login,
    loginWithGoogle,
    logout,
    clearAuthError,

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
      return "/dashboard";
  }
};
