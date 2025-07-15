/**
 * Token refresh configuration from environment variables
 */
export interface TokenRefreshConfig {
  /** Refresh interval in minutes */
  refreshInterval: number;
  /** Buffer time in minutes before token expiry to trigger refresh */
  refreshBuffer: number;
  /** Whether automatic token refresh is enabled */
  enabled: boolean;
  /** Timeout for token refresh requests in seconds */
  refreshTimeoutSeconds: number;
}

/**
 * Get token refresh configuration from environment variables
 */
export const getTokenRefreshConfig = (): TokenRefreshConfig => {
  const refreshInterval = parseInt(
    process.env.REACT_APP_TOKEN_REFRESH_INTERVAL || "45",
    10,
  );
  const refreshBuffer = parseInt(
    process.env.REACT_APP_TOKEN_REFRESH_BUFFER || "5",
    10,
  );
  const refreshTimeoutSeconds = parseInt(
    process.env.REACT_APP_TOKEN_REFRESH_TIMEOUT || "30",
    10,
  );
  const enabled = process.env.REACT_APP_ENABLE_TOKEN_REFRESH !== "false";

  // Validation
  if (refreshInterval < 1 || refreshInterval > 1440) {
    console.warn(
      `Invalid refresh interval: ${refreshInterval}. Using default: 45 minutes`,
    );
    return {
      refreshInterval: 45,
      refreshBuffer: 5,
      refreshTimeoutSeconds: 30,
      enabled,
    };
  }

  if (refreshBuffer < 0 || refreshBuffer >= refreshInterval) {
    console.warn(
      `Invalid refresh buffer: ${refreshBuffer}. Using default: 5 minutes`,
    );
    return {
      refreshInterval,
      refreshBuffer: 5,
      refreshTimeoutSeconds: 30,
      enabled,
    };
  }

  if (refreshTimeoutSeconds < 5 || refreshTimeoutSeconds > 120) {
    console.warn(
      `Invalid refresh timeout: ${refreshTimeoutSeconds}. Using default: 30 seconds`,
    );
    return {
      refreshInterval,
      refreshBuffer,
      refreshTimeoutSeconds: 30,
      enabled,
    };
  }

  return {
    refreshInterval,
    refreshBuffer,
    refreshTimeoutSeconds,
    enabled,
  };
};

/**
 * Convert minutes to milliseconds
 */
export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;
