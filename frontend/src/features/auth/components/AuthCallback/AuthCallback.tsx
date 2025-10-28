import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchCurrentUser,
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
      const role = params.get("role");
      const isNewUser = params.get("isNewUser") === "true";
      const err = params.get("error");

      if (err) {
        console.error("OAuth error:", err);
        navigate("/login?error=" + err, { replace: true });
        return;
      }

      // Validate access token
      if (!accessToken) {
        console.error("Missing access token in callback");
        navigate("/login?error=missing_token", { replace: true });
        return;
      }

      try {
        // Decode JWT to get user info
        const decoded = jwtDecode<DecodedJwt>(accessToken);
        const fallbackUser = mapDecodedToUser(decoded);

        localStorage.setItem("accessToken", accessToken);

        // Update Redux store with initial user data from JWT
        dispatch(
          loginSuccess({
            user: fallbackUser,
            accessToken,
            refreshToken: "",
          })
        );

        // fetch full user data from backend
        try {
          const userData = await dispatch(fetchCurrentUser()).unwrap();

          dispatch(
            loginSuccess({
              user: userData,
              accessToken,
              refreshToken: "",
            })
          );

          console.log("Google login successful - Full user data loaded");
        } catch (fetchError) {
          console.log("Using JWT decoded user data as fallback");
        }
      } catch (decodeError) {
        console.error("Failed to decode JWT token:", decodeError);
        localStorage.removeItem("accessToken");
        navigate("/login?error=invalid_token", { replace: true });
      }
    };

    handleAuth();
  }, [dispatch, navigate, location]);

  // Redirect to appropriate dashboard after authentication
  useEffect(() => {
    if (isAuthenticated && userRole && !isLoading && !error) {
      const path =
        userRole.toLowerCase() === "admin"
          ? "/admin/dashboard"
          : userRole.toLowerCase() === "driver"
          ? "/driver/dashboard"
          : "/dashboard";

      console.log(` Redirecting to ${path}`);
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, userRole, isLoading, error, navigate]);

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Authentication Failed
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <LoadingSpinner />
        <p className="mt-4 text-gray-700 font-medium">
          Signing you in securely...
        </p>
        <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
};
