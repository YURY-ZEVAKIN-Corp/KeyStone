import { useCallback } from "react";
import { requireService } from "../services/ServiceRegistry";
import { ToastOptions } from "../types/toast.types";
import type { ToastServiceClass } from "../services/ToastService";

export const useToast = () => {
  const getToastService = useCallback(() => {
    return requireService<ToastServiceClass>("ToastService");
  }, []);

  const showSuccess = useCallback(
    (message: string, options?: ToastOptions) => {
      const toastService = getToastService();
      toastService.success(message, options);
    },
    [getToastService],
  );

  const showError = useCallback(
    (message: string, options?: ToastOptions) => {
      const toastService = getToastService();
      toastService.error(message, options);
    },
    [getToastService],
  );

  const showWarning = useCallback(
    (message: string, options?: ToastOptions) => {
      const toastService = getToastService();
      toastService.warning(message, options);
    },
    [getToastService],
  );

  const showInfo = useCallback(
    (message: string, options?: ToastOptions) => {
      const toastService = getToastService();
      toastService.info(message, options);
    },
    [getToastService],
  );

  const hideToast = useCallback(
    (id: string) => {
      const toastService = getToastService();
      toastService.hide(id);
    },
    [getToastService],
  );

  const clearAll = useCallback(() => {
    const toastService = getToastService();
    toastService.clear();
  }, [getToastService]);

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    hide: hideToast,
    clear: clearAll,
  };
};
