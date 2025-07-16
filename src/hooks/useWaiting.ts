import { useCallback } from "react";
import { WaitingService } from "../services/WaitingService";
import { WaitingOptions } from "../types/waiting.types";

/**
 * Custom hook for managing waiting animations
 * @returns Object with methods to control waiting animations
 */
export const useWaiting = () => {
  /**
   * Show a waiting animation
   * @param options - Configuration options for the waiting animation
   * @returns The ID of the waiting animation (use this to hide it)
   */
  const showWaiting = useCallback((options?: WaitingOptions): string => {
    return WaitingService.show(options);
  }, []);

  /**
   * Hide a specific waiting animation by ID
   * @param id - The ID returned from showWaiting()
   */
  const hideWaiting = useCallback((id: string): void => {
    WaitingService.hide(id);
  }, []);

  /**
   * Hide all waiting animations
   */
  const clearWaiting = useCallback((): void => {
    WaitingService.clear();
  }, []);

  /**
   * Show waiting during async operation - automatically hides when done
   * @param promise - The promise to wait for
   * @param options - Configuration options for the waiting animation
   * @returns The promise result
   */
  const waitFor = useCallback(
    async <T>(promise: Promise<T>, options?: WaitingOptions): Promise<T> => {
      return WaitingService.withPromise(promise, options);
    },
    [],
  );

  /**
   * Check if any waiting animations are currently active
   * @returns True if any waiting animations are showing
   */
  const isWaiting = useCallback((): boolean => {
    return WaitingService.isAnyActive();
  }, []);

  return {
    showWaiting,
    hideWaiting,
    clearWaiting,
    waitFor,
    isWaiting,
  };
};

export default useWaiting;
