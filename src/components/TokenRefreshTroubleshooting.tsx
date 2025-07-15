import React, { useState } from "react";
import { useTokenService } from "../services/useTokenService";
import { useTokenRefresh } from "../hooks/useTokenRefresh";

/**
 * Token refresh troubleshooting component to help diagnose issues
 */
export const TokenRefreshTroubleshooting: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const tokenService = useTokenService();
  const { status } = useTokenRefresh();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const startTime = Date.now();

    try {
      const config = tokenService.getRefreshConfig();
      const activeAccount = tokenService.getActiveAccount();

      // Test network connectivity to Microsoft endpoints
      const networkTests = await Promise.allSettled([
        fetch("https://login.microsoftonline.com/common/discovery/instance", {
          method: "HEAD",
        }),
        fetch("https://graph.microsoft.com/v1.0/$metadata", { method: "HEAD" }),
      ]);

      // Check if there are any cached tokens
      const cachedTokenInfo = tokenService.getCachedTokenInfo(["User.Read"]);

      // Try a quick token acquisition
      let tokenTestResult = null;
      try {
        const token = await tokenService.getAccessToken(["User.Read"]);
        const claims = tokenService.getTokenClaims(token);
        tokenTestResult = {
          success: true,
          tokenLength: token.length,
          expiry: claims?.exp ? new Date(claims.exp * 1000) : null,
          timeToAcquire: Date.now() - startTime,
        };
      } catch (error) {
        tokenTestResult = {
          success: false,
          error: (error as Error).message,
          timeToFail: Date.now() - startTime,
        };
      }

      setDiagnostics({
        timestamp: new Date(),
        config,
        activeAccount: activeAccount
          ? {
              username: activeAccount.username,
              name: activeAccount.name,
              tenantId: activeAccount.tenantId,
              homeAccountId: activeAccount.homeAccountId,
            }
          : null,
        networkTests: {
          loginEndpoint:
            networkTests[0].status === "fulfilled"
              ? "✅ Reachable"
              : "❌ Not reachable",
          graphEndpoint:
            networkTests[1].status === "fulfilled"
              ? "✅ Reachable"
              : "❌ Not reachable",
        },
        cachedTokenInfo,
        tokenTestResult,
        refreshStatus: status,
        totalDiagnosticTime: Date.now() - startTime,
      });
    } catch (error) {
      setDiagnostics({
        timestamp: new Date(),
        error: (error as Error).message,
        totalDiagnosticTime: Date.now() - startTime,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Token Refresh Troubleshooting</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: isRunning ? "#f0f0f0" : "#007acc",
            color: isRunning ? "#666" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "🔄 Running Diagnostics..." : "🔍 Run Diagnostics"}
        </button>
      </div>

      {diagnostics && (
        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <h3 style={{ fontFamily: "sans-serif", marginTop: 0 }}>
            Diagnostic Results
          </h3>
          <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: "30px", fontSize: "14px" }}>
        <h3>Common Issues & Solutions</h3>
        <ul>
          <li>
            <strong>Long wait times:</strong> Check network connectivity to
            Microsoft endpoints
          </li>
          <li>
            <strong>Timeout errors:</strong> Increase
            REACT_APP_TOKEN_REFRESH_TIMEOUT in .env file
          </li>
          <li>
            <strong>Interactive auth required:</strong> Token may have expired,
            try logging out and back in
          </li>
          <li>
            <strong>No active account:</strong> User needs to sign in first
          </li>
          <li>
            <strong>Network unreachable:</strong> Check firewall/proxy settings
          </li>
        </ul>
      </div>
    </div>
  );
};
