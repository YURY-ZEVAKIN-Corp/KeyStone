import { useCallback } from "react";
import { requireService } from "../services/ServiceRegistry";
import { WaitingOptions } from "../types/waiting.types";
import type { WaitingServiceClass } from "../services/WaitingService";

/**
 * Custom hook for managing waiting animations using the service registry
 * @returns Object with methods to control waiting animations
 */
export const useWaiting = () => {
  const getWaitingService = useCallback(() => {
    return requireService<WaitingServiceClass>("WaitingService");
  }, []);

  /**
   * Show a waiting animation
   * @param options - Configuration options for the waiting animation
   * @returns The ID of the waiting animation (use this to hide it)
   */
  const showWaiting = useCallback(
    (options?: WaitingOptions): string => {
      const waitingService = getWaitingService();
      return waitingService.show(options);
    },
    [getWaitingService],
  );

  /**
   * Hide a specific waiting animation by ID
   * @param id - The ID returned from showWaiting()
   */
  const hideWaiting = useCallback(
    (id: string): void => {
      const waitingService = getWaitingService();
      waitingService.hide(id);
    },
    [getWaitingService],
  );

  /**
   * Hide all waiting animations
   */
  const clearWaiting = useCallback((): void => {
    const waitingService = getWaitingService();
    waitingService.clear();
  }, [getWaitingService]);

  /**
   * Show waiting during async operation - automatically hides when done
   * @param promise - The promise to wait for
   * @param options - Configuration options for the waiting animation
   * @returns The promise result
   */
  const waitFor = useCallback(
    async <T>(promise: Promise<T>, options?: WaitingOptions): Promise<T> => {
      const waitingService = getWaitingService();
      return waitingService.withPromise(promise, options);
    },
    [getWaitingService],
  );

  /**
   * Check if any waiting animations are currently active
   * @returns True if any waiting animations are showing
   */
  const isWaiting = useCallback((): boolean => {
    const waitingService = getWaitingService();
    return waitingService.isAnyActive();
  }, [getWaitingService]);

  return {
    showWaiting,
    hideWaiting,
    clearWaiting,
    waitFor,
    isWaiting,
  };
};

export default useWaiting;
