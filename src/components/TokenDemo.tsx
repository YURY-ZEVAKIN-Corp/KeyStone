import React, { useState } from "react";
import { useTokenService } from "../services/useTokenService";
import { useGraphApi, useTokenInspector } from "../services/apiService";
import styles from "./tokenDemo.module.css";

const TokenDemo: React.FC = () => {
  const tokenService = useTokenService();
  const graphApi = useGraphApi();
  const tokenInspector = useTokenInspector();

  const [accessToken, setAccessToken] = useState<string>("");
  const [graphData, setGraphData] = useState<any>(null);
  const [demoApiData, setDemoApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAccessToken = async () => {
    try {
      setLoading(true);
      const token = await tokenService.getGraphToken();
      setAccessToken(token);
      console.log("Access Token:", token);

      // Decode and log token claims
      const claims = tokenService.getTokenClaims(token);
      console.log("Token Claims:", claims);
    } catch (error) {
      console.error("Error getting access token:", error);
      alert("Error getting access token. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCallGraphApi = async () => {
    try {
      setLoading(true);
      const userData = await graphApi.getUserProfile();
      setGraphData(userData);
      console.log("Graph API Response:", userData);
    } catch (error) {
      console.error("Error calling Graph API:", error);
      alert("Error calling Graph API. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCallDemoApi = async () => {
    try {
      setLoading(true);
      // This will fail gracefully since jsonplaceholder doesn't expect auth
      // but demonstrates how to make authenticated calls to your APIs
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
      );
      const data = await response.json();
      setDemoApiData(data);
      console.log("Demo API Response:", data);
    } catch (error) {
      console.error("Error calling demo API:", error);
      alert("Error calling demo API. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectTokens = () => {
    tokenInspector.inspectCurrentTokens();
  };

  const copyTokenToClipboard = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      alert("Token copied to clipboard!");
    }
  };

  return (
    <div className={styles.tokenDemo}>
      <h2>JWT Token Demo</h2>
      <p>This demo shows how to retrieve and use JWT tokens for API calls.</p>

      <div className={styles.demoSection}>
        <h3>1. Get Access Token</h3>
        <button
          onClick={handleGetAccessToken}
          disabled={loading}
          className={styles.demoButton}
        >
          {loading ? "Loading..." : "Get Graph API Token"}
        </button>

        {accessToken && (
          <div className={styles.tokenDisplay}>
            <h4>Access Token:</h4>
            <textarea
              value={accessToken}
              readOnly
              rows={4}
              className={styles.tokenTextarea}
            />
            <button
              onClick={copyTokenToClipboard}
              className={styles.copyButton}
            >
              Copy Token
            </button>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>2. Call Microsoft Graph API</h3>
        <button
          onClick={handleCallGraphApi}
          disabled={loading}
          className={styles.demoButton}
        >
          {loading ? "Loading..." : "Get My Profile"}
        </button>

        {graphData && (
          <div className={styles.apiResponse}>
            <h4>Graph API Response:</h4>
            <pre>{JSON.stringify(graphData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>3. Call External API (Demo)</h3>
        <p>
          Example of calling an external API (this one doesn't require auth)
        </p>
        <button
          onClick={handleCallDemoApi}
          disabled={loading}
          className={styles.demoButton}
        >
          {loading ? "Loading..." : "Call Demo API"}
        </button>

        {demoApiData && (
          <div className={styles.apiResponse}>
            <h4>Demo API Response:</h4>
            <pre>{JSON.stringify(demoApiData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>4. Inspect Token Information</h3>
        <button onClick={handleInspectTokens} className={styles.demoButton}>
          Inspect Current Tokens
        </button>

        {tokenInspector.tokenInfo && (
          <div className={styles.apiResponse}>
            <h4>Token Information:</h4>
            <pre>{JSON.stringify(tokenInspector.tokenInfo, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>5. Code Examples</h3>
        <div className={styles.codeExample}>
          <h4>Getting an Access Token:</h4>
          <pre>{`
const tokenService = useTokenService();
const token = await tokenService.getGraphToken();
          `}</pre>
        </div>

        <div className={styles.codeExample}>
          <h4>Making an Authenticated API Call:</h4>
          <pre>{`
const apiService = useApiService('https://your-api.com');
const data = await apiService.get('/users', ['your-scope']);
          `}</pre>
        </div>

        <div className={styles.codeExample}>
          <h4>Manual API Call with Token:</h4>
          <pre>{`
const token = await tokenService.getAccessToken(['your-scope']);
const headers = tokenService.createAuthHeader(token);

const response = await fetch('https://your-api.com/data', {
  headers,
});
          `}</pre>
        </div>
      </div>
    </div>
  );
};

export default TokenDemo;
