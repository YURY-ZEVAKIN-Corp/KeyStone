import React, { useState, useEffect, ReactNode } from "react";
import { requireService } from "../services/ServiceRegistry";
import type { WaitingServiceClass } from "../services/WaitingService";
import { WaitingState } from "../types/waiting.types";
import WaitingSpinner from "./WaitingSpinner";
import styles from "./WaitingProvider.module.css";

interface WaitingProviderProps {
  children: ReactNode;
}

export const WaitingProvider: React.FC<WaitingProviderProps> = ({
  children,
}) => {
  const [waitingStates, setWaitingStates] = useState<WaitingState[]>([]);

  useEffect(() => {
    const handleShow = (state: WaitingState) => {
      setWaitingStates((prev) => [...prev, state]);
    };

    const handleHide = (id: string) => {
      setWaitingStates((prev) => prev.filter((state) => state.id !== id));
    };

    const handleClear = () => {
      setWaitingStates([]);
    };

    // Subscribe to waiting service events
    const waitingService =
      requireService<WaitingServiceClass>("WaitingService");
    waitingService.on("waiting:show", handleShow);
    waitingService.on("waiting:hide", handleHide);
    waitingService.on("waiting:clear", handleClear);

    // Cleanup listeners on unmount
    return () => {
      waitingService.off("waiting:show", handleShow);
      waitingService.off("waiting:hide", handleHide);
      waitingService.off("waiting:clear", handleClear);
    };
  }, []);

  // Check if any waiting state has overlay enabled
  const hasOverlay = waitingStates.some((state) => state.overlay);

  return (
    <>
      {children}
      {waitingStates.length > 0 && (
        <div
          className={`${styles.waitingContainer} ${hasOverlay ? styles.overlay : styles.inline}`}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className={styles.waitingContent}>
            {waitingStates.map((state) => (
              <div key={state.id} className={styles.waitingItem}>
                <WaitingSpinner state={state} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WaitingProvider;
