import React from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import "./TokenRefreshStatus.module.css";

export interface TokenRefreshStatusProps {
  /** Whether to show detailed refresh information */
  showDetails?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Scopes to monitor */
  scopes?: string[];
}

/**
 * Component that displays the current token refresh status
 */
export const TokenRefreshStatus: React.FC<TokenRefreshStatusProps> = ({
  showDetails = false,
  className = "",
  scopes = ["User.Read"],
}) => {
  const { status, getConfig, manualRefresh, isRefreshEnabled } =
    useTokenRefresh({
      scopes,
      onRefreshSuccess: (refreshedScopes) => {
        console.log(
          "Token refreshed successfully for scopes:",
          refreshedScopes,
        );
      },
      onRefreshError: (error, failedScopes) => {
        console.error("Token refresh failed for scopes:", failedScopes, error);
      },
    });

  const config = getConfig();

  const handleManualRefresh = async () => {
    try {
      await manualRefresh();
    } catch (error) {
      console.error("Manual refresh failed:", error);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "Unknown";
    return date.toLocaleTimeString();
  };

  const formatNextRefresh = () => {
    if (!status.nextRefresh) return "Not scheduled";

    const now = new Date();
    const diff = status.nextRefresh.getTime() - now.getTime();
    const minutes = Math.ceil(diff / (1000 * 60));

    if (minutes <= 0) return "Due now";
    if (minutes === 1) return "In 1 minute";
    return `In ${minutes} minutes`;
  };

  const getStatusColor = () => {
    if (!isRefreshEnabled) return "gray";
    if (status.isRefreshing) return "blue";
    if (status.lastError) return "red";
    if (status.refreshCount > 0) return "green";
    return "orange";
  };

  return (
    <div className={`token-refresh-status ${className}`}>
      <div className="refresh-indicator">
        <span
          className={`status-dot status-${getStatusColor()}`}
          title={
            isRefreshEnabled
              ? "Token refresh enabled"
              : "Token refresh disabled"
          }
        />
        <span className="status-text">
          {status.isRefreshing
            ? "Refreshing..."
            : !isRefreshEnabled
              ? "Refresh disabled"
              : status.lastError
                ? "Refresh failed"
                : status.refreshCount > 0
                  ? "Active"
                  : "Initialized"}
        </span>
      </div>

      {showDetails && (
        <div className="refresh-details">
          <div className="config-info">
            <h4>Configuration</h4>
            <p>Interval: {config.refreshInterval} minutes</p>
            <p>Buffer: {config.refreshBuffer} minutes</p>
            <p>Enabled: {config.enabled ? "Yes" : "No"}</p>
          </div>

          <div className="status-info">
            <h4>Status</h4>
            <p>Refresh count: {status.refreshCount}</p>
            <p>Last refresh: {formatTime(status.lastRefresh)}</p>
            <p>Next refresh: {formatNextRefresh()}</p>
            {status.lastError && (
              <p className="error">Error: {status.lastError.message}</p>
            )}
          </div>

          <div className="controls">
            <button
              onClick={handleManualRefresh}
              disabled={status.isRefreshing || !isRefreshEnabled}
              className="refresh-button"
            >
              {status.isRefreshing ? "Refreshing..." : "Refresh Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
