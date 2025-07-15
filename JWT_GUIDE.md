# JWT Token Retrieval and API Calls Guide

This guide explains how to retrieve and use JWT tokens from Microsoft Entra ID for making authenticated API calls in your React TypeScript application.

## 🔐 Token Types

### 1. **Access Token**

- Used for API calls
- Contains scopes/permissions
- Short-lived (typically 1 hour)
- Must be included in API request headers

### 2. **ID Token**

- Contains user identity information
- Used for authentication verification
- Contains user claims (name, email, etc.)
- Should not be sent to external APIs

### 3. **Refresh Token**

- Used to obtain new access tokens
- Managed automatically by MSAL
- Long-lived

## � Automatic Token Refresh

### Configuration

The application now supports automatic token refresh with configurable intervals. Set these environment variables in your `.env` file:

```bash
# Token refresh interval in minutes (default: 45)
REACT_APP_TOKEN_REFRESH_INTERVAL=45

# Buffer time before expiry to trigger refresh in minutes (default: 5)
REACT_APP_TOKEN_REFRESH_BUFFER=5

# Enable/disable automatic refresh (default: true)
REACT_APP_ENABLE_TOKEN_REFRESH=true
```

### Using Token Refresh Hook

```typescript
import { useTokenRefresh } from '../hooks/useTokenRefresh';

const MyComponent = () => {
  const {
    status,
    manualRefresh,
    scheduleRefresh,
    getConfig
  } = useTokenRefresh({
    scopes: ['User.Read'],
    onRefreshSuccess: (scopes) => {
      console.log('Token refreshed for:', scopes);
    },
    onRefreshError: (error, scopes) => {
      console.error('Refresh failed:', error);
    },
  });

  return (
    <div>
      <p>Refresh Count: {status.refreshCount}</p>
      <p>Last Refresh: {status.lastRefresh?.toLocaleTimeString()}</p>
      <button onClick={() => manualRefresh()}>
        Manual Refresh
      </button>
    </div>
  );
};
```

### Token Refresh Status Component

Display refresh status in your UI:

```typescript
import { TokenRefreshStatus } from '../components/TokenRefreshStatus';

const MyComponent = () => (
  <TokenRefreshStatus
    showDetails={true}
    scopes={['User.Read', 'Mail.Read']}
  />
);
```

### Enhanced Token Service

The TokenService now includes automatic refresh scheduling:

```typescript
import { useTokenService } from "../services/useTokenService";

const MyComponent = () => {
  const tokenService = useTokenService();

  const handleGetToken = async () => {
    // Automatically schedules refresh when getting tokens
    const token = await tokenService.getAccessToken(["User.Read"]);

    // Check if token should be refreshed
    if (tokenService.shouldRefreshToken(token)) {
      await tokenService.refreshToken(["User.Read"]);
    }
  };
};
```

## �🛠️ Implementation

### Token Service Setup

```typescript
import { useTokenService } from "./tokenService";

const MyComponent = () => {
  const tokenService = useTokenService();

  // Get access token for specific scopes
  const getToken = async () => {
    try {
      const token = await tokenService.getAccessToken(["User.Read"]);
      console.log("Access Token:", token);
    } catch (error) {
      console.error("Token acquisition failed:", error);
    }
  };
};
```

### Making API Calls

#### Method 1: Using the API Service Hook

```typescript
import { useApiService } from "./apiService";

const MyComponent = () => {
  const apiService = useApiService("https://your-api.com/api");

  const fetchData = async () => {
    try {
      // Automatically handles token acquisition and headers
      const data = await apiService.get("/users", ["your-scope"]);
      console.log(data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
};
```

#### Method 2: Manual Fetch with Token

```typescript
import { useTokenService } from "./tokenService";

const MyComponent = () => {
  const tokenService = useTokenService();

  const manualApiCall = async () => {
    try {
      // Get token
      const token = await tokenService.getAccessToken(["your-scope"]);

      // Create headers
      const headers = tokenService.createAuthHeader(token);

      // Make API call
      const response = await fetch("https://your-api.com/api/data", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
};
```

#### Method 3: Microsoft Graph API

```typescript
import { useGraphApi } from "./apiService";

const MyComponent = () => {
  const { getUserProfile, loading, error } = useGraphApi();

  const handleGetProfile = async () => {
    try {
      const profile = await getUserProfile();
      console.log("User Profile:", profile);
    } catch (error) {
      console.error("Graph API call failed:", error);
    }
  };
};
```

