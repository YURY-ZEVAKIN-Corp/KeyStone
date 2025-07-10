import React, { useState, useEffect, ReactNode } from "react";
import {
  Snackbar,
  Alert,
  AlertProps,
  Slide,
  SlideProps,
  Stack,
  Portal,
} from "@mui/material";
import { ToastService } from "../services/ToastService";
import { ToastMessage, ToastSeverity } from "../types/toast.types";

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const severityMap: Record<ToastSeverity, AlertProps["severity"]> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (toast: ToastMessage) => {
      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, toast];
        return updatedToasts.slice(-maxToasts);
      });
    };

    const handleHideToast = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const handleClearAll = () => {
      setToasts([]);
    };

    ToastService.on("toast:show", handleShowToast);
    ToastService.on("toast:hide", handleHideToast);
    ToastService.on("toast:clear", handleClearAll);

    return () => {
      ToastService.off("toast:show", handleShowToast);
      ToastService.off("toast:hide", handleHideToast);
      ToastService.off("toast:clear", handleClearAll);
    };
  }, [maxToasts]);

  const handleCloseToast = (id: string) => {
    ToastService.hide(id);
  };

  return (
    <>
      {children}
      <Portal>
        <Stack
          spacing={1}
          sx={{
            position: "fixed",
            top: anchorOrigin.vertical === "top" ? 24 : "auto",
            bottom: anchorOrigin.vertical === "bottom" ? 24 : "auto",
            left: anchorOrigin.horizontal === "left" ? 24 : "auto",
            right: anchorOrigin.horizontal === "right" ? 24 : "auto",
            transform:
              anchorOrigin.horizontal === "center"
                ? "translateX(-50%)"
                : "none",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {toasts.map((toast) => (
            <Snackbar
              key={toast.id}
              open={true}
              autoHideDuration={
                toast.autoHide !== false ? toast.duration : null
              }
              onClose={() => handleCloseToast(toast.id)}
              TransitionComponent={Slide}
              TransitionProps={
                {
                  direction:
                    anchorOrigin.horizontal === "left" ? "right" : "left",
                } as SlideProps
              }
              sx={{
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                transform: "none",
              }}
            >
              <Alert
                severity={severityMap[toast.severity]}
                variant="filled"
                onClose={() => handleCloseToast(toast.id)}
                sx={{
                  width: "100%",
                  pointerEvents: "auto",
                }}
              >
                {toast.message}
              </Alert>
            </Snackbar>
          ))}
        </Stack>
      </Portal>
    </>
  );
};

export default ToastProvider;
