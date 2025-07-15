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
  const enabled = process.env.REACT_APP_ENABLE_TOKEN_REFRESH !== "false";

  // Validation
  if (refreshInterval < 1 || refreshInterval > 1440) {
    console.warn(
      `Invalid refresh interval: ${refreshInterval}. Using default: 45 minutes`,
    );
    return {
      refreshInterval: 45,
      refreshBuffer: 5,
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
      enabled,
    };
  }

  return {
    refreshInterval,
    refreshBuffer,
    enabled,
  };
};

/**
 * Convert minutes to milliseconds
 */
export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;