## 🔧 Configuration

### Scopes Configuration

Update `src/authConfig.ts` to include your API scopes:

```typescript
export const apiScopes = {
  // For Microsoft Graph API
  graphApi: {
    scopes: ["User.Read", "User.ReadBasic.All", "Mail.Read"],
  },

  // For your custom API
  customApi: {
    scopes: ["api://your-api-client-id/access_as_user"],
  },

  // For other Microsoft services
  officeApi: {
    scopes: ["https://graph.microsoft.com/Files.Read"],
  },
};
```

### Azure App Registration Settings

1. **API Permissions**: Add the required scopes in Azure portal
2. **Expose an API**: If you have a custom API, expose it and define scopes
3. **Authentication**: Ensure your redirect URIs are configured

## 📝 Common Patterns

### Error Handling

```typescript
const makeApiCall = async () => {
  try {
    const data = await apiService.get("/data");
    return data;
  } catch (error) {
    if (error.message.includes("401")) {
      // Token expired or invalid
      console.log("Authentication required");
    } else if (error.message.includes("403")) {
      // Insufficient permissions
      console.log("Access denied");
    } else {
      // Other errors
      console.error("API call failed:", error);
    }
    throw error;
  }
};
```

### Token Inspection

```typescript
import { useTokenInspector } from './apiService';

const TokenDebugComponent = () => {
  const { tokenInfo, inspectCurrentTokens } = useTokenInspector();

  const handleInspect = async () => {
    await inspectCurrentTokens();
    console.log('Token Info:', tokenInfo);
  };

  return (
    <button onClick={handleInspect}>
      Inspect Tokens
    </button>
  );
};
```

### Conditional API Calls

```typescript
const ConditionalApiComponent = () => {
  const { isAuthenticated } = useAuth();
  const apiService = useApiService();

  const fetchData = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated");
      return;
    }

    try {
      const data = await apiService.get("/protected-data");
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
};
```

## 🚀 Best Practices

### 1. **Token Caching**

- MSAL automatically caches tokens
- Use silent token acquisition when possible
- Handle `InteractionRequiredAuthError` gracefully

### 2. **Error Handling**

```typescript
try {
  const token = await tokenService.getAccessToken(scopes);
} catch (error) {
  if (error instanceof InteractionRequiredAuthError) {
    // User interaction required
    const token = await tokenService.getAccessTokenInteractive(scopes);
  } else {
    // Other errors
    console.error("Token acquisition failed:", error);
  }
}
```

### 3. **Security**

- Never log full tokens in production
- Don't store tokens in localStorage
- Use HTTPS for all API calls
- Validate tokens on the server side

### 4. **Performance**

- Cache API responses when appropriate
- Use silent token acquisition
- Batch API calls when possible

## 🔍 Debugging

### Enable MSAL Logging

```typescript
// In authConfig.ts
import { LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  // ...existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(`[MSAL] ${message}`);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};
```

### Common Issues

1. **"User account does not exist"**
   - Check tenant ID in authority URL
   - Verify user has access to the application

2. **"AADSTS65001: Consent required"**
   - Add required scopes to app registration
   - Grant admin consent if needed

3. **"CORS Error"**
   - Ensure redirect URI is correctly configured
   - Check if using correct authority

4. **"Invalid audience"**
   - Verify client ID in configuration
   - Check if token is for correct audience

5. **Token refresh failing**
   - Check if refresh is enabled in configuration
   - Verify user is still authenticated
   - Check browser console for MSAL errors
   - Ensure sufficient permissions for silent token acquisition

### Monitoring Token Refresh

Enable detailed logging to monitor refresh behavior:

```typescript
// Add to your component to monitor refresh events
const { status } = useTokenRefresh({
  scopes: ["User.Read"],
  onRefreshSuccess: (scopes) => {
    console.log(
      `✅ [${new Date().toISOString()}] Token refreshed successfully for scopes: ${scopes.join(", ")}`,
    );
  },
  onRefreshError: (error, scopes) => {
    console.error(
      `❌ [${new Date().toISOString()}] Token refresh failed for scopes: ${scopes.join(", ")}`,
      error,
    );
  },
});

// Check refresh status
console.log("Refresh status:", {
  isRefreshing: status.isRefreshing,
  refreshCount: status.refreshCount,
  lastRefresh: status.lastRefresh,
  nextRefresh: status.nextRefresh,
  lastError: status.lastError?.message,
});
```

## 📚 Additional Resources

- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
