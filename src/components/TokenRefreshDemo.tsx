import React, { useState } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { useTokenService } from "../services/useTokenService";
import { TokenRefreshStatus } from "./TokenRefreshStatus";
import { apiScopes } from "../authConfig";

/**
 * Demo component showing token refresh functionality
 */
export const TokenRefreshDemo: React.FC = () => {
  const [selectedScopes, setSelectedScopes] = useState<string[]>(
    apiScopes.graphApi.scopes,
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const tokenService = useTokenService();

  const { status, manualRefresh, scheduleRefresh, getConfig, updateConfig } =
    useTokenRefresh({
      scopes: selectedScopes,
      onRefreshSuccess: (scopes) => {
        addLog(
          `✅ Token refreshed successfully for scopes: ${scopes.join(", ")}`,
        );
      },
      onRefreshError: (error, scopes) => {
        addLog(
          `❌ Token refresh failed for scopes: ${scopes.join(", ")} - ${error.message}`,
        );
      },
    });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const handleGetToken = async () => {
    try {
      addLog(`🔄 Requesting token for scopes: ${selectedScopes.join(", ")}`);
      const token = await tokenService.getAccessToken(selectedScopes);

      // Get token info
      const claims = tokenService.getTokenClaims(token);
      const isExpired = tokenService.isTokenExpired(token);
      const shouldRefresh = tokenService.shouldRefreshToken(token);

      setTokenInfo({
        scopes: claims?.scp || claims?.scope || "Unknown",
        expiry: new Date(claims?.exp * 1000).toLocaleString(),
        issuer: claims?.iss,
        audience: claims?.aud,
        isExpired,
        shouldRefresh,
        tokenLength: token.length,
      });

      addLog(`✅ Token acquired successfully (${token.length} chars)`);
    } catch (error: any) {
      addLog(`❌ Failed to get token: ${error.message}`);
    }
  };

  const handleManualRefresh = async () => {
    try {
      addLog(
        `🔄 Manual refresh triggered for scopes: ${selectedScopes.join(", ")}`,
      );
      await manualRefresh();
    } catch (error: any) {
      addLog(`❌ Manual refresh failed: ${error.message}`);
    }
  };

  const handleScheduleRefresh = () => {
    scheduleRefresh();
    addLog(`📅 Refresh scheduled for scopes: ${selectedScopes.join(", ")}`);
  };

  const handleUpdateConfig = () => {
    const newInterval = prompt(
      "Enter new refresh interval (minutes):",
      String(getConfig().refreshInterval),
    );
    if (newInterval && !isNaN(Number(newInterval))) {
      updateConfig({ refreshInterval: Number(newInterval) });
      addLog(`⚙️ Refresh interval updated to ${newInterval} minutes`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const config = getConfig();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Token Refresh Demo</h2>

      {/* Configuration Display */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "16px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}
      >
        <h3>Current Configuration</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <strong>Refresh Interval:</strong> {config.refreshInterval} minutes
          </div>
          <div>
            <strong>Refresh Buffer:</strong> {config.refreshBuffer} minutes
          </div>
          <div>
            <strong>Enabled:</strong> {config.enabled ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Token Refresh Status */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Refresh Status</h3>
        <TokenRefreshStatus showDetails={true} scopes={selectedScopes} />
      </div>

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Scope Selection */}
        <div>
          <h3>Scope Selection</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="radio"
                name="scopes"
                checked={selectedScopes === apiScopes.graphApi.scopes}
                onChange={() => setSelectedScopes(apiScopes.graphApi.scopes)}
              />
              Graph API Scopes
            </label>
            <label style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="radio"
                name="scopes"
                checked={selectedScopes === apiScopes.customApi.scopes}
                onChange={() => setSelectedScopes(apiScopes.customApi.scopes)}
              />
              Custom API Scopes
            </label>
            <label style={{ display: "block" }}>
              <input
                type="radio"
                name="scopes"
                checked={selectedScopes === apiScopes.officeApi.scopes}
                onChange={() => setSelectedScopes(apiScopes.officeApi.scopes)}
              />
              Office API Scopes
            </label>
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Selected: {selectedScopes.join(", ")}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3>Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={handleGetToken}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Get Token
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={status.isRefreshing}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              {status.isRefreshing ? "Refreshing..." : "Manual Refresh"}
            </button>
            <button
              onClick={handleScheduleRefresh}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Schedule Refresh
            </button>
            <button
              onClick={handleUpdateConfig}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Update Config
            </button>
          </div>
        </div>
      </div>

      {/* Token Information */}
      {tokenInfo && (
        <div
          style={{
            background: "#e8f5e8",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #c3e6c3",
          }}
        >
          <h3>Latest Token Information</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <strong>Scopes:</strong> {tokenInfo.scopes}
            </div>
            <div>
              <strong>Expires:</strong> {tokenInfo.expiry}
            </div>
            <div>
              <strong>Issuer:</strong> {tokenInfo.issuer}
            </div>
            <div>
              <strong>Audience:</strong> {tokenInfo.audience}
            </div>
            <div>
              <strong>Is Expired:</strong> {tokenInfo.isExpired ? "Yes" : "No"}
            </div>
            <div>
              <strong>Should Refresh:</strong>{" "}
              {tokenInfo.shouldRefresh ? "Yes" : "No"}
            </div>
            <div>
              <strong>Token Length:</strong> {tokenInfo.tokenLength} chars
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3>Activity Logs</h3>
          <button
            onClick={clearLogs}
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            Clear Logs
          </button>
        </div>
        <div
          style={{
            background: "#000",
            color: "#0f0",
            padding: "16px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "12px",
            height: "300px",
            overflowY: "auto",
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "#666" }}>No activity logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: "4px" }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
