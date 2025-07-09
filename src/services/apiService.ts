import { useTokenService } from "./useTokenService";
import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

// Example API service for making authenticated calls
export class ApiService {
  private baseUrl: string;
  private tokenService: any;

  constructor(baseUrl: string, tokenService: any) {
    this.baseUrl = baseUrl;
    this.tokenService = tokenService;
  }

  /**
   * Generic API call with automatic token handling
   */
  async apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    scopes: string[] = ["User.Read"],
  ): Promise<T> {
    try {
      // Get access token
      const token = await this.tokenService.getAccessToken(scopes);

      // Create request with auth header
      const headers = {
        ...this.tokenService.createAuthHeader(token),
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, scopes?: string[]): Promise<T> {
    return this.apiCall<T>(endpoint, { method: "GET" }, scopes);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any, scopes?: string[]): Promise<T> {
    return this.apiCall<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      scopes,
    );
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, scopes?: string[]): Promise<T> {
    return this.apiCall<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      scopes,
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, scopes?: string[]): Promise<T> {
    return this.apiCall<T>(endpoint, { method: "DELETE" }, scopes);
  }
}

// Hook for using API service
export const useApiService = (baseUrl = "https://your-api.com/api") => {
  const tokenService = useTokenService();
  const apiService = new ApiService(baseUrl, tokenService);

  return apiService;
};

// Example hook for Microsoft Graph API calls
export const useGraphApi = () => {
  const tokenService = useTokenService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGraphApi = useCallback(
    async (endpoint: string) => {
      setLoading(true);
      setError(null);

      try {
        const token = await tokenService.getGraphToken();
        const headers = tokenService.createAuthHeader(token);

        const response = await fetch(
          `https://graph.microsoft.com/v1.0${endpoint}`,
          {
            headers,
          },
        );

        if (!response.ok) {
          throw new Error(`Graph API call failed: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [tokenService],
  );

  // Specific Graph API methods
  const getUserProfile = useCallback(() => callGraphApi("/me"), [callGraphApi]);
  const getUserPhoto = useCallback(
    () => callGraphApi("/me/photo/$value"),
    [callGraphApi],
  );
  const getUserEmails = useCallback(
    () => callGraphApi("/me/messages?$top=10"),
    [callGraphApi],
  );

  return {
    callGraphApi,
    getUserProfile,
    getUserPhoto,
    getUserEmails,
    loading,
    error,
  };
};

// Hook for token inspection and debugging
export const useTokenInspector = () => {
  const tokenService = useTokenService();
  const { user } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const inspectCurrentTokens = useCallback(async () => {
    try {
      // Get ID token (contains user info)
      const idToken = tokenService.getIdToken();

      // Get access token for Graph API
      const graphToken = await tokenService.getGraphToken();

      const tokenInfo = {
        idToken: {
          raw: idToken,
          decoded: idToken ? tokenService.decodeJwtToken(idToken) : null,
          expired: idToken ? tokenService.isTokenExpired(idToken) : true,
        },
        accessToken: {
          raw: graphToken,
          decoded: tokenService.decodeJwtToken(graphToken),
          expired: tokenService.isTokenExpired(graphToken),
        },
        user: user,
      };

      setTokenInfo(tokenInfo);
      console.log("Token Information:", tokenInfo);
      return tokenInfo;
    } catch (error) {
      console.error("Error inspecting tokens:", error);
      setTokenInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [tokenService, user]);

  return {
    tokenInfo,
    inspectCurrentTokens,
  };
};
