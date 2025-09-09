import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/redux/store";
import {
  setCredentials,
  initializeAuth,
  clearError,
} from "@/redux/slices/authSlice";
import { ROLE_ROUTES } from "@/constants";
import { log } from "@/utils/logger";
import type { UserRole, User } from "@/types";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

const AuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken") ?? "";
    const isNewUser = params.get("isNewUser") === "true";

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);

      const roleMap: Record<string, UserRole> = {
        rider: "Rider",
        Rider: "Rider",
        driver: "Driver",
        Driver: "Driver",
        admin: "Admin",
        Admin: "Admin",
      };
      const normalizedRole: UserRole = roleMap[decoded.role] || "Rider";

      const user: User = {
        id: decoded.id,
        email: decoded.email,
        role: normalizedRole,
        name: (decoded as any).name || decoded.email,
        status: (decoded as any).status || "active",
      };

      dispatch(
        setCredentials({
          user,
          token: accessToken,
          refreshToken,
        })
      );

      dispatch(initializeAuth());

      if (isNewUser) {
        navigate("/onboarding", { replace: true });
      } else {
        const defaultRoute = ROLE_ROUTES[normalizedRole];
        navigate(defaultRoute, { replace: true });
      }
    } catch (error) {
      log.error("Failed to decode token", error);
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Signing you in, please wait...</p>
    </div>
  );
};

export default AuthCallback;
