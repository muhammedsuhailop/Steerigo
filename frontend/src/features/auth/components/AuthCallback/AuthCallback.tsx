import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchCurrentUser,
  setupAutoRefresh,
  loginSuccess,
  mapDecodedToUser,
  DecodedJwt,
} from "../../store/authSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from "../../store/authSelectors";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { jwtDecode } from "jwt-decode";

export const AuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken") || "";
      const err = params.get("error");

      if (err || !accessToken) {
        console.error("OAuth error or missing token", err);
        navigate("/login?error=auth_failed", { replace: true });
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      try {
        const decoded = jwtDecode<DecodedJwt>(accessToken);
        const fallbackUser = mapDecodedToUser(decoded);
        dispatch(
          loginSuccess({
            user: fallbackUser,
            accessToken,
            refreshToken,
          })
        );

        dispatch(setupAutoRefresh(accessToken));

        try {
          const userData = await dispatch(fetchCurrentUser()).unwrap();
          dispatch(
            loginSuccess({
              user: userData,
              accessToken,
              refreshToken,
            })
          );
        } catch (e) {
          console.log("Using JWT decoded user data as fallback");
        }
      } catch (decodeError) {
        console.error("Failed to decode JWT token:", decodeError);
        navigate("/login?error=auth_failed", { replace: true });
      }
    };

    handleAuth();
  }, [dispatch, navigate, location]);

  useEffect(() => {
    if (isAuthenticated && userRole && !isLoading && !error) {
      const path =
        userRole.toLowerCase() === "admin"
          ? "/admin/dashboard"
          : userRole.toLowerCase() === "driver"
          ? "/driver/dashboard"
          : "/dashboard";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, userRole, isLoading, error, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate("/login")} className="btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="mt-4">Signing you in…</p>
    </div>
  );
};
