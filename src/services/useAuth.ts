import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (accounts.length > 0) {
      // Set the active account for MSAL instance
      instance.setActiveAccount(accounts[0]);
      setIsAuthenticated(true);
      setUser(accounts[0]);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, [accounts, instance]);

  const login = async () => {
    try {
      setIsLoading(true);
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await instance.logoutPopup();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };
};
