# Token Refresh Implementation Guide

## Overview

The JWT token refresh functionality has been successfully implemented with the following features:

- ✅ **Configurable refresh intervals** via environment variables
- ✅ **Automatic token refresh scheduling** based on token expiry
- ✅ **Silent token acquisition** with fallback to interactive auth
- ✅ **Token caching** to avoid unnecessary requests
- ✅ **Event-driven refresh monitoring** with React hooks
- ✅ **Manual refresh capabilities** for immediate token updates
- ✅ **Error handling and retry logic** with exponential backoff
- ✅ **Visual status indicators** and detailed monitoring UI

## Configuration

### Environment Variables (`.env`)

```bash
# Token refresh interval in minutes (default: 45)
REACT_APP_TOKEN_REFRESH_INTERVAL=45

# Buffer time before expiry to trigger refresh in minutes (default: 5)
REACT_APP_TOKEN_REFRESH_BUFFER=5

# Enable/disable automatic refresh (default: true)
REACT_APP_ENABLE_TOKEN_REFRESH=true
```

### How It Works

1. **Automatic Scheduling**: When you request a token using `getAccessToken()`, the service automatically schedules a refresh based on your configured interval.

2. **Smart Refresh Timing**: Tokens are refreshed `REACT_APP_TOKEN_REFRESH_BUFFER` minutes before they expire, ensuring you always have valid tokens.

3. **Silent First**: The system attempts silent token acquisition first, falling back to interactive auth only when necessary.

4. **Event-Driven**: Components can listen to refresh events (success, error, scheduled) to update their UI accordingly.

## Usage Examples

### Basic Token Retrieval (Auto-Refresh Enabled)

```typescript
import { useTokenService } from "../services/useTokenService";

const MyComponent = () => {
  const tokenService = useTokenService();

  const fetchData = async () => {
    try {
      // This automatically schedules refresh if not already scheduled
      const token = await tokenService.getAccessToken(["User.Read"]);

      // Use token for API calls...
      const response = await fetch("/api/data", {
        headers: tokenService.createAuthHeader(token),
      });
    } catch (error) {
      console.error("Token acquisition failed:", error);
    }
  };
};
```

### Monitoring Refresh Status

```typescript
import { useTokenRefresh } from '../hooks/useTokenRefresh';

const TokenMonitor = () => {
  const { status, manualRefresh } = useTokenRefresh({
    scopes: ['User.Read', 'Mail.Read'],
    onRefreshSuccess: (scopes) => {
      console.log('✅ Tokens refreshed:', scopes);
    },
    onRefreshError: (error, scopes) => {
      console.error('❌ Refresh failed:', error);
    },
  });

  return (
    <div>
      <p>Status: {status.isRefreshing ? 'Refreshing...' : 'Ready'}</p>
      <p>Refresh Count: {status.refreshCount}</p>
      <p>Last Refresh: {status.lastRefresh?.toLocaleTimeString()}</p>
      <button onClick={() => manualRefresh()}>
        Manual Refresh
      </button>
    </div>
  );
};
```

### Using the Status Component

```typescript
import { TokenRefreshStatus } from '../components/TokenRefreshStatus';

const MyApp = () => (
  <div>
    <h1>My Application</h1>

    {/* Simple status indicator */}
    <TokenRefreshStatus scopes={['User.Read']} />

    {/* Detailed status with controls */}
    <TokenRefreshStatus
      showDetails={true}
      scopes={['User.Read', 'Mail.Read']}
    />
  </div>
);
```

## Navigation

The token refresh demo has been added to your Dashboard navigation:

- Go to **Dashboard → Token Refresh** to see the full demo
- The demo includes:
  - Real-time refresh status monitoring
  - Manual refresh controls
  - Configuration display
  - Token information viewer
  - Activity logs

## Key Features

### 1. **Smart Scheduling**

- Automatically calculates optimal refresh times
- Accounts for token expiry and configured buffer time
- Handles multiple token scopes independently

### 2. **Error Resilience**

- Exponential backoff for failed refresh attempts
- Graceful fallback to interactive authentication
- Comprehensive error reporting and logging

### 3. **Performance Optimization**

- Token caching to reduce redundant requests
- Silent token acquisition for seamless UX
- Minimal overhead when refresh is disabled

### 4. **Developer Experience**

- React hooks for easy integration
- Event-driven architecture for reactive UIs
- Comprehensive TypeScript support
- Visual components for monitoring

## Best Practices

1. **Set appropriate refresh intervals**: Balance security with performance. 45 minutes is a good default.

2. **Monitor refresh events**: Use the provided hooks to handle refresh success/failure in your application.

3. **Handle offline scenarios**: The system will automatically retry when connection is restored.

4. **Test different configurations**: Use the demo page to experiment with different settings.

5. **Enable logging in development**: Set MSAL logging to verbose to debug issues.

## Troubleshooting

1. **Tokens not refreshing**: Check if `REACT_APP_ENABLE_TOKEN_REFRESH=true` in your `.env` file.

2. **Frequent refresh failures**: Verify your app registration has the correct permissions and consent.

3. **Performance issues**: Consider increasing the refresh interval or disabling refresh for non-critical scopes.

4. **Silent acquisition failing**: Ensure users haven't been idle beyond the session timeout.

## Security Considerations

- Tokens are refreshed in memory only, never persisted to localStorage
- Failed interactive authentication doesn't compromise security
- All refresh operations respect MSAL's built-in security policies
- Refresh intervals should align with your organization's security requirements

The implementation follows Microsoft's recommended practices for token lifecycle management and provides a robust foundation for production applications.
