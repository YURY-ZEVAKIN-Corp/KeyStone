import { FormRegistry } from "../types/form.types";

// Registry of all available forms
// Each form is loaded dynamically through React.lazy
export const formRegistry: FormRegistry = {
  userEditForm: {
    loader: () => import("../forms/UserEditForm"),
    displayName: "User Editing",
    buttonConfig: {
      okButton: true,
      cancelButton: true,
      saveButton: true,
      yesButton: false,
      noButton: false,
    },
  },
  projectEditForm: {
    loader: () => import("../forms/ProjectEditForm"),
    displayName: "Project Editing",
    buttonConfig: {
      okButton: true,
      cancelButton: true,
      saveButton: true,
      yesButton: false,
      noButton: false,
    },
  },
  confirmationForm: {
    loader: () => import("../forms/ConfirmationForm"),
    displayName: "Confirmation Dialog",
    buttonConfig: {
      okButton: false,
      cancelButton: false,
      saveButton: false,
      yesButton: true,
      noButton: true,
    },
  },
  buttonDemoForm: {
    loader: () => import("../forms/ButtonDemoForm"),
    displayName: "Button Configuration Demo",
    buttonConfig: {
      okButton: true,
      cancelButton: true,
      saveButton: true,
      yesButton: true,
      noButton: true,
    },
  },
  waitingFormDemo: {
    loader: () => import("../forms/WaitingFormDemo"),
    displayName: "Waiting Animation Demo Form",
    buttonConfig: {
      okButton: false,
      cancelButton: false,
      saveButton: false,
      yesButton: false,
      noButton: false,
    },
  },
  // New forms can be added here
  // exampleForm: {
  //   loader: () => import('../forms/ExampleForm'),
  //   displayName: 'Example Form',
  //   buttonConfig: {
  //     okButton: true,
  //     cancelButton: true,
  //     saveButton: false,
  //     yesButton: true,
  //     noButton: true,
  //   }
  // }
};

// Function to get form loader by ID
export const getFormLoader = (formId: string) => {
  const registryItem = formRegistry[formId];
  if (!registryItem) {
    throw new Error(`Form with id "${formId}" not found in registry`);
  }
  return registryItem.loader;
};

// Function to get form registry item by ID
export const getFormRegistryItem = (formId: string) => {
  const registryItem = formRegistry[formId];
  if (!registryItem) {
    throw new Error(`Form with id "${formId}" not found in registry`);
  }
  return registryItem;
};

// Function to get list of all registered forms
export const getRegisteredForms = () => {
  return Object.keys(formRegistry).map((formId) => ({
    formId,
    displayName: formRegistry[formId].displayName || formId,
  }));
};
