interface GoogleAuthResponse {
  success: boolean;
  data?: {
    authUrl: string;
  };
  message: string;
}

export class GoogleAuthService {
  static async initiateGoogleLogin(): Promise<void> {
    try {
      const response = await fetch("/api/auth/google", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: GoogleAuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate Google login");
      }

      if (data.success && data.data?.authUrl) {
        // Redirect to the Google OAuth URL returned by backend
        window.location.href = data.data.authUrl;
      } else {
        throw new Error("No auth URL received from backend");
      }
    } catch (error) {
      console.error("Google login initiation failed:", error);
      throw error;
    }
  }

  static handleGoogleCallback(
    accessToken: string,
    refreshToken: string
  ): { user: any; token: string; refreshToken: string } {
    return { user: null as any, token: accessToken, refreshToken };
  }
}
