// Basic types for dynamic pages system

export interface DynamicPageProps {
  pageId: string;
  inputModel: any;
  pageEntityId: string;
}

export interface PageComponent {
  default: React.ComponentType<DynamicPageProps>;
}

export type PageLoader = () => Promise<PageComponent>;

export interface PageRegistryItem {
  loader: PageLoader;
  displayName?: string;
  title: string;
}

export interface PageRegistry {
  [pageId: string]: PageRegistryItem;
}

// Interface for page route parameters
export interface PageRouteParams {
  pageType?: string;
  pageEntityId?: string;
}
