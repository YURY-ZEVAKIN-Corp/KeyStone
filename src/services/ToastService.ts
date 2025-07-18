import { EventEmitter } from "../utils/EventEmitter";
import {
  ToastMessage,
  ToastSeverity,
  ToastOptions,
} from "../types/toast.types";
import { IService } from "./ServiceRegistry";

class ToastServiceClass extends EventEmitter implements IService {
  public readonly serviceName = "ToastService";

  /**
   * Initialize the ToastService
   */
  public initialize(): void {
    console.log("ToastService initialized");
  }

  /**
   * Dispose the ToastService
   */
  public dispose(): void {
    this.clear();
    this.removeAllListeners();
    console.log("ToastService disposed");
  }
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  success(message: string, options?: ToastOptions): void {
    this.showToast(message, "success", options);
  }

  error(message: string, options?: ToastOptions): void {
    this.showToast(message, "error", options);
  }

  warning(message: string, options?: ToastOptions): void {
    this.showToast(message, "warning", options);
  }

  info(message: string, options?: ToastOptions): void {
    this.showToast(message, "info", options);
  }

  private showToast(
    message: string,
    severity: ToastSeverity,
    options?: ToastOptions,
  ): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      message,
      severity,
      duration: options?.duration || (severity === "error" ? 6000 : 4000),
      autoHide: options?.autoHide !== false,
    };

    this.emit("toast:show", toast);
  }

  hide(id: string): void {
    this.emit("toast:hide", id);
  }

  clear(): void {
    this.emit("toast:clear");
  }
}

// Export the class for registration
export { ToastServiceClass };

// Factory function for service registry
export function createToastService(): ToastServiceClass {
  return new ToastServiceClass();
}
