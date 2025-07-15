import {
  IPublicClientApplication,
  AccountInfo,
  SilentRequest,
  InteractionRequiredAuthError,
  AuthenticationResult,
} from "@azure/msal-browser";
import { apiScopes } from "../authConfig";
import {
  getTokenRefreshConfig,
  minutesToMs,
  TokenRefreshConfig,
} from "../config/tokenRefreshConfig";

export interface TokenInfo {
  token: string;
  expiresAt: number;
  scopes: string[];
}

export interface TokenRefreshEvent {
  type: "refresh_success" | "refresh_error" | "refresh_scheduled";
  scopes: string[];
  timestamp: number;
  error?: Error;
}

export class TokenService {
  private msalInstance: IPublicClientApplication;
  private refreshConfig: TokenRefreshConfig;
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private tokenCache: Map<string, TokenInfo> = new Map();
  private refreshListeners: Array<(event: TokenRefreshEvent) => void> = [];

  constructor(msalInstance: IPublicClientApplication) {
    this.msalInstance = msalInstance;
    this.refreshConfig = getTokenRefreshConfig();

    // Initialize refresh service if enabled
    if (this.refreshConfig.enabled) {
      this.initializeRefreshService();
    }
  }

  /**
   * Initialize the token refresh service
   */
  private initializeRefreshService(): void {
    console.log(
      "Token refresh service initialized with config:",
      this.refreshConfig,
    );

    // Schedule refresh for common token scopes
    this.scheduleTokenRefresh(apiScopes.graphApi.scopes);

    // Listen for account changes to restart refresh schedules
    this.msalInstance.addEventCallback((event) => {
      if (
        event.eventType === "msal:loginSuccess" ||
        event.eventType === "msal:logoutSuccess"
      ) {
        this.resetRefreshSchedules();
      }
    });
  }

  /**
   * Add a listener for token refresh events
   */
  addRefreshListener(listener: (event: TokenRefreshEvent) => void): void {
    this.refreshListeners.push(listener);
  }

  /**
   * Remove a token refresh event listener
   */
  removeRefreshListener(listener: (event: TokenRefreshEvent) => void): void {
    const index = this.refreshListeners.indexOf(listener);
    if (index > -1) {
      this.refreshListeners.splice(index, 1);
    }
  }

