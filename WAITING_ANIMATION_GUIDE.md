# Waiting Animation System

A comprehensive waiting animation system for the Keystone application that provides beautiful, customizable loading indicators for dynamic forms, dynamic pages, and the main screen.

## Features

- 🎨 **Beautiful Animations**: Orbiting circles with pulsing center element
- 🎯 **Multiple Themes**: Primary, secondary, and accent color schemes
- 📏 **Size Variants**: Small, medium, and large sizes
- 🔄 **Overlay Support**: Optional backdrop overlay
- ♿ **Accessibility**: Respects reduced motion preferences
- 🌙 **Dark Mode**: Automatic dark theme support
- 🔌 **Easy Integration**: Works seamlessly with forms, pages, and custom components

## Architecture

### Components

1. **WaitingService** - Global service for managing waiting states
2. **WaitingProvider** - Context provider component 
3. **WaitingSpinner** - Animated spinner component
4. **useWaiting** - Custom hook for easy integration

### Files Structure

```
src/
├── components/
│   ├── WaitingProvider.tsx          # Provider component
│   ├── WaitingProvider.module.css   # Provider styles
│   ├── WaitingSpinner.tsx           # Spinner component
│   ├── WaitingSpinner.module.css    # Spinner animations
│   └── WaitingDemo.tsx              # Demo component
├── services/
│   └── WaitingService.ts            # Core service
├── hooks/
│   └── useWaiting.ts                # Custom hook
└── types/
    └── waiting.types.ts             # TypeScript definitions
```

## Quick Start

### 1. Setup

The `WaitingProvider` is already integrated into the main App component:

```tsx
<MsalProvider instance={msalInstance}>
  <ToastProvider>
    <WaitingProvider>
      <FormModalProvider>
        <div className={styles.App} role="main">
          <Login />
        </div>
      </FormModalProvider>
    </WaitingProvider>
  </ToastProvider>
</MsalProvider>
```

### 2. Basic Usage

```tsx
import { useWaiting } from '../hooks/useWaiting';

const MyComponent = () => {
  const { showWaiting, hideWaiting } = useWaiting();

  const handleClick = () => {
    const id = showWaiting({ message: 'Loading...' });
    
    // Do some work...
    setTimeout(() => hideWaiting(id), 2000);
  };

  return <button onClick={handleClick}>Load Data</button>;
};
```

### 3. With Promises (Recommended)

```tsx
const { waitFor } = useWaiting();

const handleAsyncOperation = async () => {
  try {
    const result = await waitFor(
      fetchUserData(), 
      { message: 'Fetching user data...' }
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
```

## Configuration Options

### WaitingOptions Interface

```tsx
interface WaitingOptions {
  message?: string;                    // Text to display
  overlay?: boolean;                   // Show backdrop (default: true)
  size?: 'small' | 'medium' | 'large'; // Spinner size (default: 'medium')
  theme?: 'primary' | 'secondary' | 'accent'; // Color theme (default: 'primary')
}
```

### Size Examples

```tsx
// Small spinner (32px) - for inline loading
showWaiting({ size: 'small', overlay: false });

// Medium spinner (48px) - default size
showWaiting({ size: 'medium' });

// Large spinner (64px) - for full page loading
showWaiting({ size: 'large', message: 'Loading application...' });
```

### Theme Examples

```tsx
// Primary theme (blue) - default
showWaiting({ theme: 'primary', message: 'Loading...' });

// Secondary theme (gray)
showWaiting({ theme: 'secondary', message: 'Processing...' });

// Accent theme (green)
showWaiting({ theme: 'accent', message: 'Saving...' });
```

## Integration Examples

### Forms Integration

The FormService now includes automatic waiting animation support:

```tsx
// Basic form with loading
const result = await FormService.openFormWithWaiting(
  'userEditForm',
  { userId: 123 },
  async () => await fetchUserData(123), // Optional data loading
  'Loading user data...'
);

// Form with save animation
await FormService.resolveFormWithWaiting(
  formData,
  async (data) => await saveUser(data), // Optional save operation
  'Saving user...'
);
```

### Pages Integration

The PageService includes waiting animation support:

```tsx
// Load single page with animation
const PageComponent = await PageService.loadPageWithWaiting(
  'userProfilePage',
  'Loading profile...'
);

// Load multiple pages
const pages = await PageService.loadPagesWithWaiting(
  ['page1', 'page2', 'page3'],
  'Loading pages...'
);
```

### Custom API Calls

```tsx
const { waitFor } = useWaiting();

// Simple API call
const userData = await waitFor(
  api.getUser(id),
  { message: 'Fetching user...' }
);

// Multiple API calls
const [users, projects] = await waitFor(
  Promise.all([api.getUsers(), api.getProjects()]),
  { message: 'Loading dashboard data...' }
);
```

