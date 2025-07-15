import { PageRegistry } from "../types/page.types";

// Registry of all available pages
// Each page is loaded dynamically through React.lazy
export const pageRegistry: PageRegistry = {
  userProfilePage: {
    loader: () => import("../pages/UserProfilePage"),
    displayName: "User Profile",
    title: "User Profile Details",
  },
  projectDashboard: {
    loader: () => import("../pages/ProjectDashboard"),
    displayName: "Project Dashboard",
    title: "Project Overview",
  },
  settingsPage: {
    loader: () => import("../pages/SettingsPage"),
    displayName: "Settings",
    title: "Application Settings",
  },
  // New pages can be added here
  // examplePage: {
  //   loader: () => import('../pages/ExamplePage'),
  //   displayName: 'Example Page',
  //   title: 'Example Page Title',
  // }
};

// Function to get page loader by ID
export const getPageLoader = (pageId: string) => {
  const registryItem = pageRegistry[pageId];
  if (!registryItem) {
    throw new Error(`Page with id "${pageId}" not found in registry`);
  }
  return registryItem.loader;
};

// Function to get page registry item by ID
export const getPageRegistryItem = (pageId: string) => {
  const registryItem = pageRegistry[pageId];
  if (!registryItem) {
    throw new Error(`Page with id "${pageId}" not found in registry`);
  }
  return registryItem;
};

// Function to get list of all registered pages
export const getRegisteredPages = () => {
  return Object.keys(pageRegistry).map((pageId) => ({
    pageId,
    displayName: pageRegistry[pageId].displayName || pageId,
    title: pageRegistry[pageId].title,
  }));
};
