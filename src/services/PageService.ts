import { getPageLoader } from "../registry/PageRegistry";

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
}
