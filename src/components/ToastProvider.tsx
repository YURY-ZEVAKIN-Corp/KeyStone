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
import { requireService } from "../services/ServiceRegistry";
import type { ToastServiceClass } from "../services/ToastService";
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
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (toasts.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [toasts]);

  useEffect(() => {
    const handleShowToast = (toast: ToastMessage) => {
      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, toast];
        return updatedToasts;
      });
    };

    const handleHideToast = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const handleClearAll = () => {
      setToasts([]);
    };

    const toastService = requireService<ToastServiceClass>("ToastService");
    toastService.on("toast:show", handleShowToast);
    toastService.on("toast:hide", handleHideToast);
    toastService.on("toast:clear", handleClearAll);

    return () => {
      toastService.off("toast:show", handleShowToast);
      toastService.off("toast:hide", handleHideToast);
      toastService.off("toast:clear", handleClearAll);
    };
  }, []);

  const handleCloseToast = () => {
    setOpen(false);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1));
    }, 200); // allow exit animation
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
          {toasts.length > 0 && (
            <Snackbar
              key={toasts[0].id}
              open={open}
              autoHideDuration={
                toasts[0].autoHide !== false ? toasts[0].duration : null
              }
              onClose={handleCloseToast}
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
                severity={severityMap[toasts[0].severity]}
                variant="filled"
                onClose={handleCloseToast}
                sx={{
                  width: "100%",
                  pointerEvents: "auto",
                }}
              >
                {toasts[0].message}
              </Alert>
            </Snackbar>
          )}
        </Stack>
      </Portal>
    </>
  );
};

export default ToastProvider;
