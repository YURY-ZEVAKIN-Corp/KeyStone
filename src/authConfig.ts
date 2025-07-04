import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: "25673ed4-bdc5-4927-9879-9a55ec5cea0a", // Replace with your app registration client ID
    authority: "https://login.microsoftonline.com/d5981ff9-f284-4a8a-a91f-dba42e991bca", // Replace with your tenant ID or use "common" for multi-tenant
    redirectUri: "https://lemon-field-009e4a910.2.azurestaticapps.net", // This should match your app registration redirect URI
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
