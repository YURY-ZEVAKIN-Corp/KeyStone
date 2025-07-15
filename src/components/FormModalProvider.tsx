import React, {
  useState,
  useEffect,
  Suspense,
  ReactNode,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton, // Add IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Add CloseIcon import
import { FormService } from "../services/FormService";
import {
  FormModalState,
  DynamicFormProps,
  FormButtonConfig,
} from "../types/form.types";
import { getFormRegistryItem } from "../registry/FormRegistry";

interface FormModalProviderProps {
  children: ReactNode;
}

// Component for displaying form loading
const FormLoading: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight={200}
  >
    <CircularProgress />
    <Typography variant="body2" sx={{ ml: 2 }}>
      Loading form...
    </Typography>
  </Box>
);

// Component for displaying form loading error
const FormError: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <Box textAlign="center" p={3}>
    <Typography variant="h6" color="error" gutterBottom>
      Form loading error
    </Typography>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {error}
    </Typography>
    <Button variant="outlined" onClick={onRetry} sx={{ mt: 2 }}>
      Retry
    </Button>
  </Box>
);

export const FormModalProvider: React.FC<FormModalProviderProps> = ({
  children,
}) => {
  const [formState, setFormState] = useState<FormModalState | null>(null);
  const [outputModel, setOutputModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [FormComponent, setFormComponent] =
    useState<React.ComponentType<DynamicFormProps> | null>(null);
  const [buttonConfig, setButtonConfig] = useState<FormButtonConfig>({});

  const loadFormComponent = useCallback(
    async (formId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const registryItem = getFormRegistryItem(formId);
        const module = await registryItem.loader();

        // Get button config from registry item or form state, with fallback to defaults
        const config = formState?.buttonConfig ||
          registryItem.buttonConfig || {
            okButton: true,
            cancelButton: true,
            saveButton: false,
            yesButton: false,
            noButton: false,
          };

        setButtonConfig(config);
        setFormComponent(() => module.default);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to load form component:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [formState?.buttonConfig],
  );

  useEffect(() => {
    const handleFormOpen = (state: FormModalState) => {
      setFormState(state);
      setOutputModel(state.inputModel);
      setError(null);
      setIsLoading(true);
      if (state.formId) {
        loadFormComponent(state.formId);
      }
    };

    const handleFormClose = () => {
      setFormState(null);
      setFormComponent(null);
      setOutputModel(null);
      setError(null);
      setIsLoading(false);
    };

    FormService.on("form:open", handleFormOpen);
    FormService.on("form:close", handleFormClose);

    return () => {
      FormService.off("form:open", handleFormOpen);
      FormService.off("form:close", handleFormClose);
    };
  }, [loadFormComponent]);

  const handleClose = () => {
    FormService.rejectForm();
  };

  const handleOk = () => {
    FormService.resolveForm(outputModel);
  };

  const handleCancel = () => {
    FormService.rejectForm();
  };

  const handleSave = async () => {
    if (!FormComponent || !formState) return;

    try {
      // If form has an onSave method, call it
      const formInstance = document.querySelector(
        "[data-form-instance]",
      ) as any;
      if (formInstance && formInstance.onSave) {
        await formInstance.onSave();
      }
    } catch (err) {
      console.error("Save operation failed:", err);
      // Could add error notification here
    }
  };

  const handleYes = () => {
    FormService.resolveForm({ ...outputModel, result: "yes" });
  };

  const handleNo = () => {
    FormService.resolveForm({ ...outputModel, result: "no" });
  };

  const handleChange = (newOutputModel: any) => {
    setOutputModel(newOutputModel);
  };

  const handleRetryLoad = () => {
    if (formState?.formId) {
      loadFormComponent(formState.formId);
    }
  };

  if (!formState) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Dialog
        open={formState.isOpen}
        onClose={
          /* For ButtonDemoForm, use dynamic config from outputModel, otherwise use static buttonConfig */
          formState?.formId === "buttonDemoForm"
            ? outputModel?.disableCloseButton
            : buttonConfig.disableCloseButton
              ? undefined
              : handleClose
        }
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: 300 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {formState.formId}
          {/* For ButtonDemoForm, use dynamic config from outputModel, otherwise use static buttonConfig */}
          {(formState?.formId === "buttonDemoForm"
            ? !outputModel?.disableCloseButton
            : !buttonConfig.disableCloseButton) && (
            <IconButton
              aria-label="close"
              onClick={handleCancel}
              edge="end"
              size="small"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent>
          {isLoading && <FormLoading />}

          {error && <FormError error={error} onRetry={handleRetryLoad} />}

          {!isLoading && !error && FormComponent && (
            <Suspense fallback={<FormLoading />}>
              <div data-form-instance>
                <FormComponent
                  formId={formState.formId || ""}
                  inputModel={formState.inputModel}
                  onChange={handleChange}
                  onSave={handleSave}
                  buttonConfig={buttonConfig}
                />
              </div>
            </Suspense>
          )}
        </DialogContent>

        {!isLoading && !error && (
          <DialogActions>
            {/* For ButtonDemoForm, use dynamic button config from form data */}
            {formState?.formId === "buttonDemoForm" ? (
              <>
                {outputModel?.showSaveButton && (
                  <Button
                    onClick={handleSave}
                    color="primary"
                    variant="outlined"
                  >
                    Save
                  </Button>
                )}
                {outputModel?.showCancelButton && (
                  <Button onClick={handleCancel} color="secondary">
                    Cancel
                  </Button>
                )}
                {outputModel?.showYesButton && (
                  <Button onClick={handleYes} color="success">
                    Yes
                  </Button>
                )}
                {outputModel?.showNoButton && (
                  <Button onClick={handleNo} color="error">
                    No
                  </Button>
                )}
                {outputModel?.showOkButton && (
                  <Button
                    onClick={handleOk}
                    color="primary"
                    variant="contained"
                  >
                    OK
                  </Button>
                )}
              </>
            ) : (
              /* For other forms, use static button config */
              <>
                {buttonConfig.saveButton && (
                  <Button
                    onClick={handleSave}
                    color="primary"
                    variant="outlined"
                  >
                    Save
                  </Button>
                )}
                {buttonConfig.cancelButton && (
                  <Button onClick={handleCancel} color="secondary">
                    Cancel
                  </Button>
                )}
                {buttonConfig.yesButton && (
                  <Button onClick={handleYes} color="success">
                    Yes
                  </Button>
                )}
                {buttonConfig.noButton && (
                  <Button onClick={handleNo} color="error">
                    No
                  </Button>
                )}
                {buttonConfig.okButton && (
                  <Button
                    onClick={handleOk}
                    color="primary"
                    variant="contained"
                  >
                    OK
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
