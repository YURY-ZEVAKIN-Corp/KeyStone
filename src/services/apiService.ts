import { EventEmitter } from "../utils/EventEmitter";
import { IService, requireService } from "./ServiceRegistry";

// Example API service for making authenticated calls
class ApiServiceClass extends EventEmitter implements IService {
  public readonly serviceName = "ApiService";
  private baseUrl: string;

  constructor(baseUrl: string = process.env.REACT_APP_API_BASE_URL || "") {
    super();
    this.baseUrl = baseUrl;
  }

  /**
   * Initialize the ApiService
   */
  public initialize(): void {
    console.log("ApiService initialized with baseUrl:", this.baseUrl);
  }

  /**
   * Dispose the ApiService
   */
  public dispose(): void {
    this.removeAllListeners();
    console.log("ApiService disposed");
  }

  /**
   * Get TokenService from registry
   */
  private getTokenService() {
    return requireService("TokenService") as any;
  }

  /**
   * Set base URL for API calls
   */
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
    this.emit("baseUrl:changed", baseUrl);
  }

  /**
   * Get current base URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
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
      const tokenService = this.getTokenService();
      const token = await tokenService.getAccessToken(scopes);

      // Create request with auth header
      const headers = {
        ...tokenService.createAuthHeader(token),
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

  /**
   * Microsoft Graph API call
   */
  async callGraphApi<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const tokenService = this.getTokenService();
      const token = await tokenService.getGraphToken();
      const headers = {
        ...tokenService.createAuthHeader(token),
        ...options.headers,
      };

      const response = await fetch(
        `https://graph.microsoft.com/v1.0${endpoint}`,
        {
          ...options,
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Graph API call failed: ${response.status}`);
      }

      const result = await response.json();
      this.emit("graph:call:success", { endpoint, result });
      return result;
    } catch (error) {
      console.error("Graph API call error:", error);
      this.emit("graph:call:error", { endpoint, error });
      throw error;
    }
  }

  /**
   * Get user profile from Microsoft Graph
   */
  async getUserProfile(): Promise<any> {
    return this.callGraphApi("/me");
  }

  /**
   * Get user emails from Microsoft Graph
   */
  async getUserEmails(): Promise<any> {
    return this.callGraphApi(
      "/me/messages?$select=subject,from,receivedDateTime&$orderby=receivedDateTime desc&$top=10",
    );
  }
}

// Export the class for registration
export { ApiServiceClass };

// Factory function for service registry
export function createApiService(baseUrl?: string): ApiServiceClass {
  return new ApiServiceClass(baseUrl);
}
