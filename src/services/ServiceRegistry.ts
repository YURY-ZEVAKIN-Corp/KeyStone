import { EventEmitter } from "../utils/EventEmitter";

// Base interface for all services in the registry
export interface IService extends EventEmitter {
  readonly serviceName: string;
  initialize?(): Promise<void> | void;
  dispose?(): Promise<void> | void;
}

// Service registry events
export interface ServiceRegistryEvents {
  "service:registered": (serviceName: string, service: IService) => void;
  "service:unregistered": (serviceName: string) => void;
  "service:initialized": (serviceName: string, service: IService) => void;
  "service:disposed": (serviceName: string) => void;
  "registry:ready": () => void;
}

/**
 * Singleton Service Registry with Event Emitter support
 * Manages all application services as singletons
 */
class ServiceRegistryClass extends EventEmitter {
  private services: Map<string, IService> = new Map();
  private initializationPromises: Map<string, Promise<void>> = new Map();
  private isReady = false;

  /**
   * Register a service in the registry
   * @param serviceName - Unique name for the service
   * @param serviceFactory - Factory function that creates the service instance
   * @returns The service instance
   */
  registerService<T extends IService>(
    serviceName: string,
    serviceFactory: () => T,
  ): T {
    if (this.services.has(serviceName)) {
      console.warn(
        `Service ${serviceName} is already registered. Returning existing instance.`,
      );
      return this.services.get(serviceName) as T;
    }

    const service = serviceFactory();

    // Ensure the service has the required serviceName property
    if (!service.serviceName) {
      (service as any).serviceName = serviceName;
    }

    this.services.set(serviceName, service);
    this.emit("service:registered", serviceName, service);

    // Auto-initialize if the service has an initialize method
    if (service.initialize) {
      this.initializeService(serviceName);
    }

    return service;
  }

  /**
   * Get a service by name
   * @param serviceName - Name of the service to retrieve
   * @returns The service instance or undefined if not found
   */
  getService<T extends IService>(serviceName: string): T | undefined {
    return this.services.get(serviceName) as T | undefined;
  }

  /**
   * Get a service by name with type assertion
   * @param serviceName - Name of the service to retrieve
   * @returns The service instance
   * @throws Error if service not found
   */
  requireService<T extends IService>(serviceName: string): T {
    const service = this.getService<T>(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in registry`);
    }
    return service;
  }

  /**
   * Check if a service is registered
   * @param serviceName - Name of the service to check
   * @returns True if the service is registered
   */
  hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Initialize a specific service
   * @param serviceName - Name of the service to initialize
   * @returns Promise that resolves when initialization is complete
   */
  async initializeService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Return existing initialization promise if already initializing
    if (this.initializationPromises.has(serviceName)) {
      return this.initializationPromises.get(serviceName);
    }

    if (!service.initialize) {
      return; // Service doesn't need initialization
    }

    const initPromise = Promise.resolve(service.initialize()).then(() => {
      this.emit("service:initialized", serviceName, service);
      this.initializationPromises.delete(serviceName);
    });

    this.initializationPromises.set(serviceName, initPromise);
    return initPromise;
  }

  /**
   * Initialize all registered services
   * @returns Promise that resolves when all services are initialized
   */
  async initializeAll(): Promise<void> {
    const initPromises = Array.from(this.services.keys()).map((serviceName) =>
      this.initializeService(serviceName),
    );

    await Promise.all(initPromises);
    this.isReady = true;
    this.emit("registry:ready");
  }

  /**
   * Unregister a service
   * @param serviceName - Name of the service to unregister
   * @returns True if the service was unregistered, false if not found
   */
  async unregisterService(serviceName: string): Promise<boolean> {
    const service = this.services.get(serviceName);
    if (!service) {
      return false;
    }

    // Dispose the service if it has a dispose method
    if (service.dispose) {
      await service.dispose();
      this.emit("service:disposed", serviceName);
    }

    // Remove all event listeners
    service.removeAllListeners();

    this.services.delete(serviceName);
    this.initializationPromises.delete(serviceName);
    this.emit("service:unregistered", serviceName);

    return true;
  }

  /**
   * Dispose all services and clear the registry
   */
  async disposeAll(): Promise<void> {
    const disposePromises = Array.from(this.services.keys()).map(
      (serviceName) => this.unregisterService(serviceName),
    );

    await Promise.all(disposePromises);
    this.isReady = false;
  }

  /**
   * Get all registered service names
   * @returns Array of service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get all services
   * @returns Map of all services
   */
  getAllServices(): Map<string, IService> {
    return new Map(this.services);
  }

  /**
   * Check if the registry is ready (all services initialized)
   * @returns True if ready
   */
  isRegistryReady(): boolean {
    return this.isReady;
  }

  /**
   * Wait for the registry to be ready
   * @returns Promise that resolves when ready
   */
  async waitForReady(): Promise<void> {
    if (this.isReady) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.once("registry:ready", resolve);
    });
  }

  /**
   * Get service statistics
   * @returns Object with registry statistics
   */
  getStats() {
    return {
      totalServices: this.services.size,
      initializedServices:
        this.services.size - this.initializationPromises.size,
      pendingInitialization: this.initializationPromises.size,
      isReady: this.isReady,
      serviceNames: this.getServiceNames(),
    };
  }
}

// Create and export the singleton instance
export const ServiceRegistry = new ServiceRegistryClass();

// Helper function to register services with type safety
export function registerService<T extends IService>(
  serviceName: string,
  serviceFactory: () => T,
): T {
  return ServiceRegistry.registerService(serviceName, serviceFactory);
}

// Helper function to get services with type safety
export function getService<T extends IService>(
  serviceName: string,
): T | undefined {
  return ServiceRegistry.getService<T>(serviceName);
}

// Helper function to require services with type safety
export function requireService<T extends IService>(serviceName: string): T {
  return ServiceRegistry.requireService<T>(serviceName);
}
