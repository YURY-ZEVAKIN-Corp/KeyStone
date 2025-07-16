# Service Registry Pattern Implementation

This document describes the implementation of a Singleton Service Pattern with Event Emitters for all service registration in the KeyStone application.

## Overview

The Service Registry pattern provides centralized management of application services as singletons with event-driven communication. All services implement a common interface and are managed through a central registry.

## Architecture

### Core Components

1. **ServiceRegistry** - Central singleton registry that manages all services
2. **IService Interface** - Common interface that all services must implement
3. **Service Classes** - Individual service implementations (FormService, WaitingService, etc.)
4. **Service Hooks** - React hooks for accessing services in components
5. **Service Initialization** - Centralized service setup and configuration

### File Structure

```
src/
├── services/
│   ├── ServiceRegistry.ts      # Central service registry
│   ├── FormService.ts          # Form management service
│   ├── WaitingService.ts       # Loading/waiting animations
│   ├── ToastService.ts         # Toast notifications
│   ├── PageService.ts          # Page management
│   ├── apiService.ts           # API calls and HTTP operations
│   └── index.ts                # Service initialization and exports
├── hooks/
│   ├── useServices.ts          # New service registry hooks
│   ├── useFormService.ts       # Updated form service hook
│   ├── useToast.ts             # Updated toast service hook
│   └── useWaiting.ts           # Updated waiting service hook
└── utils/
    └── EventEmitter.ts         # Enhanced event emitter implementation
```

## Service Registry API

### Core Methods

```typescript
// Register a service
ServiceRegistry.registerService(serviceName, serviceFactory)

// Get a service (returns undefined if not found)
ServiceRegistry.getService(serviceName)

// Require a service (throws error if not found)
ServiceRegistry.requireService(serviceName)

// Check if service exists
ServiceRegistry.hasService(serviceName)

// Initialize all services
await ServiceRegistry.initializeAll()

// Dispose all services
await ServiceRegistry.disposeAll()
```

### Service Events

The registry emits the following events:

- `service:registered` - When a service is registered
- `service:unregistered` - When a service is unregistered
- `service:initialized` - When a service is initialized
- `service:disposed` - When a service is disposed
- `registry:ready` - When all services are ready

## IService Interface

All services must implement the `IService` interface:

```typescript
interface IService extends EventEmitter {
  readonly serviceName: string;
  initialize?(): Promise<void> | void;
  dispose?(): Promise<void> | void;
}
```

### Service Implementation Example

```typescript
class MyServiceClass extends EventEmitter implements IService {
  public readonly serviceName = "MyService";

  public initialize(): void {
    console.log("MyService initialized");
    // Setup logic here
  }

  public dispose(): void {
    this.removeAllListeners();
    console.log("MyService disposed");
    // Cleanup logic here
  }

  // Service-specific methods...
}
```

## Service Registration

Services are registered during application startup in `src/services/index.ts`:

```typescript
export async function initializeServices(): Promise<void> {
  // Register services
  ServiceRegistry.registerService("WaitingService", createWaitingService);
  ServiceRegistry.registerService("ToastService", createToastService);
  ServiceRegistry.registerService("FormService", createFormService);
  ServiceRegistry.registerService("PageService", createPageService);
  ServiceRegistry.registerService("ApiService", () => createApiService());

  // Initialize all services
  await ServiceRegistry.initializeAll();
}
```

## Using Services in Components

### Option 1: Direct Service Registry Access

```typescript
import { requireService } from "../services/ServiceRegistry";

const MyComponent = () => {
  const toastService = requireService("ToastService");
  
  const handleClick = () => {
    toastService.success("Hello from service registry!");
  };

  return <button onClick={handleClick}>Show Toast</button>;
};
```

### Option 2: Using Hooks (Recommended)

```typescript
import { useToast } from "../hooks/useToast";

const MyComponent = () => {
  const { success } = useToast();
  
  const handleClick = () => {
    success("Hello from hook!");
  };

  return <button onClick={handleClick}>Show Toast</button>;
};
```

