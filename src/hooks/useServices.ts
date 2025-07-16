import { useEffect, useState, useCallback } from "react";
import { ServiceRegistry } from "../services/ServiceRegistry";
import type { WaitingServiceClass } from "../services/WaitingService";
import type { ToastServiceClass } from "../services/ToastService";
import type { FormServiceClass } from "../services/FormService";
import type { PageServiceClass } from "../services/PageService";
import type { ApiServiceClass } from "../services/apiService";

/**
 * Hook to access WaitingService from the service registry
 */
export function useWaitingService() {
  const [service, setService] = useState<WaitingServiceClass | null>(null);

  useEffect(() => {
    const waitingService =
      ServiceRegistry.getService<WaitingServiceClass>("WaitingService");
    setService(waitingService || null);
  }, []);

  return service;
}

/**
 * Hook to access ToastService from the service registry
 */
export function useToastService() {
  const [service, setService] = useState<ToastServiceClass | null>(null);

  useEffect(() => {
    const toastService =
      ServiceRegistry.getService<ToastServiceClass>("ToastService");
    setService(toastService || null);
  }, []);

  return service;
}

/**
 * Hook to access FormService from the service registry
 */
export function useFormService() {
  const [service, setService] = useState<FormServiceClass | null>(null);

  useEffect(() => {
    const formService =
      ServiceRegistry.getService<FormServiceClass>("FormService");
    setService(formService || null);
  }, []);

  return service;
}

/**
 * Hook to access PageService from the service registry
 */
export function usePageService() {
  const [service, setService] = useState<PageServiceClass | null>(null);

  useEffect(() => {
    const pageService =
      ServiceRegistry.getService<PageServiceClass>("PageService");
    setService(pageService || null);
  }, []);

  return service;
}

/**
 * Hook to access ApiService from the service registry
 */
export function useApiService() {
  const [service, setService] = useState<ApiServiceClass | null>(null);

  useEffect(() => {
    const apiService =
      ServiceRegistry.getService<ApiServiceClass>("ApiService");
    setService(apiService || null);
  }, []);

  return service;
}

/**
 * Hook that provides convenient methods for showing/hiding waiting animations
 */
export function useWaiting() {
  const waitingService = useWaitingService();

  const show = useCallback(
    (options?: any) => {
      return waitingService?.show(options) || "";
    },
    [waitingService],
  );

  const hide = useCallback(
    (id: string) => {
      waitingService?.hide(id);
    },
    [waitingService],
  );

  const clear = useCallback(() => {
    waitingService?.clear();
  }, [waitingService]);

  const withPromise = useCallback(
    async <T>(promise: Promise<T>, options?: any): Promise<T> => {
      if (!waitingService) {
        return promise;
      }
      return waitingService.withPromise(promise, options);
    },
    [waitingService],
  );

  return {
    show,
    hide,
    clear,
    withPromise,
    isAnyActive: waitingService?.isAnyActive() || false,
  };
}

/**
 * Hook that provides convenient methods for showing toast messages
 */
export function useToast() {
  const toastService = useToastService();

  const success = useCallback(
    (message: string, options?: any) => {
      toastService?.success(message, options);
    },
    [toastService],
  );

  const error = useCallback(
    (message: string, options?: any) => {
      toastService?.error(message, options);
    },
    [toastService],
  );

  const warning = useCallback(
    (message: string, options?: any) => {
      toastService?.warning(message, options);
    },
    [toastService],
  );

  const info = useCallback(
    (message: string, options?: any) => {
      toastService?.info(message, options);
    },
    [toastService],
  );

  const hide = useCallback(
    (id: string) => {
      toastService?.hide(id);
    },
    [toastService],
  );

  const clear = useCallback(() => {
    toastService?.clear();
  }, [toastService]);

  return {
    success,
    error,
    warning,
    info,
    hide,
    clear,
  };
}

/**
 * Hook that provides convenient methods for form operations
 */
export function useForm() {
  const formService = useFormService();

  const openForm = useCallback(
    <TInput = any, TOutput = any>(
      formId: string,
      inputModel?: TInput,
      buttonConfig?: any,
      formEntityId?: string,
    ): Promise<TOutput> => {
      if (!formService) {
        return Promise.reject(new Error("FormService not available"));
      }
      return formService.openForm<TInput, TOutput>(
        formId,
        inputModel,
        buttonConfig,
        formEntityId,
      );
    },
    [formService],
  );

  const openFormWithWaiting = useCallback(
    async <TInput = any, TOutput = any>(
      formId: string,
      inputModel?: TInput,
      asyncOperation?: () => Promise<TInput>,
      waitingMessage?: string,
      buttonConfig?: any,
      formEntityId?: string,
    ): Promise<TOutput> => {
      if (!formService) {
        return Promise.reject(new Error("FormService not available"));
      }
      return formService.openFormWithWaiting<TInput, TOutput>(
        formId,
        inputModel,
        asyncOperation,
        waitingMessage,
        buttonConfig,
        formEntityId,
      );
    },
    [formService],
  );

  const resolveForm = useCallback(
    (outputModel: any) => {
      formService?.resolveForm(outputModel);
    },
    [formService],
  );

  const rejectForm = useCallback(
    (reason?: any) => {
      formService?.rejectForm(reason);
    },
    [formService],
  );

  const getCurrentFormState = useCallback(() => {
    return formService?.getCurrentFormState() || null;
  }, [formService]);

  const isFormOpen = useCallback(() => {
    return formService?.isFormOpen() || false;
  }, [formService]);

  return {
    openForm,
    openFormWithWaiting,
    resolveForm,
    rejectForm,
    getCurrentFormState,
    isFormOpen,
  };
}

/**
 * Hook to check if all services are ready
 */
export function useServicesReady() {
  const [isReady, setIsReady] = useState(ServiceRegistry.isRegistryReady());

  useEffect(() => {
    const handleReady = () => setIsReady(true);

    ServiceRegistry.on("registry:ready", handleReady);

    return () => {
      ServiceRegistry.off("registry:ready", handleReady);
    };
  }, []);

  return isReady;
}
