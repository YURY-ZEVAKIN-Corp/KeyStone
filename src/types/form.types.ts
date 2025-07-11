// Basic types for dynamic forms system

export interface FormButtonConfig {
  okButton?: boolean;
  cancelButton?: boolean;
  saveButton?: boolean;
  yesButton?: boolean;
  noButton?: boolean;
  /**
   * If true, disables the close (X) button in the form modal.
   */
  disableCloseButton?: boolean;
}

export interface DynamicFormProps {
  formId: string;
  inputModel: any;
  onChange: (outputModel: any) => void;
  onSave?: () => Promise<any> | any;
  buttonConfig?: FormButtonConfig;
}

export interface FormModalState {
  isOpen: boolean;
  formId: string | null;
  inputModel: any;
  resolve: ((value: any) => void) | null;
  reject: ((reason?: any) => void) | null;
  buttonConfig?: FormButtonConfig;
}

export interface FormComponent {
  default: React.ComponentType<DynamicFormProps>;
}

export type FormLoader = () => Promise<FormComponent>;

export interface FormRegistryItem {
  loader: FormLoader;
  displayName?: string;
  buttonConfig?: FormButtonConfig;
}

export interface FormRegistry {
  [formId: string]: FormRegistryItem;
}
