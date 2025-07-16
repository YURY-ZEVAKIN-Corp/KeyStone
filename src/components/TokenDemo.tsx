import React, { useState } from "react";
import { useTokenService } from "../services/useTokenService";
import { useApiService } from "../hooks/useServices";
import styles from "./TokenDemo.module.css";

const TokenDemo: React.FC = () => {
  const tokenService = useTokenService();
  const apiService = useApiService();
  const [profileLoading, setProfileLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [emailData, setEmailData] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAccessToken = async () => {
    if (!tokenService) return;

    try {
      setProfileLoading(true);
      const token = await tokenService.getGraphToken();
      setTokenInfo({ accessToken: token });
      console.log("Access Token:", token);

      // Decode and log token claims
      const claims = tokenService.getTokenClaims(token);
      console.log("Token Claims:", claims);
    } catch (error) {
      console.error("Error getting access token:", error);
      setError("Error getting access token. Check console for details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCallGraphApi = async () => {
    if (!apiService) return;

    try {
      setProfileLoading(true);
      setError(null);
      const userData = await apiService.getUserProfile();
      setProfileData(userData);
      console.log("Graph API Response:", userData);
    } catch (error) {
      console.error("Error calling Graph API:", error);
      setError("Error calling Graph API. Check console for details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCallDemoApi = async () => {
    if (!apiService) return;

    try {
      setEmailLoading(true);
      setError(null);
      // Demo API call - using emails endpoint as example
      const data = await apiService.getUserEmails();
      setEmailData(data);
      console.log("Demo API Response:", data);
    } catch (error) {
      console.error("Error calling demo API:", error);
      setError("Error calling demo API. Check console for details.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleInspectTokens = () => {
    if (!tokenService) return;

    try {
      const idToken = tokenService.getIdToken();

      const tokenInformation = {
        idToken: {
          raw: idToken,
          decoded: idToken ? tokenService.decodeJwtToken(idToken) : null,
        },
      };

      setTokenInfo(tokenInformation);
      console.log("Token Information:", tokenInformation);
    } catch (error) {
      console.error("Error inspecting tokens:", error);
      setError("Error inspecting tokens. Check console for details.");
    }
  };

  const copyTokenToClipboard = () => {
    const token = tokenInfo?.accessToken?.raw || tokenInfo?.idToken?.raw;
    if (token) {
      navigator.clipboard.writeText(token);
      setError("Token copied to clipboard!");
    }
  };

  return (
    <div className={styles.tokenDemo}>
      <h2>JWT Token Demo</h2>
      <p>This demo shows how to retrieve and use JWT tokens for API calls.</p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.demoSection}>
        <h3>1. Get Access Token</h3>
        <button
          onClick={handleGetAccessToken}
          disabled={profileLoading}
          className={styles.demoButton}
        >
          {profileLoading ? "Loading..." : "Get Graph API Token"}
        </button>

        {tokenInfo?.accessToken && (
          <div className={styles.tokenDisplay}>
            <h4>Access Token:</h4>
            <textarea
              value={tokenInfo.accessToken}
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
          disabled={profileLoading}
          className={styles.demoButton}
        >
          {profileLoading ? "Loading..." : "Get My Profile"}
        </button>

        {profileData && (
          <div className={styles.apiResponse}>
            <h4>Graph API Response:</h4>
            <pre>{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>3. Call External API (Demo)</h3>
        <p>Example of calling an external API (emails endpoint)</p>
        <button
          onClick={handleCallDemoApi}
          disabled={emailLoading}
          className={styles.demoButton}
        >
          {emailLoading ? "Loading..." : "Call Demo API"}
        </button>

        {emailData && (
          <div className={styles.apiResponse}>
            <h4>Demo API Response:</h4>
            <pre>{JSON.stringify(emailData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className={styles.demoSection}>
        <h3>4. Inspect Token Information</h3>
        <button onClick={handleInspectTokens} className={styles.demoButton}>
          Inspect Current Tokens
        </button>

        {tokenInfo && (
          <div className={styles.apiResponse}>
            <h4>Token Information:</h4>
            <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
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
