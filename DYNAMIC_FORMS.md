# Dynamic Modal Forms System

This system allows opening forms as modal windows, where the form component is loaded dynamically by `formId`.

## Architecture

### Main Components

1. **FormService** - service for managing forms
2. **FormModalProvider** - modal window provider
3. **FormRegistry** - registry of available forms
4. **useFormService** - hook for convenient usage

### Types

```typescript
interface DynamicFormProps {
  formId: string;
  inputModel: any;
  onChange: (outputModel: any) => void;
  onSave?: () => Promise<any> | any;
}
```

## Usage

### 1. Form Registration

Add a new form to `src/registry/FormRegistry.ts`:

```typescript
export const formRegistry: FormRegistry = {
  userEditForm: {
    loader: () => import("../forms/UserEditForm"),
    displayName: "User Editing",
  },
  myNewForm: {
    loader: () => import("../forms/MyNewForm"),
    displayName: "My New Form",
  },
};
```

### 2. Creating Form Component

Create a form component implementing the `DynamicFormProps` interface:

```typescript
import React, { useState, useEffect } from 'react';
import { DynamicFormProps } from '../types/form.types';

const MyNewForm: React.FC<DynamicFormProps> = ({ inputModel, onChange, onSave }) => {
  const [formData, setFormData] = useState(inputModel);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleSave = async () => {
    // Save logic
    console.log('Saving:', formData);
  };

  // If you need to provide onSave method externally
  useImperativeHandle(ref, () => ({
    onSave: handleSave
  }));

  return (
    <div>
      {/* Your form */}
    </div>
  );
};

export default MyNewForm;
```

### 3. Using in Code

#### Option 1: Direct FormService Usage

```typescript
import { FormService } from "./services/FormService";

// Opening form
FormService.openForm("userEditForm", {
  name: "John",
  email: "john@example.com",
})
  .then((result) => {
    console.log("Form saved:", result);
  })
  .catch((error) => {
    console.log("Form cancelled:", error);
  });
```

#### Option 2: Using Hook

```typescript
import { useFormService } from './hooks/useFormService';

const MyComponent: React.FC = () => {
  const { openForm } = useFormService();

  const handleEdit = async () => {
    try {
      const result = await openForm('userEditForm', userData);
      // Process result
      setUserData(result);
    } catch (error) {
      // Form was cancelled
      console.log('Editing cancelled');
    }
  };

  return (
    <button onClick={handleEdit}>
      Edit User
    </button>
  );
};
```

## Modal Window Buttons

- **OK** - closes the form and returns `outputModel` via Promise
- **Cancel** - rejects Promise and closes the form
- **Save** - calls the form's `onSave()` method without closing the modal window

## Extension Possibilities

### 1. Adding Validation

```typescript
const MyForm: React.FC<DynamicFormProps> = ({ inputModel, onChange }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      throw new Error("Form contains errors");
    }
    // Saving...
  };

  // ...
};
```

### 2. Custom Buttons

You can extend `FormModalProvider` to support custom buttons:

```typescript
interface DynamicFormProps {
  // ...existing properties
  customButtons?: Array<{
    label: string;
    action: () => void;
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "error";
  }>;
}
```

### 3. Notifications

Add a notification system to display save status:

```typescript
import { Alert, Snackbar } from "@mui/material";

const MyForm: React.FC<DynamicFormProps> = ({ inputModel, onChange }) => {
  const [notification, setNotification] = useState(null);

  const handleSave = async () => {
    try {
      await saveToAPI(formData);
      setNotification({ type: "success", message: "Saved successfully!" });
    } catch (error) {
      setNotification({ type: "error", message: "Save error" });
    }
  };

  // ...
};
```

## Best Practices

1. **Typing** - always use TypeScript types for `inputModel` and `outputModel`
2. **Validation** - add validation on the form side
3. **Error Handling** - handle save errors
4. **Loading** - show loading indicators for long operations
5. **Testing** - cover form logic with tests

## Examples

See:

- `src/forms/UserEditForm.tsx` - example of a full-featured form
- `src/components/FormDemo.tsx` - usage demonstration
