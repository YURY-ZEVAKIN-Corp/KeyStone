import { ServiceRegistry } from "./ServiceRegistry";
import { createFormService } from "./FormService";
import { createWaitingService } from "./WaitingService";
import { createToastService } from "./ToastService";
import { createPageService } from "./PageService";
import { createApiService } from "./apiService";
import { createTokenService } from "./tokenService";
import { IPublicClientApplication } from "@azure/msal-browser";

/**
 * Initialize and register all application services
 * This should be called once during application startup
 */
export async function initializeServices(msalInstance: IPublicClientApplication): Promise<void> {
  console.log("Initializing application services...");

  // Register TokenService first (other services may depend on it)
  const tokenService = ServiceRegistry.registerService("TokenService", () =>
    createTokenService(msalInstance),
  );

  // Register all other services
  const waitingService = ServiceRegistry.registerService(
    "WaitingService",
    createWaitingService,
  );
  const toastService = ServiceRegistry.registerService(
    "ToastService",
    createToastService,
  );
  const formService = ServiceRegistry.registerService(
    "FormService",
    createFormService,
  );
  const pageService = ServiceRegistry.registerService(
    "PageService",
    createPageService,
  );
  const apiService = ServiceRegistry.registerService("ApiService", () =>
    createApiService(),
  );

  // Set up service event listeners for debugging (optional)
  if (process.env.NODE_ENV === "development") {
    ServiceRegistry.on("service:registered", (serviceName, service) => {
      console.log(`✅ Service registered: ${serviceName}`);
    });

    ServiceRegistry.on("service:initialized", (serviceName, service) => {
      console.log(`🚀 Service initialized: ${serviceName}`);
    });

    ServiceRegistry.on("registry:ready", () => {
      console.log("🎉 All services are ready!");
      console.log("Service registry stats:", ServiceRegistry.getStats());
    });
  }

  // Initialize all services
  await ServiceRegistry.initializeAll();

  console.log("✅ All services initialized successfully");
}

/**
 * Get all registered services for easy access
 * @returns Object containing all registered services
 */
export function getServices() {
  return {
    waitingService: ServiceRegistry.requireService("WaitingService"),
    toastService: ServiceRegistry.requireService("ToastService"),
    formService: ServiceRegistry.requireService("FormService"),
    pageService: ServiceRegistry.requireService("PageService"),
    apiService: ServiceRegistry.requireService("ApiService"),
  };
}

/**
 * Dispose all services (useful for cleanup during testing or app shutdown)
 */
export async function disposeServices(): Promise<void> {
  console.log("Disposing all services...");
  await ServiceRegistry.disposeAll();
  console.log("✅ All services disposed");
}

// Export the service registry for direct access if needed
export { ServiceRegistry };
