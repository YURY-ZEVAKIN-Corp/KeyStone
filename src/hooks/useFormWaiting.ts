import { useState, useCallback } from "react";
import { WaitingOptions, WaitingState } from "../types/waiting.types";

/**
 * Custom hook for managing local form waiting states
 * This creates waiting animations that are contained within the form area
 * instead of covering the entire screen
 */
export const useFormWaiting = () => {
  const [waitingState, setWaitingState] = useState<WaitingState | null>(null);

  /**
   * Show a waiting animation within the form
   * @param options - Configuration options for the waiting animation
   * @returns The ID of the waiting animation
   */
  const showWaiting = useCallback((options?: WaitingOptions): string => {
    const id = `form-waiting-${Date.now()}-${Math.random()}`;
    const state: WaitingState = {
      id,
      message: options?.message || "Processing...",
      size: options?.size || "medium",
      theme: options?.theme || "primary",
      overlay: true, // Always use overlay for form waiting
      isVisible: true,
    };
    setWaitingState(state);
    return id;
  }, []);

  /**
   * Hide the form waiting animation
   */
  const hideWaiting = useCallback((): void => {
    setWaitingState(null);
  }, []);

  /**
   * Show waiting during async operation - automatically hides when done
   * @param promise - The promise to wait for
   * @param options - Configuration options for the waiting animation
   * @returns The promise result
   */
  const waitFor = useCallback(
    async <T>(promise: Promise<T>, options?: WaitingOptions): Promise<T> => {
      showWaiting(options);
      try {
        const result = await promise;
        return result;
      } finally {
        hideWaiting();
      }
    },
    [showWaiting, hideWaiting],
  );

  /**
   * Check if form waiting animation is currently active
   * @returns True if form waiting animation is showing
   */
  const isWaiting = useCallback((): boolean => {
    return waitingState !== null;
  }, [waitingState]);

  return {
    showWaiting,
    hideWaiting,
    waitFor,
    isWaiting,
    waitingState, // Return the state so FormWaitingOverlay can use it
  };
};

export default useFormWaiting;
