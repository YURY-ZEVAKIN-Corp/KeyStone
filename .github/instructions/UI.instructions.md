---
applyTo: "**"
---

# KeyStone UI Development Instructions

## Repository Information

- **GitHub URL:** https://github.com/YURY-ZEVAKIN-Corp/KeyStone

## Project Overview

React TypeScript app with dynamic forms, MSAL auth, toast notifications, and Material-UI.

## Coding Standards

- Use functional components and hooks
- Follow atomic design principles
- Use TypeScript for type safety
- Write unit tests (React Testing Library)
- Follow accessibility best practices
- Use CSS modules or styled-components (no inline styles)
- Keep flat component structure
- Use meaningful camelCase naming
- Components should be reusable and composable
- Use Material-UI components: https://mui.com/material-ui/all-components/
- write prettier and eslint valid code acccording to the rules in the project
- use Singleton Service Pattern with Event Emitters for Service Registration
- Create a service class that will handle the business logic and state management.
- Use an EventEmitter to emit events from the service.
- In the components, subscribe to the events from the service to get updates.
- Use the service instance in the components to trigger actions.