## Advanced Usage

### Multiple Waiting States

```tsx
const { showWaiting, hideWaiting } = useWaiting();

// Show multiple different waiting states
const task1Id = showWaiting({ 
  message: 'Task 1...', 
  overlay: false, 
  size: 'small' 
});

const task2Id = showWaiting({ 
  message: 'Task 2...', 
  overlay: false, 
  size: 'medium' 
});

// Hide them individually
setTimeout(() => hideWaiting(task1Id), 2000);
setTimeout(() => hideWaiting(task2Id), 4000);
```

### Error Handling

```tsx
const { waitFor } = useWaiting();

const handleOperation = async () => {
  try {
    await waitFor(
      riskyOperation(),
      { message: 'Processing...' }
    );
    // Success - waiting automatically hidden
  } catch (error) {
    // Error - waiting automatically hidden
    ToastService.error('Operation failed');
  }
};
```

### Conditional Waiting

```tsx
const { showWaiting, hideWaiting, isWaiting } = useWaiting();

const handleClick = () => {
  if (isWaiting()) {
    return; // Don't start new operation if already waiting
  }
  
  const id = showWaiting({ message: 'Processing...' });
  // ... do work
};
```

## Styling Customization

### CSS Custom Properties

The waiting spinner uses CSS custom properties for easy theming:

```css
.primary {
  --circle-color: #007acc;      /* Circle color */
  --pulse-color: #005a9e;       /* Center pulse color */
  --message-color: #333;        /* Message text color */
}
```

### Custom Themes

Add new themes by extending the CSS:

```css
/* Add to WaitingSpinner.module.css */
.warning {
  --circle-color: #ffc107;
  --pulse-color: #e0a800;
  --message-color: #856404;
}

.danger {
  --circle-color: #dc3545;
  --pulse-color: #c82333;
  --message-color: #721c24;
}
```

## Performance Considerations

- **Automatic Cleanup**: Waiting states are automatically cleaned up
- **Event Unsubscription**: Listeners are properly removed on unmount
- **Memory Efficient**: Uses Map for state storage with automatic cleanup
- **Reduced Motion**: Respects `prefers-reduced-motion` accessibility setting

## Accessibility

- **ARIA Labels**: Proper `role="status"` and `aria-live="polite"`
- **Reduced Motion**: Simplified animations for users who prefer reduced motion
- **High Contrast**: Works with high contrast mode
- **Screen Readers**: Announces loading states to screen readers

## Demo

Visit the **Waiting Demo** page in the navigation to see all features in action:

- Different sizes and themes
- Overlay vs inline modes
- Multiple simultaneous animations
- Promise integration examples
- Form and page loading simulations

## Best Practices

1. **Use Promises**: Prefer `waitFor()` over manual show/hide for automatic cleanup
2. **Meaningful Messages**: Provide clear, actionable loading messages
3. **Appropriate Sizing**: Use small for inline, medium for modals, large for pages
4. **Theme Consistency**: Use primary for main actions, secondary for background tasks
5. **Error Handling**: Always wrap async operations in try/catch
6. **Performance**: Avoid showing waiting for operations under 100ms

## Migration Guide

### From Manual Loading States

Before:
```tsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await api.getData();
  } finally {
    setLoading(false);
  }
};

return loading ? <Spinner /> : <Button onClick={handleClick} />;
```

After:
```tsx
const { waitFor } = useWaiting();

const handleClick = async () => {
  await waitFor(api.getData(), { message: 'Loading data...' });
};

return <Button onClick={handleClick} />;
```

### Benefits of Migration

- ✅ Consistent loading UI across the app
- ✅ Automatic cleanup and error handling
- ✅ Better accessibility
- ✅ Less boilerplate code
- ✅ Centralized loading state management

## Troubleshooting

### Common Issues

1. **Waiting doesn't show**: Ensure WaitingProvider is in your component tree
2. **Multiple overlays**: Check if you're calling show() multiple times without hiding
3. **TypeScript errors**: Import types from `../types/waiting.types`
4. **Animations not working**: Check for CSS conflicts or reduced motion settings

### Debug Mode

```tsx
// Check current waiting states
console.log('Active waiting states:', WaitingService.getAllStates());
console.log('Is any waiting active?', WaitingService.isAnyActive());
```

## Future Enhancements

- [ ] Progress indicators with percentage
- [ ] Custom animation types (fade, scale, etc.)
- [ ] Sound notifications (optional)
- [ ] Integration with error boundaries
- [ ] Persistence across route changes
- [ ] Analytics integration for performance monitoring
