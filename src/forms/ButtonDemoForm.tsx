import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { DynamicFormProps } from "../types/form.types";

// Interface for button demo model
interface ButtonDemoModel {
  title?: string;
  description: string;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  showSaveButton?: boolean;
  showYesButton?: boolean;
  showNoButton?: boolean;
  disableCloseButton?: boolean;
}

const ButtonDemoForm: React.FC<DynamicFormProps> = ({
  inputModel,
  onChange,
  buttonConfig,
}) => {
  // Initialize form state
  const [formData, setFormData] = useState<ButtonDemoModel>({
    title: "Button Configuration Demo",
    description: "This form demonstrates different button configurations",
    showOkButton: buttonConfig?.okButton || false,
    showCancelButton: buttonConfig?.cancelButton || false,
    showSaveButton: buttonConfig?.saveButton || false,
    showYesButton: buttonConfig?.yesButton || false,
    showNoButton: buttonConfig?.noButton || false,
    disableCloseButton: buttonConfig?.disableCloseButton || false,
    ...inputModel,
  });

  // Update parent component when data changes
  useEffect(() => {
    onChange({
      ...formData,
      // propagate disableCloseButton to parent (FormModalProvider)
      disableCloseButton: formData.disableCloseButton,
      okButton: formData.showOkButton,
      cancelButton: formData.showCancelButton,
      saveButton: formData.showSaveButton,
      yesButton: formData.showYesButton,
      noButton: formData.showNoButton,
    });
  }, [formData, onChange]);

  const handleChange = (field: keyof ButtonDemoModel, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {formData.title}
          </Typography>

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <Alert severity="info" sx={{ mb: 2 }}>
            This form demonstrates different button configurations. Toggle the
            switches below to simulate various button setups. The actual buttons
            at the bottom reflect your current configuration.
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Button Configuration Controls
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showSaveButton}
                  onChange={(e) => {
                    handleChange("showSaveButton", e.target.checked);
                  }}
                />
              }
              label="Save Button"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showCancelButton}
                  onChange={(e) => {
                    handleChange("showCancelButton", e.target.checked);
                  }}
                />
              }
              label="Cancel Button"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showYesButton}
                  onChange={(e) => {
                    handleChange("showYesButton", e.target.checked);
                  }}
                />
              }
              label="Yes Button"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showNoButton}
                  onChange={(e) => {
                    handleChange("showNoButton", e.target.checked);
                  }}
                />
              }
              label="No Button"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showOkButton}
                  onChange={(e) => {
                    handleChange("showOkButton", e.target.checked);
                  }}
                />
              }
              label="OK Button"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.disableCloseButton}
                  onChange={(e) => {
                    handleChange("disableCloseButton", e.target.checked);
                  }}
                />
              }
              label="Disable Close (X) Button"
            />
          </Box>

          <Alert severity="success" sx={{ mt: 2 }}>
            The buttons you enable above will appear at the bottom of this
            dialog! Try toggling them to see the effect.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ButtonDemoForm;
