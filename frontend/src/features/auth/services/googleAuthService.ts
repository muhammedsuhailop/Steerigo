interface GoogleAuthResponse {
  success: boolean;
  data?: {
    authUrl: string;
  };
  message: string;
}

export class GoogleAuthService {
  /**
   * Initiates Google OAuth flow by getting the authorization URL from backend
   */
  static async initiateGoogleLogin(): Promise<void> {
    try {
      const response = await fetch("/api/auth/google", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate Google login");
      }

      return data;
    } catch (error) {
      console.error("Google login initiation failed:", error);
      throw error;
    }
    // window.location.href = '/api/auth/google';
  }

  /**
   * Handles the Google OAuth callback
   */
  static handleGoogleCallback(
    /*code: string,
    state?: string
  ): Promise<{
    user: any;
    token: string;
    refreshToken: string;
  }> {
    try {
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      return data.data;
    } catch (error) {
      console.error('Google callback handling failed:', error);
      throw error;
    }
  }
    */
    accessToken: string,
    refreshToken: string
  ): { user: any; token: string; refreshToken: string } {
    // Return tokens directly; user will be fetched or decoded elsewhere
    return { user: null as any, token: accessToken, refreshToken };
  }
}
