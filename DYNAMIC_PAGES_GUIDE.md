# Dynamic Pages System

## Overview

A comprehensive infrastructure for dynamically loading and displaying pages in the main application area with support for:

- ✅ Dynamic loading of page components via React.lazy
- ✅ Unique page entity IDs for data isolation
- ✅ Input models for page initialization
- ✅ Route-based navigation with URL parameters
- ✅ TypeScript typing
- ✅ Page registration system
- ✅ Error and loading handling
- ✅ Material-UI components
- ✅ Responsive design

## Architecture

### Main Components:

1. **PageService** - Service for managing page operations
2. **PageRouteDemo** - Component for handling dynamic page routing
3. **PageRegistry** - Registry of all available pages
4. **PageDemo** - Demonstration interface for testing pages

### File Structure:

```
src/
├── types/
│   └── page.types.ts              # TypeScript types for pages
├── services/
│   └── PageService.ts             # Main page service
├── registry/
│   └── PageRegistry.ts            # Pages registry
├── components/
│   ├── PageRouteDemo.tsx          # Dynamic page router
│   └── PageDemo.tsx               # Demonstration interface
└── pages/
    ├── UserProfilePage.tsx        # User profile page example
    ├── ProjectDashboard.tsx       # Project dashboard example
    └── SettingsPage.tsx           # Settings page example
```

## Usage

### 1. Navigation via Service

```typescript
import { PageService } from "./services/PageService";
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();

  const handleOpenPage = () => {
    const route = PageService.getPageRoute("userProfilePage", "user-123");
    navigate(route); // Navigates to /page/userProfilePage/user-123
  };

  return <button onClick={handleOpenPage}>Open User Profile</button>;
};
```

### 2. Direct URL Navigation

Pages can be accessed directly via URL routes:

```
/page/userProfilePage/user-123
/page/projectDashboard/project-456
/page/settingsPage/admin-settings
```

### 3. Route Parameters

- `pageType` - The ID of the page (from PageRegistry)
- `pageEntityId` - Unique identifier for the page instance

### 4. Creating New Page

#### Step 1: Create page component

```typescript
// src/pages/MyCustomPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { DynamicPageProps } from '../types/page.types';

interface MyPageModel {
  title: string;
  description: string;
  // Add your data model here
}

const MyCustomPage: React.FC<DynamicPageProps> = ({
  pageId,
  inputModel,
  pageEntityId,
}) => {
  const [pageData, setPageData] = useState<MyPageModel>({
    title: "Default Title",
    description: "Default Description",
    ...inputModel, // Merge with input model
  });

  useEffect(() => {
    // Load data based on pageEntityId
    console.log(`Loading data for entity: ${pageEntityId}`);
    // In real app: fetchData(pageEntityId).then(setPageData);
  }, [pageEntityId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {pageData.title} - {pageEntityId}
      </Typography>
      
      <Card>
        <CardContent>
          <Typography>{pageData.description}</Typography>
          {/* Your page content here */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyCustomPage;
```

#### Step 2: Register the page

```typescript
// src/registry/PageRegistry.ts
export const pageRegistry: PageRegistry = {
  // ...existing pages
  myCustomPage: {
    loader: () => import("../pages/MyCustomPage"),
    displayName: "My Custom Page",
    title: "Custom Page Title",
  },
};
```

#### Step 3: Use the page

```typescript
// Navigate to the page
const route = PageService.getPageRoute("myCustomPage", "entity-123");
navigate(route);

// Or use direct URL: /page/myCustomPage/entity-123
```

## Page Interface

Each page must implement the `DynamicPageProps` interface:

```typescript
interface DynamicPageProps {
  pageId: string;           // Page ID from registry
  inputModel: any;          // Input data for initialization
  pageEntityId: string;     // Unique identifier for this page instance
}
```

## Registry Configuration

Pages are registered in the `PageRegistry` with the following structure:

```typescript
interface PageRegistryItem {
  loader: PageLoader;       // Dynamic import function
  displayName?: string;     // Human-readable name for UI
  title: string;           // Page title
}
```

## Routing System

The dynamic pages system integrates with React Router:

```typescript
// In Dashboard.tsx
<Route 
  path="/page/:pageType/:pageEntityId" 
  element={<PageRouteDemo />} 
/>
```

## Error Handling

The system includes comprehensive error handling:

- Invalid page routes show error messages
- Missing page types are caught and reported
- Loading states with spinners
- Graceful fallbacks for failed page loads

## Built-in Pages

### 1. User Profile Page (`userProfilePage`)

Interactive user profile editor with:
- Personal information fields
- Skills management with chips
- Responsive layout
- Real-time data updates

**Usage:**
```typescript
navigate("/page/userProfilePage/user-123");
```

### 2. Project Dashboard (`projectDashboard`)

