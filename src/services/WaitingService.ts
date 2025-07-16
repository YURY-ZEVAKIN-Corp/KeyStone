import { EventEmitter } from "../utils/EventEmitter";
import { WaitingState, WaitingOptions } from "../types/waiting.types";
import { IService } from "./ServiceRegistry";

class WaitingServiceClass extends EventEmitter implements IService {
  public readonly serviceName = "WaitingService";
  private waitingStates: Map<string, WaitingState> = new Map();

  /**
   * Initialize the WaitingService
   */
  public initialize(): void {
    console.log("WaitingService initialized");
  }

  /**
   * Dispose the WaitingService
   */
  public dispose(): void {
    this.clear();
    this.removeAllListeners();
    console.log("WaitingService disposed");
  }

  private generateId(): string {
    return `waiting-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Show a waiting animation
   * @param options - Configuration options for the waiting animation
   * @returns The ID of the waiting animation (use this to hide it)
   */
  show(options?: WaitingOptions): string {
    const id = this.generateId();
    const state: WaitingState = {
      id,
      message: options?.message,
      isVisible: true,
      overlay: options?.overlay ?? true,
      size: options?.size ?? "medium",
      theme: options?.theme ?? "primary",
    };

    this.waitingStates.set(id, state);
    this.emit("waiting:show", state);
    return id;
  }

  /**
   * Hide a specific waiting animation by ID
   * @param id - The ID returned from show()
   */
  hide(id: string): void {
    if (this.waitingStates.has(id)) {
      this.waitingStates.delete(id);
      this.emit("waiting:hide", id);
    }
  }

  /**
   * Hide all waiting animations
   */
  clear(): void {
    this.waitingStates.clear();
    this.emit("waiting:clear");
  }

  /**
   * Get the current waiting state by ID
   * @param id - The waiting animation ID
   * @returns The waiting state or undefined if not found
   */
  getState(id: string): WaitingState | undefined {
    return this.waitingStates.get(id);
  }

  /**
   * Check if any waiting animations are currently active
   * @returns True if any waiting animations are showing
   */
  isAnyActive(): boolean {
    return this.waitingStates.size > 0;
  }

  /**
   * Get all active waiting states
   * @returns Array of all active waiting states
   */
  getAllStates(): WaitingState[] {
    return Array.from(this.waitingStates.values());
  }

  /**
   * Show waiting with a promise - automatically hides when promise resolves/rejects
   * @param promise - The promise to wait for
   * @param options - Configuration options for the waiting animation
   * @returns The promise result
   */
  async withPromise<T>(
    promise: Promise<T>,
    options?: WaitingOptions,
  ): Promise<T> {
    const id = this.show(options);
    try {
      const result = await promise;
      this.hide(id);
      return result;
    } catch (error) {
      this.hide(id);
      throw error;
    }
  }
}

// Export the class for registration
export { WaitingServiceClass };

// Factory function for service registry
export function createWaitingService(): WaitingServiceClass {
  return new WaitingServiceClass();
}
