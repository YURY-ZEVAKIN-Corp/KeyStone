import { useEffect, useState, useCallback, useRef } from "react";
import { useTokenService } from "../services/useTokenService";
import { TokenRefreshEvent } from "../services/tokenService";

export interface TokenRefreshStatus {
  isRefreshing: boolean;
  lastRefresh?: Date;
  lastError?: Error;
  refreshCount: number;
  nextRefresh?: Date;
  refreshStartTime?: Date;
  refreshProgress?: string;
}

export interface UseTokenRefreshOptions {
  /** Scopes to monitor for refresh */
  scopes?: string[];
  /** Whether to enable refresh monitoring for this component */
  enabled?: boolean;
  /** Callback when refresh succeeds */
  onRefreshSuccess?: (scopes: string[]) => void;
  /** Callback when refresh fails */
  onRefreshError?: (error: Error, scopes: string[]) => void;
}

/**
 * Hook for monitoring and managing token refresh
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    scopes = ["User.Read"],
    enabled = true,
    onRefreshSuccess,
    onRefreshError,
  } = options;

  const tokenService = useTokenService();
  const [status, setStatus] = useState<TokenRefreshStatus>({
    isRefreshing: false,
    refreshCount: 0,
  });

  // Use refs to avoid stale closures in event listeners
  const statusRef = useRef(status);
  statusRef.current = status;

  const handleRefreshEvent = useCallback(
    (event: TokenRefreshEvent) => {
      // Only handle events for our monitored scopes
      const isRelevant = scopes.some((scope) => event.scopes.includes(scope));
      if (!isRelevant) return;

      setStatus((prevStatus) => {
        const newStatus = { ...prevStatus };

        switch (event.type) {
          case "refresh_scheduled":
            newStatus.isRefreshing = true;
            newStatus.refreshStartTime = new Date(event.timestamp);
            newStatus.refreshProgress = "Starting token refresh...";
            newStatus.lastError = undefined;

            const config = tokenService.getRefreshConfig();
            if (
              !newStatus.refreshStartTime ||
              event.timestamp > (newStatus.refreshStartTime?.getTime() || 0)
            ) {
              // Only set next refresh for actual scheduling, not manual refresh start
              const isManualRefresh =
                Math.abs(event.timestamp - Date.now()) < 1000; // Within 1 second
              if (!isManualRefresh) {
                newStatus.nextRefresh = new Date(
                  Date.now() + config.refreshInterval * 60 * 1000,
                );
              }
            }
            break;

          case "refresh_success":
            newStatus.isRefreshing = false;
            newStatus.lastRefresh = new Date(event.timestamp);
            newStatus.refreshCount = prevStatus.refreshCount + 1;
            newStatus.lastError = undefined;
            newStatus.refreshProgress = undefined;
            newStatus.refreshStartTime = undefined;

            // Calculate next refresh time
            const successConfig = tokenService.getRefreshConfig();
            newStatus.nextRefresh = new Date(
              event.timestamp + successConfig.refreshInterval * 60 * 1000,
            );

            onRefreshSuccess?.(event.scopes);
            break;

          case "refresh_error":
            newStatus.isRefreshing = false;
            newStatus.lastError = event.error;
            newStatus.refreshProgress = undefined;
            newStatus.refreshStartTime = undefined;

            if (event.error) {
              onRefreshError?.(event.error, event.scopes);
            }
            break;
        }

        return newStatus;
      });
    },
    [scopes, tokenService, onRefreshSuccess, onRefreshError],
  );

  // Set up event listener
  useEffect(() => {
    if (!enabled) return;

    tokenService.addRefreshListener(handleRefreshEvent);

    return () => {
      tokenService.removeRefreshListener(handleRefreshEvent);
    };
  }, [tokenService, handleRefreshEvent, enabled]);

  // Manual refresh function
  const manualRefresh = useCallback(
    async (refreshScopes?: string[]) => {
      const scopesToRefresh = refreshScopes || scopes;

      // Set initial refreshing state immediately
      setStatus((prev) => ({
        ...prev,
        isRefreshing: true,
        refreshStartTime: new Date(),
        refreshProgress: "Initiating manual refresh...",
        lastError: undefined,
      }));

      try {
        await tokenService.refreshToken(scopesToRefresh);
        // The success event will be handled by the event listener
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          isRefreshing: false,
          lastError: error as Error,
          refreshProgress: undefined,
          refreshStartTime: undefined,
        }));
        throw error;
      }
    },
    [tokenService, scopes],
  );

  // Schedule refresh for specific scopes
  const scheduleRefresh = useCallback(
    (refreshScopes?: string[]) => {
      const scopesToSchedule = refreshScopes || scopes;
      tokenService.scheduleTokenRefresh(scopesToSchedule);
    },
    [tokenService, scopes],
  );

  // Get current refresh configuration
  const getConfig = useCallback(() => {
    return tokenService.getRefreshConfig();
  }, [tokenService]);

  // Update refresh configuration
  const updateConfig = useCallback(
    (newConfig: Partial<typeof getConfig>) => {
      tokenService.updateRefreshConfig(newConfig);
    },
    [tokenService],
  );

  return {
    status,
    manualRefresh,
    scheduleRefresh,
    getConfig,
    updateConfig,
    isRefreshEnabled: enabled && getConfig().enabled,
  };
};
