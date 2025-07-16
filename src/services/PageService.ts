import { getPageLoader } from "../registry/PageRegistry";
import { WaitingService } from "./WaitingService";
import { PageComponent } from "../types/page.types";

export class PageService {
  /**
   * Get the page loader function for a given page ID
   * @param pageId - The ID of the page to load (from PageRegistry)
   * @returns The page loader function
   */
  static getPageLoader(pageId: string) {
    return getPageLoader(pageId);
  }

  /**
   * Navigate to a page using React Router
   * @param pageType - The type/ID of the page
   * @param pageEntityId - The entity ID for the page
   * @returns The route path
   */
  static getPageRoute(pageType: string, pageEntityId: string): string {
    return `/page/${pageType}/${pageEntityId}`;
  }

  /**
   * Check if a page exists in the registry
   * @param pageId - The ID of the page to check
   * @returns True if the page exists, false otherwise
   */
  static pageExists(pageId: string): boolean {
    try {
      getPageLoader(pageId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load a page component with automatic waiting animation
   * @param pageId - The ID of the page to load
   * @param waitingMessage - Message to show during loading
   * @returns Promise that resolves with the page component
   */
  static async loadPageWithWaiting(
    pageId: string,
    waitingMessage = "Loading page...",
  ): Promise<PageComponent> {
    const loader = getPageLoader(pageId);

    return WaitingService.withPromise(loader(), {
      message: waitingMessage,
      overlay: true,
      size: "large",
      theme: "secondary",
    });
  }

  /**
   * Load multiple pages with waiting animation
   * @param pageIds - Array of page IDs to load
   * @param waitingMessage - Message to show during loading
   * @returns Promise that resolves with array of page components
   */
  static async loadPagesWithWaiting(
    pageIds: string[],
    waitingMessage = "Loading pages...",
  ): Promise<PageComponent[]> {
    const loadPromises = pageIds.map((pageId) => getPageLoader(pageId)());

    return WaitingService.withPromise(Promise.all(loadPromises), {
      message: waitingMessage,
      overlay: true,
      size: "large",
      theme: "secondary",
    });
  }
}
