import React, { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";
import Login from "./Login";
import { FormModalProvider } from "./FormModalProvider";
import ToastProvider from "./ToastProvider";
import WaitingProvider from "./WaitingProvider";
import { initializeServices } from "../services";
import styles from "./App.module.css";

/**
 * App is the root component that sets up MSAL authentication context and renders the main application UI.
 *
 * @remarks
 * - Uses functional components and hooks as per project standards.
 * - Applies accessibility best practices (role="main").
 * - Initializes singleton services on startup using the service registry pattern.
 * - Consider migrating to CSS modules for better style encapsulation.
 */
// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const ServiceInitializer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { instance } = useMsal();
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    const initServices = async () => {
      try {
        await initializeServices(instance);
        setServicesInitialized(true);
      } catch (error) {
        console.error("Failed to initialize services:", error);
        // Still set to true to allow app to render with limited functionality
        setServicesInitialized(true);
      }
    };

    initServices();
  }, [instance]);

  if (!servicesInitialized) {
    return (
      <div className={styles.App} role="main">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Initializing services...</h2>
          <p>
            Please wait while the application services are being initialized.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <ToastProvider>
      <WaitingProvider>
        <FormModalProvider>
          <div className={styles.App} role="main">
            <Login />
          </div>
        </FormModalProvider>
      </WaitingProvider>
    </ToastProvider>
  );
};

const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ServiceInitializer>
        <AppContent />
      </ServiceInitializer>
    </MsalProvider>
  );
};

export default App;
