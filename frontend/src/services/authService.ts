import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/constants";
import type {
  LoginCredentials,
  SignupCredentials,
  LoginResponse,
  SignupResponse,
  RefreshTokenResponse,
  VerifyOTPCredentials,
  ResetPasswordConfirmCredentials,
  User,
} from "@/types";

interface AuthServiceResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly message: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log("🔍 authService.login called with:", {
      email: credentials.email,
    });

    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log("✅ authService.login success response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    } catch (error) {
      console.error("❌ authService.login error:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      if (error.message) {
        throw new Error(error.message);
      }

      throw new Error("Login failed");
    }
  }

  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      const signupData = {
        name: credentials.name,
        email: credentials.email,
        mobile: credentials.mobile,
        password: credentials.password,
        role: credentials.role,
      };

      const response = await apiClient.post<SignupResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        signupData
      );

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async verifyOTP(credentials: VerifyOTPCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        credentials
      );

      if (!response.data) {
        throw new Error("Invalid response format");
      }

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resendOTP(email: string): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<AuthServiceResponse>(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        { email }
      );

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<AuthServiceResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { email }
      );

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async confirmPasswordReset(
    credentials: ResetPasswordConfirmCredentials
  ): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<AuthServiceResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM,
        credentials
      );

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      // Even if logout API fails, we should continue with local cleanup
      console.error("Logout API failed:", error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<AuthServiceResponse<User>>(
        API_ENDPOINTS.AUTH.ME
      );

      if (!response.data) {
        throw new Error("Invalid response format");
      }

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
      return new Error(String(error.message));
    }

    return new Error("An unexpected error occurred");
  }
}

export const authService = new AuthService();