Comprehensive project overview with:
- Project metrics and progress
- Team size and task completion
- Budget tracking with progress bars
- Quick action buttons
- Technology stack display

**Usage:**
```typescript
navigate("/page/projectDashboard/project-456");
```

### 3. Settings Page (`settingsPage`)

Application configuration interface with:
- Appearance settings (theme, font size, language)
- Notification preferences
- Security options (2FA, session timeout)
- General application settings
- Save functionality with status feedback

**Usage:**
```typescript
navigate("/page/settingsPage/admin-config");
```

## Demo Interface

The application includes a comprehensive demo at `/pages` with:

- List of all registered pages
- Quick access buttons for different entity IDs
- Feature explanations
- Live examples

## Features

### Dynamic Loading
Pages are loaded on-demand using React.lazy for optimal performance:

```typescript
const DynamicPage = React.lazy(PageService.getPageLoader(pageType));
```

### Entity ID Support
Each page instance can have a unique entity ID for:
- Data isolation between instances
- URL-based page identification
- Direct linking to specific page states

### Input Models
Pages can receive initialization data:

```typescript
// Page receives inputModel prop
const [pageData, setPageData] = useState({
  defaultData: "here",
  ...inputModel, // Override with provided data
});
```

### Responsive Design
All pages are built with responsive Material-UI components:

```typescript
sx={{ 
  display: "flex", 
  flexDirection: { xs: "column", md: "row" } 
}}
```

## Running the Application

```bash
cd c:\KeyStone\keystone
npm start
```

The application will be available at http://localhost:3000

After logging in through Microsoft Entra ID:
1. Go to the "Pages Demo" section
2. Explore different pages with various entity IDs
3. Test direct URL navigation

## Extension Possibilities

### 1. State Management
- Redux/Zustand integration for global state
- Page-specific state persistence
- Cross-page data sharing

### 2. Data Loading
- Async data fetching based on entity IDs
- Loading skeletons and error boundaries
- Caching and optimization

### 3. Security
- Page-level access control
- Role-based page visibility
- Secure parameter handling

### 4. SEO and Meta
- Dynamic page titles and meta tags
- Open Graph integration
- Breadcrumb navigation

### 5. Advanced Features
- Page history and navigation
- Bookmarking and favorites
- Page search and filtering
- Print-friendly layouts

### 6. Performance
- Page preloading strategies
- Virtualized large page lists
- Memory management for page instances

## TypeScript Support

The system is fully typed for excellent developer experience:

```typescript
// Typed page data models
interface UserProfileModel {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  skills: string[];
}

interface ProjectDashboardModel {
  projectName: string;
  status: "active" | "on-hold" | "completed" | "planning";
  progress: number;
  teamSize: number;
}

// Typed page props
const MyPage: React.FC<DynamicPageProps> = ({ 
  pageId, 
  inputModel, 
  pageEntityId 
}) => {
  // TypeScript knows the shape of these props
};
```

## Best Practices

### 1. Page Organization
- Keep pages focused on single responsibilities
- Use consistent naming conventions
- Group related functionality

### 2. Data Management
- Use entity IDs for data fetching
- Implement proper loading states
- Handle errors gracefully

### 3. Performance
- Lazy load pages to reduce bundle size
- Optimize re-renders with React.memo
- Use proper dependency arrays in useEffect

### 4. User Experience
- Provide loading feedback
- Implement proper error boundaries
- Ensure responsive design

### 5. Maintainability
- Document page purposes and usage
- Use TypeScript for type safety
- Keep registry organized and up-to-date

## Comparison with Dynamic Forms

| Feature | Dynamic Forms | Dynamic Pages |
|---------|---------------|---------------|
| Display | Modal overlay | Main content area |
| Navigation | Service calls | URL routes |
| Data Flow | Promise-based | Props + state |
| Use Case | Data editing | Content viewing/editing |
| URL Support | No | Yes |
| Back Button | N/A | Native browser support |

## Integration with Existing Systems

The dynamic pages system works seamlessly with:
- React Router for navigation
- Material-UI for consistent styling
- TypeScript for type safety
- Existing authentication system
- Current dashboard layout

## Troubleshooting

### Page Not Loading
- Check if page is registered in PageRegistry
- Verify import path in loader function
- Check for TypeScript compilation errors

### Route Not Working
- Ensure route is defined in Dashboard.tsx
- Check URL parameter format
- Verify PageRouteDemo is properly imported

### Type Errors
- Implement DynamicPageProps interface
- Check inputModel type compatibility
- Verify pageEntityId usage

## Future Enhancements

1. **Page Templates** - Reusable page layouts
2. **Wizard Pages** - Multi-step page flows
3. **Page Composition** - Combine multiple pages
4. **Real-time Updates** - WebSocket integration
5. **Offline Support** - Service worker caching
6. **Analytics** - Page usage tracking
7. **A/B Testing** - Page variant testing
