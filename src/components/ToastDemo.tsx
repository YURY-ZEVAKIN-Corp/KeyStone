import React from "react";
import { useToast } from "../hooks/useToast";
import { Box, Button, Typography, Paper, Stack, Divider } from "@mui/material";
import { CheckCircle, Error, Warning, Info } from "@mui/icons-material";

/**
 * ToastDemo component showcases all toast notification features.
 * Provides interactive examples with different configurations and usage documentation.
 *
 * @remarks
 * - Uses functional components and hooks as per project standards
 * - Follows Material-UI design principles
 * - Implements accessibility best practices
 */
export const ToastDemo: React.FC = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  const handleWarning = () => {
    toast.warning("Please check your input before proceeding.");
  };

  const handleInfo = () => {
    toast.info("Here's some helpful information for you.");
  };

  const handleCustomDuration = () => {
    toast.success("This toast will stay for 10 seconds!", {
      duration: 10000,
    });
  };

  const handleNonAutoHide = () => {
    toast.error("This toast won't auto-hide - close it manually!", {
      autoHide: false,
    });
  };

  const handleMultipleToasts = () => {
    toast.info("First toast");
    setTimeout(() => toast.success("Second toast"), 500);
    setTimeout(() => toast.warning("Third toast"), 1000);
    setTimeout(() => toast.error("Fourth toast"), 1500);
  };

  const handleClearAll = () => {
    toast.clear();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Toast Notifications Demo
      </Typography>

      <Typography variant="body1" paragraph>
        Demonstrate the toast notification system with various types,
        configurations, and behaviors.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Basic Toast Types */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Toast Types
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleSuccess}
                aria-label="Show success toast"
              >
                Success Toast
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<Error />}
                onClick={handleError}
                aria-label="Show error toast"
              >
                Error Toast
              </Button>

              <Button
                variant="contained"
                color="warning"
                startIcon={<Warning />}
                onClick={handleWarning}
                aria-label="Show warning toast"
              >
                Warning Toast
              </Button>

              <Button
                variant="contained"
                color="info"
                startIcon={<Info />}
                onClick={handleInfo}
                aria-label="Show info toast"
              >
                Info Toast
              </Button>
            </Stack>
          </Paper>
        </Box>

        {/* Advanced Configurations */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Configurations
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                onClick={handleCustomDuration}
                aria-label="Show toast with custom duration"
              >
                Custom Duration (10s)
              </Button>

              <Button
                variant="outlined"
                onClick={handleNonAutoHide}
                aria-label="Show toast that doesn't auto-hide"
              >
                Manual Close Only
              </Button>

              <Button
                variant="outlined"
                onClick={handleMultipleToasts}
                aria-label="Show multiple toasts"
              >
                Multiple Toasts
              </Button>

              <Divider />

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearAll}
                aria-label="Clear all toasts"
              >
                Clear All Toasts
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Usage Documentation */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Usage Examples
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Basic Usage:
        </Typography>
        <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" component="pre" fontFamily="monospace">
            {`import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const toast = useToast();

  const handleAction = () => {
    toast.success('Operation completed!');
  };

  return <Button onClick={handleAction}>Do Something</Button>;
};`}
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          With Custom Options:
        </Typography>
        <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1 }}>
          <Typography variant="body2" component="pre" fontFamily="monospace">
            {`// Custom duration
toast.success('Message', { duration: 5000 });

// Manual close only
toast.error('Critical error', { autoHide: false });

// Clear all toasts
toast.clear();`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
