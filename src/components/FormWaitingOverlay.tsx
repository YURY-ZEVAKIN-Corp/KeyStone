import React, { useEffect, useState, useRef } from "react";
import { WaitingState } from "../types/waiting.types";
import WaitingSpinner from "./WaitingSpinner";
import styles from "./FormWaitingOverlay.module.css";

interface FormWaitingOverlayProps {
  state: WaitingState | null;
  className?: string;
}

export const FormWaitingOverlay: React.FC<FormWaitingOverlayProps> = ({
  state,
  className = "",
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!state || !overlayRef.current) return;

    // Find the scrollable container
    const scrollableContainer =
      overlayRef.current?.closest('[style*="overflow"]') ||
      overlayRef.current?.closest(".scrollable") ||
      overlayRef.current?.parentElement;

    // Disable scrolling on the container
    if (scrollableContainer) {
      scrollableContainer.classList.add(styles.scrollDisabled);
    }

    const updateScrollPosition = () => {
      const container =
        overlayRef.current?.closest('[style*="overflow"]') ||
        overlayRef.current?.closest(".scrollable") ||
        overlayRef.current?.parentElement;

      if (container) {
        setScrollPosition({
          x: container.scrollLeft || 0,
          y: container.scrollTop || 0,
        });
      }
    };

    // Initial position update
    updateScrollPosition();

    // Add scroll listener (for position tracking, but scrolling will be disabled)
    const handleScroll = () => {
      updateScrollPosition();
    };

    const targetContainer = scrollableContainer || window;

    if (targetContainer === window) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      targetContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      // Re-enable scrolling when overlay is removed
      if (scrollableContainer) {
        scrollableContainer.classList.remove(styles.scrollDisabled);
      }

      if (targetContainer === window) {
        window.removeEventListener("scroll", handleScroll);
      } else {
        targetContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [state]);

  if (!state) {
    return null;
  }

  const contentStyle = {
    transform: `translate(calc(-50% + ${scrollPosition.x}px), calc(-50% + ${scrollPosition.y}px))`,
  };

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading form data"
    >
      <div className={styles.content} style={contentStyle}>
        <WaitingSpinner state={state} />
      </div>
    </div>
  );
};

export default FormWaitingOverlay;
