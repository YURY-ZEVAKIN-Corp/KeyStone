import { ToastService } from "../services/ToastService";
import { ToastOptions } from "../types/toast.types";

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    ToastService.success(message, options);
  };

  const showError = (message: string, options?: ToastOptions) => {
    ToastService.error(message, options);
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    ToastService.warning(message, options);
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    ToastService.info(message, options);
  };

  const hideToast = (id: string) => {
    ToastService.hide(id);
  };

  const clearAll = () => {
    ToastService.clear();
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    hide: hideToast,
    clear: clearAll,
  };
};
