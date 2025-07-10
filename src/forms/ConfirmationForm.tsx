import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Card, CardContent } from "@mui/material";
import { DynamicFormProps } from "../types/form.types";

// Interface for confirmation model
interface ConfirmationModel {
  title?: string;
  message: string;
  severity?: "info" | "warning" | "error" | "success";
  result?: "yes" | "no";
}

const ConfirmationForm: React.FC<DynamicFormProps> = ({
  inputModel,
  onChange,
  buttonConfig,
}) => {
  // Initialize form state
  const [formData] = useState<ConfirmationModel>({
    title: "Confirmation",
    message: "Are you sure you want to proceed?",
    severity: "warning",
    ...inputModel,
  });

  // Update parent component when data changes
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {formData.title}
          </Typography>

          <Alert severity={formData.severity} sx={{ mb: 2 }}>
            {formData.message}
          </Alert>

          {buttonConfig && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Available buttons:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                {buttonConfig.okButton && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 0.5,
                      bgcolor: "primary.light",
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    OK
                  </Typography>
                )}
                {buttonConfig.cancelButton && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 0.5,
                      bgcolor: "grey.500",
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    Cancel
                  </Typography>
                )}
                {buttonConfig.saveButton && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 0.5,
                      bgcolor: "info.light",
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    Save
                  </Typography>
                )}
                {buttonConfig.yesButton && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 0.5,
                      bgcolor: "success.light",
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    Yes
                  </Typography>
                )}
                {buttonConfig.noButton && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 0.5,
                      bgcolor: "error.light",
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    No
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmationForm;
