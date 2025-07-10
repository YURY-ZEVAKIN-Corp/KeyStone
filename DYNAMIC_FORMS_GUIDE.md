# Dynamic Modal Forms System

## Overview

A full-featured infrastructure for dynamically opening forms in modal windows with support for:

- ✅ Dynamic loading of form components via React.lazy
- ✅ Promises for handling form results
- ✅ OK, Cancel, Save buttons with customizable behavior
- ✅ TypeScript typing
- ✅ Form registration system
- ✅ Error and loading handling
- ✅ Material-UI components

## Architecture

### Main Components:

1. **FormService** - Service for managing form opening
2. **FormModalProvider** - Provider for displaying modal windows
3. **FormRegistry** - Registry of all available forms
4. **useFormService** - Hook for convenient form handling

### File Structure:

```
src/
├── types/
│   └── form.types.ts              # TypeScript types
├── services/
│   └── FormService.ts             # Main service
├── registry/
│   └── FormRegistry.ts            # Forms registry
├── components/
│   ├── FormModalProvider.tsx      # Modal windows provider
│   └── FormDemo.tsx               # Demonstration
├── forms/
│   ├── UserEditForm.tsx           # User form example
│   └── ProjectEditForm.tsx        # Project form example
├── hooks/
│   └── useFormService.ts          # Hook for working with forms
└── utils/
    └── EventEmitter.ts            # Simple EventEmitter
```

## Usage

### 1. Basic Usage

```typescript
import { FormService } from "./services/FormService";

// Opening form with promise
FormService.openForm("userEditForm", { name: "John" })
  .then((data) => console.log("Saved!", data))
  .catch(() => console.log("Cancelled"));
```

### 2. Using Hook

```typescript
import { useFormService } from './hooks/useFormService';

const MyComponent = () => {
  const { openForm } = useFormService();

  const handleEditUser = async () => {
    try {
      const result = await openForm('userEditForm', userData);
      // Process result
    } catch (error) {
      // Form was cancelled
    }
  };

  return <button onClick={handleEditUser}>Edit</button>;
};
```

### 3. Creating New Form

#### Step 1: Create form component

```typescript
// src/forms/MyCustomForm.tsx
import React, { useState, useEffect } from 'react';
import { DynamicFormProps } from '../types/form.types';

const MyCustomForm: React.FC<DynamicFormProps> = ({ inputModel, onChange }) => {
  const [formData, setFormData] = useState(inputModel);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return (
    <div>
      {/* Your JSX */}
    </div>
  );
};

export default MyCustomForm;
```

#### Step 2: Register the form

```typescript
// src/registry/FormRegistry.ts
export const formRegistry: FormRegistry = {
  // ...existing forms
  myCustomForm: {
    loader: () => import("../forms/MyCustomForm"),
    displayName: "My Form",
  },
};
```

#### Step 3: Use the form

```typescript
FormService.openForm("myCustomForm", inputData).then((result) => {
  // Process result
});
```

## Form Interface

Each form must implement the `DynamicFormProps` interface:

```typescript
interface DynamicFormProps {
  formId: string; // Form ID
  inputModel: any; // Input data
  onChange: (outputModel: any) => void; // Callback for changes
  onSave?: () => Promise<any> | any; // Optional save handler
}
```

## Button Behavior

- **OK** - Closes the form and resolves promise with current data
- **Cancel** - Closes the form and rejects promise
- **Save** - Calls the form's `onSave()` method without closing modal

## Demo

The application includes a demo page with examples:

- Creating new user
- Editing existing user
- Editing project
- Error handling

## Running the Application

```bash
cd c:\KeyStone\keystone
npm start
```

The application will be available at http://localhost:3000

After logging in through Microsoft Entra ID, go to the "Forms Demo" section for testing.

## Extension Possibilities

1. **Validation** - Add validation schemas (Yup, Zod)
2. **Localization** - Integrate i18n for multi-language support
3. **Themes** - Set up custom Material-UI themes
4. **Animations** - Add open/close animations
5. **Keyboard shortcuts** - ESC to close, Enter for OK
6. **Auto-save** - Save data on changes
7. **History** - Undo/redo changes

## Typing

The system is fully typed with TypeScript for type safety and better DX.

Examples of typed usage:

```typescript
interface UserModel {
  name: string;
  email: string;
}

interface ProjectModel {
  title: string;
  status: "active" | "completed";
}

// Typed usage
const result = await openForm<UserModel, UserModel>("userEditForm", userData);
const project = await openForm<ProjectModel, ProjectModel>(
  "projectEditForm",
  projectData,
);
```