### Option 3: Using New Service Registry Hooks

```typescript
import { useToastService } from "../hooks/useServices";

const MyComponent = () => {
  const toastService = useToastService();
  
  const handleClick = () => {
    toastService?.success("Hello from registry hook!");
  };

  return <button onClick={handleClick}>Show Toast</button>;
};
```

## Service Communication

Services can communicate with each other through events:

```typescript
// Service A emits an event
serviceA.emit("data:updated", { id: 123, data: newData });

// Service B listens for the event
serviceB.on("data:updated", (payload) => {
  console.log("Data updated:", payload);
});
```

## Service Dependencies

Services can depend on other services by accessing them through the registry:

```typescript
class FormServiceClass extends EventEmitter implements IService {
  private getWaitingService() {
    return requireService("WaitingService");
  }

  async openFormWithWaiting() {
    const waitingService = this.getWaitingService();
    return waitingService.withPromise(/* ... */);
  }
}
```

## Benefits

1. **Centralized Management** - All services are managed in one place
2. **Singleton Pattern** - Ensures only one instance of each service
3. **Event-Driven Communication** - Services can communicate through events
4. **Lifecycle Management** - Proper initialization and disposal
5. **Type Safety** - Full TypeScript support with type assertions
6. **Testability** - Services can be easily mocked for testing
7. **Dependency Injection** - Services can access other services through the registry

## Application Initialization

The application initializes services during startup:

```typescript
// In App.tsx
const App: React.FC = () => {
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    const initServices = async () => {
      await initializeServices();
      setServicesInitialized(true);
    };
    initServices();
  }, []);

  if (!servicesInitialized) {
    return <div>Starting application...</div>;
  }

  return <AppContent />;
};
```

## Service Registry Events and Debugging

In development mode, the registry logs service events for debugging:

```typescript
if (process.env.NODE_ENV === "development") {
  ServiceRegistry.on("service:registered", (serviceName) => {
    console.log(`✅ Service registered: ${serviceName}`);
  });

  ServiceRegistry.on("registry:ready", () => {
    console.log("🎉 All services are ready!");
    console.log("Service registry stats:", ServiceRegistry.getStats());
  });
}
```

## Migration Guide

### Updating Existing Code

1. **Service Classes**: Add `IService` interface implementation
2. **Service Exports**: Remove direct singleton exports, add factory functions
3. **Hooks**: Update to use `requireService()` instead of direct imports
4. **Components**: Update service imports to use hooks or registry

### Before (Old Pattern)

```typescript
// Direct singleton import
import { ToastService } from "../services/ToastService";

const MyComponent = () => {
  const handleClick = () => {
    ToastService.success("Hello!");
  };
  return <button onClick={handleClick}>Click</button>;
};
```

### After (New Pattern)

```typescript
// Using hook
import { useToast } from "../hooks/useToast";

const MyComponent = () => {
  const { success } = useToast();
  
  const handleClick = () => {
    success("Hello!");
  };
  return <button onClick={handleClick}>Click</button>;
};
```

## Best Practices

1. **Use Hooks** - Prefer hooks over direct service access in components
2. **Service Dependencies** - Access other services through the registry, not direct imports
3. **Event Names** - Use consistent event naming conventions (e.g., `service:action`)
4. **Error Handling** - Always handle cases where services might not be available
5. **Initialization** - Ensure services are initialized before use
6. **Cleanup** - Properly dispose of services and remove event listeners

## Testing

Services can be easily mocked for testing:

```typescript
// Mock a service in tests
const mockToastService = {
  serviceName: "ToastService",
  success: jest.fn(),
  error: jest.fn(),
  // ... other methods
};

ServiceRegistry.registerService("ToastService", () => mockToastService);
```

This implementation provides a robust, scalable, and maintainable service architecture for the KeyStone application.
