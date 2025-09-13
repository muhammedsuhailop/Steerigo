import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { handleGoogleCallback } from "../../store/authSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from "../../store/authSelectors";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useAppSelector } from "@/app/store/hooks";

export const AuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  // Extract tokens from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken") || "";

    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      console.error("OAuth error:", error, errorDescription);
      navigate(`/login?error=${error}`, { replace: true });
      return;
    }

    if (!accessToken) {
      console.error("Missing access token in callback");
      navigate("/login?error=missing_token", { replace: true });
      return;
    }

    dispatch(handleGoogleCallback({ accessToken, refreshToken }))
      .unwrap()
      .catch((err) => {
        console.error("Google callback failed:", err);
        navigate("/login?error=auth_failed", { replace: true });
      });
  }, [dispatch, navigate, location]);

  // Redirect when auth state changes
  useEffect(() => {
    if (isAuthenticated && userRole && !isLoading && !error) {
      const path =
        userRole.toUpperCase() === "ADMIN"
          ? "/admin/dashboard"
          : userRole.toUpperCase() === "DRIVER"
          ? "/driver/dashboard"
          : "/user/dashboard";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, userRole, isLoading, error, navigate]);

  return (
    <div>
      <LoadingSpinner />
      <h2>Signing you in...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};