  /**
   * Emit a token refresh event
   */
  private emitRefreshEvent(event: TokenRefreshEvent): void {
    this.refreshListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in token refresh listener:", error);
      }
    });
  }

  /**
   * Schedule automatic token refresh for given scopes
   */
  scheduleTokenRefresh(scopes: string[]): void {
    if (!this.refreshConfig.enabled) {
      return;
    }

    const scopeKey = scopes.sort().join(",");

    // Clear existing timer for these scopes
    if (this.refreshTimers.has(scopeKey)) {
      const existingTimer = this.refreshTimers.get(scopeKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
    }

    // Calculate next refresh time
    const refreshIntervalMs = minutesToMs(this.refreshConfig.refreshInterval);

    const timer = setTimeout(() => {
      this.performScheduledRefresh(scopes);
    }, refreshIntervalMs);

    this.refreshTimers.set(scopeKey, timer);

    this.emitRefreshEvent({
      type: "refresh_scheduled",
      scopes,
      timestamp: Date.now(),
    });

    console.log(
      `Token refresh scheduled for scopes [${scopes.join(", ")}] in ${this.refreshConfig.refreshInterval} minutes`,
    );
  }

  /**
   * Perform scheduled token refresh
   */
  private async performScheduledRefresh(scopes: string[]): Promise<void> {
    try {
      console.log(
        `Performing scheduled refresh for scopes: [${scopes.join(", ")}]`,
      );

      const activeAccount = this.msalInstance.getActiveAccount();
      if (!activeAccount) {
        console.warn("No active account found for scheduled refresh");
        return;
      }

      // Try to refresh token silently
      await this.refreshTokenSilently(scopes, activeAccount);

      // Schedule next refresh
      this.scheduleTokenRefresh(scopes);

      this.emitRefreshEvent({
        type: "refresh_success",
        scopes,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Scheduled token refresh failed:", error);

      this.emitRefreshEvent({
        type: "refresh_error",
        scopes,
        timestamp: Date.now(),
        error: error as Error,
      });

      // Retry with exponential backoff
      this.scheduleRetryRefresh(scopes, 1);
    }
  }

  /**
   * Schedule retry refresh with exponential backoff
   */
  private scheduleRetryRefresh(scopes: string[], retryCount: number): void {
    const maxRetries = 3;
    if (retryCount > maxRetries) {
      console.error(
        `Token refresh failed after ${maxRetries} retries for scopes: [${scopes.join(", ")}]`,
      );
      return;
    }

    const delayMs = Math.min(1000 * Math.pow(2, retryCount), 60000); // Max 1 minute delay

    setTimeout(() => {
      this.performScheduledRefresh(scopes).catch(() => {
        this.scheduleRetryRefresh(scopes, retryCount + 1);
      });
    }, delayMs);

    console.log(
      `Retry ${retryCount} scheduled in ${delayMs}ms for scopes: [${scopes.join(", ")}]`,
    );
  }

  /**
   * Refresh token silently
   */
  private async refreshTokenSilently(
    scopes: string[],
    account: AccountInfo,
  ): Promise<AuthenticationResult> {
    const silentRequest: SilentRequest = {
      scopes,
      account,
    };

    try {
      const response =
        await this.msalInstance.acquireTokenSilent(silentRequest);

      // Update cache
      const scopeKey = scopes.sort().join(",");
      this.tokenCache.set(scopeKey, {
        token: response.accessToken,
        expiresAt: response.expiresOn?.getTime() || 0,
        scopes,
      });

      return response;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.warn("Interactive authentication required for token refresh");
        throw new Error(
          "Interactive authentication required - cannot refresh silently",
        );
      }
      throw error;
    }
  }

  /**
   * Reset all refresh schedules (e.g., after login/logout)
   */
  private resetRefreshSchedules(): void {
    console.log("Resetting all token refresh schedules");

    // Clear all existing timers
    this.refreshTimers.forEach((timer) => clearTimeout(timer));
    this.refreshTimers.clear();
    this.tokenCache.clear();

    // Reinitialize if user is logged in
    const activeAccount = this.msalInstance.getActiveAccount();
    if (activeAccount && this.refreshConfig.enabled) {
      this.initializeRefreshService();
    }
  }

  /**
   * Manually trigger token refresh for specific scopes
   */
  async refreshToken(scopes: string[]): Promise<string> {
    const activeAccount = this.msalInstance.getActiveAccount();
    if (!activeAccount) {
      throw new Error("No active account found");
    }

    try {
      const response = await this.refreshTokenSilently(scopes, activeAccount);

      // Reschedule automatic refresh
      this.scheduleTokenRefresh(scopes);

      return response.accessToken;
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      throw error;
    }
  }

  /**
   * Get cached token info
   */
  getCachedTokenInfo(scopes: string[]): TokenInfo | null {
    const scopeKey = scopes.sort().join(",");
    return this.tokenCache.get(scopeKey) || null;
  }

  /**
   * Check if token needs refresh based on expiry and buffer time
   */
  shouldRefreshToken(token: string): boolean {
    try {
      const decoded = this.decodeJwtToken(token);
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = minutesToMs(this.refreshConfig.refreshBuffer) / 1000;

      return decoded.exp <= currentTime + bufferTime;
    } catch {
      return true;
    }
  }

  /**
   * Stop all token refresh timers (cleanup)
   */
  stopRefreshService(): void {
    console.log("Stopping token refresh service");
    this.refreshTimers.forEach((timer) => clearTimeout(timer));
    this.refreshTimers.clear();
    this.tokenCache.clear();
    this.refreshListeners.length = 0;
  }

  /**
   * Get current refresh configuration
   */
  getRefreshConfig(): TokenRefreshConfig {
    return { ...this.refreshConfig };
  }

  /**
   * Update refresh configuration (requires restart of service)
   */
  updateRefreshConfig(newConfig: Partial<TokenRefreshConfig>): void {
    this.refreshConfig = { ...this.refreshConfig, ...newConfig };

    if (this.refreshConfig.enabled) {
      this.resetRefreshSchedules();
    } else {
      this.stopRefreshService();
    }
  }
  /**
   * Get access token silently (preferred method)
   * Falls back to interactive authentication if silent fails
   * Automatically schedules refresh if not already scheduled
   */
  async getAccessToken(
    scopes: string[],
    account?: AccountInfo,
  ): Promise<string> {
    try {
      const activeAccount = account || this.msalInstance.getActiveAccount();

      if (!activeAccount) {
        throw new Error("No active account found");
      }

      // Check cache first
      const cachedToken = this.getCachedTokenInfo(scopes);
      if (cachedToken && !this.shouldRefreshToken(cachedToken.token)) {
        // Schedule refresh if not already scheduled
        const scopeKey = scopes.sort().join(",");
        if (!this.refreshTimers.has(scopeKey)) {
          this.scheduleTokenRefresh(scopes);
        }
        return cachedToken.token;
      }

      const silentRequest: SilentRequest = {
        scopes: scopes,
        account: activeAccount,
      };

      const response =
        await this.msalInstance.acquireTokenSilent(silentRequest);

      // Update cache
      const scopeKey = scopes.sort().join(",");
      this.tokenCache.set(scopeKey, {
        token: response.accessToken,
        expiresAt: response.expiresOn?.getTime() || 0,
        scopes,
      });

      // Schedule automatic refresh if enabled
      if (this.refreshConfig.enabled) {
        this.scheduleTokenRefresh(scopes);
      }

      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to interactive authentication
        console.log(
          "Silent token acquisition failed, falling back to interactive",
        );
        return this.getAccessTokenInteractive(scopes);
      }
      throw error;
    }
  }

  /**
   * Get access token using interactive authentication (popup)
   */
  async getAccessTokenInteractive(scopes: string[]): Promise<string> {
    try {
      const response = await this.msalInstance.acquireTokenPopup({
        scopes: scopes,
      });

      // Update cache
      const scopeKey = scopes.sort().join(",");
      this.tokenCache.set(scopeKey, {
        token: response.accessToken,
        expiresAt: response.expiresOn?.getTime() || 0,
        scopes,
      });

      // Schedule automatic refresh if enabled
      if (this.refreshConfig.enabled) {
        this.scheduleTokenRefresh(scopes);
      }

      return response.accessToken;
    } catch (error) {
      console.error("Interactive token acquisition failed:", error);
      throw error;
    }
  }

  /**
   * Get token for Microsoft Graph API calls
   */
  async getGraphToken(): Promise<string> {
    return this.getAccessToken(apiScopes.graphApi.scopes);
  }

  /**
   * Get token for custom API calls
   */
  async getCustomApiToken(): Promise<string> {
    return this.getAccessToken(apiScopes.customApi.scopes);
  }

  /**
   * Get ID token (contains user claims)
   */
  getIdToken(): string | null {
    const activeAccount = this.msalInstance.getActiveAccount();
    return activeAccount?.idToken || null;
  }

  /**
   * Decode JWT token (client-side only, don't use for validation)
   */
  decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }

  /**
   * Check if token is expired (client-side check only)
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeJwtToken(token);
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token claims/information
   */
  getTokenClaims(token: string): any {
    return this.decodeJwtToken(token);
  }

  /**
   * Create authorization header for API calls
   */
  createAuthHeader(token: string): { [key: string]: string } {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}
