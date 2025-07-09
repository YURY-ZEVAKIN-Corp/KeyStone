import { useMsal } from "@azure/msal-react";
import { useMemo } from "react";
import { TokenService } from "./tokenService";

// Hook for using token service in React components
export const useTokenService = () => {
  const { instance } = useMsal();

  const tokenService = useMemo(() => new TokenService(instance), [instance]);

  return tokenService;
};
