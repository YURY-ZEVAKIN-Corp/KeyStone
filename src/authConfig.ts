import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration using environment variables
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID || "", // Set in CI/CD or .env
    authority: process.env.REACT_APP_MSAL_AUTHORITY || "", // Set in CI/CD or .env
    redirectUri:
      process.env.REACT_APP_MSAL_REDIRECT_URI || window.location.origin, // Set in CI/CD or .env
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft Graph API endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

// API-specific token requests
export const apiScopes = {
  // For Microsoft Graph API calls
  graphApi: {
    scopes: ["User.Read", "User.ReadBasic.All", "Mail.Read"],
  },

  // For your custom API (replace with your API's scope)
  customApi: {
    scopes: ["api://your-api-client-id/access_as_user"],
  },

  // For accessing other Microsoft services
  officeApi: {
    scopes: [
      "https://graph.microsoft.com/Files.Read",
      "https://graph.microsoft.com/Calendars.Read",
    ],
  },
};

// Silent token request configuration
export const silentRequest = {
  scopes: ["User.Read"],
  account: null as any, // Will be set dynamically
};
