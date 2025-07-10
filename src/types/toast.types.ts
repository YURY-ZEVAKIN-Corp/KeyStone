export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
  autoHide?: boolean;
}

export interface ToastOptions {
  duration?: number;
  autoHide?: boolean;
}

export interface ToastServiceEvents {
  "toast:show": (toast: ToastMessage) => void;
  "toast:hide": (id: string) => void;
  "toast:clear": () => void;
}
