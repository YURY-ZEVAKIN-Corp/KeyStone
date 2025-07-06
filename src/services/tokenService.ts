import { 
  IPublicClientApplication, 
  AccountInfo, 
  SilentRequest,
  InteractionRequiredAuthError
} from '@azure/msal-browser';
import { apiScopes } from '../authConfig';

export class TokenService {
  private msalInstance: IPublicClientApplication;

  constructor(msalInstance: IPublicClientApplication) {
    this.msalInstance = msalInstance;
  }

  /**
   * Get access token silently (preferred method)
   * Falls back to interactive authentication if silent fails
   */
  async getAccessToken(scopes: string[], account?: AccountInfo): Promise<string> {
    try {
      const activeAccount = account || this.msalInstance.getActiveAccount();
      
      if (!activeAccount) {
        throw new Error('No active account found');
      }

      const silentRequest: SilentRequest = {
        scopes: scopes,
        account: activeAccount,
      };

      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to interactive authentication
        console.log('Silent token acquisition failed, falling back to interactive');
        return this.getAccessTokenInteractive(scopes);
      }
      throw error;
    }
  }

  /**
   * Get access token using interactive authentication (popup)
   */
  async getAccessTokenInteractive(scopes: string[]): Promise<string> {
    try {
      const response = await this.msalInstance.acquireTokenPopup({
        scopes: scopes,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Interactive token acquisition failed:', error);
      throw error;
    }
  }

  /**
   * Get token for Microsoft Graph API calls
   */
  async getGraphToken(): Promise<string> {
    return this.getAccessToken(apiScopes.graphApi.scopes);
  }

  /**
   * Get token for custom API calls
   */
  async getCustomApiToken(): Promise<string> {
    return this.getAccessToken(apiScopes.customApi.scopes);
  }

  /**
   * Get ID token (contains user claims)
   */
  getIdToken(): string | null {
    const activeAccount = this.msalInstance.getActiveAccount();
    return activeAccount?.idToken || null;
  }

  /**
   * Decode JWT token (client-side only, don't use for validation)
   */
  decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired (client-side check only)
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeJwtToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token claims/information
   */
  getTokenClaims(token: string): any {
    return this.decodeJwtToken(token);
  }

  /**
   * Create authorization header for API calls
   */
  createAuthHeader(token: string): { [key: string]: string } {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
}




